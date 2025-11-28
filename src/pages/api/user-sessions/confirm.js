import { connectToMongoose } from '@/backend/clients/mongooseDB'
import { AgendaSlot, Payment } from '@/backend/db/models/booking.models'
import { User } from '@/backend/db/models/models'

export default async function handler (req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' })
    }

    try {
        const { userId, paymentData, sessionIds } = req.body

        if (!userId || !paymentData || !sessionIds || !Array.isArray(sessionIds)) {
            return res.status(400).json({
                error: 'Faltan datos requeridos',
                required: ['userId', 'paymentData', 'sessionIds']
            })
        }

        await connectToMongoose()

        // Obtener el usuario para verificar que las sesiones le pertenecen
        const user = await User.findById(userId).populate('scheduledSessions.sessions')
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }

        // Verificar que las sesiones existan y pertenezcan al usuario
        if (!user.scheduledSessions || !user.scheduledSessions.sessions || user.scheduledSessions.sessions.length === 0) {
            return res.status(404).json({ error: 'No se encontraron sesiones para confirmar' })
        }

        // Obtener los IDs de las sesiones del usuario para validar pertenencia
        const userSessionIds = user.scheduledSessions.sessions.map(session => session._id.toString())

        // Validar que todas las sesiones a confirmar pertenezcan al usuario
        const invalidSessions = sessionIds.filter(sessionId => !userSessionIds.includes(sessionId))
        if (invalidSessions.length > 0) {
            return res.status(403).json({
                error: 'Algunas sesiones no pertenecen al usuario',
                invalidSessions
            })
        }

        // Actualizar las sesiones directamente en AgendaSlot (fuente de verdad)
        const updateResult = await AgendaSlot.updateMany(
            {
                _id: { $in: sessionIds }
            },
            {
                $set: {
                    status: 'scheduled',
                    scheduled_by: userId,
                    scheduled_at: new Date()
                },
                $unset: {
                    pre_booked_by: 1,
                    pre_booked_at: 1,
                    pre_booking_expires_at: 1
                }
            }
        )

        if (updateResult.modifiedCount === 0) {
            return res.status(400).json({
                error: 'No se pudieron confirmar las sesiones. Verifique que estén pre-reservadas y sean válidas.'
            })
        }

        // Crear un solo registro de pago para todas las sesiones
        const paymentRecord = {
            user_id: userId,
            slot_ids: sessionIds, // Array de IDs de slots cubiertos por este pago
            payment_id: paymentData.payment_id || paymentData.id || `payment_${Date.now()}`,
            external_payment_id: paymentData.external_id || paymentData.payment_id,
            amount: paymentData.amount || 0,
            currency: paymentData.currency || 'COP',
            status: 'completed',
            payment_method: paymentData.payment_method || 'credit_card',
            payment_provider: paymentData.provider || 'mercadopago',
            completed_at: new Date(),
            metadata: {
                ...paymentData,
                confirmed_at: new Date(),
                session_confirmation: true,
                total_sessions: sessionIds.length
            }
        }

        // Insertar el registro de pago único
        const createdPayment = await Payment.create(paymentRecord)

        // Actualizar todos los AgendaSlots para agregar la referencia al mismo payment
        await AgendaSlot.updateMany(
            { _id: { $in: sessionIds } },
            { $push: { payments: createdPayment._id } }
        )

        // Obtener las sesiones actualizadas para devolverlas
        const confirmedSessions = await AgendaSlot.find({
            _id: { $in: sessionIds },
            scheduled_by: userId
        })

        res.status(200).json({
            message: 'Sesiones confirmadas exitosamente',
            confirmedSessions: updateResult.modifiedCount,
            sessions: confirmedSessions,
            payment: createdPayment,
            paymentInfo: paymentData
        })
    } catch (error) {
        console.error('Error confirming sessions:', error)
        res.status(500).json({
            error: 'Error interno del servidor al confirmar las sesiones',
            message: error.message
        })
    }
}
