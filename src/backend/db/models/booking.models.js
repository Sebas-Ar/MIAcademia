import mongoose from 'mongoose'

// Importar User model para las referencias (necesario para populate)
// eslint-disable-next-line no-unused-vars

// ====================================
// MODELO 1: AGENDA SLOTS (Citas disponibles)
// ====================================
const agendaSlotSchema = new mongoose.Schema({
    // PLAN ASOCIADO
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        default: null
    },

    // DATOS BÁSICOS DE LA CITA
    modality: {
        type: String,
        enum: ['presencial', 'virtual', 'llamada'],
        required: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },

    // ESTADO DEL SLOT
    status: {
        type: String,
        enum: ['available', 'pre-booked', 'scheduled'],
        default: 'available',
        index: true
    },

    // DATOS DE PRE-AGENDA (30 min de reserva temporal)
    pre_booked_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    pre_booked_at: {
        type: Date,
        default: null
    },
    pre_booking_expires_at: {
        type: Date,
        default: null,
        index: true
    },

    // DATOS DE CONFIRMACIÓN
    scheduled_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    secheduled_at: {
        type: Date,
        default: null
    },

    // REFERENCIAS A PAGOS RELACIONADOS
    payments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    }]

    // NOTA: Los datos de pago se manejan en el modelo Payment separado
    // para mejor separación de responsabilidades y escalabilidad

    // NOTA: El control de concurrencia (Optimistic Locking) se maneja
    // automáticamente con el campo __v de Mongoose
}, {
    timestamps: true
})

// ÍNDICES ESENCIALES
agendaSlotSchema.index({ date: 1, status: 1 })
agendaSlotSchema.index({ status: 1, pre_booking_expires_at: 1 })

// ====================================
// MODELO 2: PAYMENTS (Pagos y transacciones)
// ====================================
const paymentSchema = new mongoose.Schema({
    // REFERENCIAS
    slot_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AgendaSlot'
    }], // Para pagos que cubren múltiples slots
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: null
    },

    // DATOS DE TRANSACCIÓN
    payment_id: {
        type: String,
        required: true,
        unique: true
    },
    external_payment_id: {
        type: String, // ID de MercadoPago, Stripe, etc.
        default: null
    },

    // MONTOS
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'COP',
        enum: ['COP', 'USD', 'EUR']
    },

    // ESTADO DEL PAGO
    status: {
        type: String,
        enum: [
            'pending', // Pago iniciado
            'processing', // En proceso
            'completed', // Completado exitosamente
            'failed', // Falló
            'refunded', // Reembolsado
            'cancelled' // Cancelado
        ],
        default: 'pending',
        index: true
    },

    // MÉTODO DE PAGO
    payment_method: {
        type: String,
        enum: ['credit_card', 'debit_card', 'bank_transfer', 'digital_wallet', 'cash'],
        required: true
    },
    payment_provider: {
        type: String,
        enum: ['mercadopago', 'stripe', 'paypal', 'manual'],
        required: true
    },

    // TIMESTAMPS DE TRANSACCIÓN
    initiated_at: {
        type: Date,
        default: Date.now
    },
    completed_at: {
        type: Date,
        default: null
    },
    failed_at: {
        type: Date,
        default: null
    },

    // DATOS ADICIONALES
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    // INFORMACIÓN DE ERROR (si aplica)
    error_message: {
        type: String,
        default: null
    },
    error_code: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})

// ÍNDICES ESENCIALES PARA PAYMENTS
paymentSchema.index({ user_id: 1, status: 1 })
paymentSchema.index({ slot_id: 1, status: 1 })
paymentSchema.index({ external_payment_id: 1 }, { sparse: true })
paymentSchema.index({ completed_at: 1 })

// MÉTODOS ESTÁTICOS PARA PAYMENTS
paymentSchema.statics.findBySlot = function (slotId, status = null) {
    const query = {
        $or: [
            { slot_id: slotId }, // Pagos individuales
            { slot_ids: slotId } // Pagos múltiples que incluyen este slot
        ]
    }
    if (status) query.status = status
    return this.find(query).sort({ createdAt: -1 })
}

paymentSchema.statics.getPaymentHistory = function (userId, startDate = null, endDate = null) {
    const query = { user_id: userId }
    if (startDate || endDate) {
        query.completed_at = {}
        if (startDate) query.completed_at.$gte = startDate
        if (endDate) query.completed_at.$lte = endDate
    }
    return this.find(query).populate('slot_id').sort({ completed_at: -1 })
}

// ====================================
// MODELO 3: BOOKING EVENTS (Auditoría)
// ====================================
const bookingEventSchema = new mongoose.Schema({
    // REFERENCIAS
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        index: true
    },
    slot_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AgendaSlot'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // EVENTO
    evento: {
        type: String,
        enum: [
            'slot_pre_booked', // Usuario pre-agenda un slot
            'payment_completed', // Pago exitoso
            'booking_cancelled' // Cancelación
        ],
        required: true
    },

    // TIMESTAMP
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },

    // DATOS ADICIONALES (opcional)
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    collection: 'booking_events'
})

// ÍNDICE ESENCIAL
bookingEventSchema.index({ booking_id: 1, timestamp: -1 })

// ====================================
// MÉTODOS ESENCIALES
// ====================================

// LIMPIAR SLOTS EXPIRADOS
agendaSlotSchema.statics.cleanExpiredPreBookings = function () {
    return this.updateMany(
        {
            status: 'pre-booked',
            pre_booking_expires_at: { $lt: new Date() }
        },
        {
            $set: {
                status: 'available',
                pre_booked_by: null,
                pre_booked_at: null,
                pre_booking_expires_at: null
            }
        }
    )
}

// OBTENER SLOT CON HISTORIAL DE PAGOS
agendaSlotSchema.statics.findWithPayments = function (query) {
    return this.find(query).populate({
        path: 'payments',
        options: { sort: { createdAt: -1 } } // Más recientes primero
    })
}

// OBTENER ÚLTIMO PAGO EXITOSO
agendaSlotSchema.methods.getLastSuccessfulPayment = function () {
    return this.populate({
        path: 'payments',
        match: { status: 'completed' },
        options: { sort: { completed_at: -1 }, limit: 1 }
    })
}

// NOTA: Los métodos de pre-booking y confirmación se manejan directamente
// en el controlador con Optimistic Locking usando el campo __v de Mongoose

export const AgendaSlot = mongoose.models.AgendaSlot || mongoose.model('AgendaSlot', agendaSlotSchema)
export const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema)
export const BookingEvent = mongoose.models.BookingEvent || mongoose.model('BookingEvent', bookingEventSchema)
