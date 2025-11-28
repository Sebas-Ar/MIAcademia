import { connectToMongoose } from '../clients/mongooseDB.js'
import { AgendaSlot } from '../db/models/booking.models.js'
// Asegurar que todos los modelos estén registrados
import '../db/models/models.js'

// Obtener agenda slots (renombrado de getSchedules)
export const getSchedules = async (req, res) => {
    try {
        const { status, modality, startDate, endDate } = req.query

        // Construir filtros
        const filters = {}

        if (status) {
            filters.status = status
        }

        if (modality) {
            filters.modality = modality
        }

        if (startDate || endDate) {
            filters.date = {}
            if (startDate) {
                filters.date.$gte = new Date(startDate)
            }
            if (endDate) {
                filters.date.$lte = new Date(endDate)
            }
        }
        await connectToMongoose()

        // Limpiar slots pre-reservados expirados antes de consultar
        await AgendaSlot.cleanExpiredPreBookings()

        const agendaSlots = await AgendaSlot.find(filters)
            .populate('pre_booked_by', 'name email')
            .populate('scheduled_by', 'name email')
            .sort({ date: 1 })

        res.status(200).json({
            count: agendaSlots.length,
            slots: agendaSlots
        })
    } catch (error) {
        console.error('Error fetching agenda slots:', error)
        res.status(500).json({
            error: 'Error al obtener los slots de agenda',
            message: error.message
        })
    }
}

// Crear slots de agenda (múltiples)
export const createSchedule = async (req, res) => {
    try {
        const { slots } = req.body

        // Validar que se envíen slots
        if (!slots || !Array.isArray(slots) || slots.length === 0) {
            return res.status(400).json({
                error: 'Se requiere un array de slots válido',
                message: 'El campo "slots" debe ser un array con al menos un elemento'
            })
        }

        // Validar estructura de cada slot
        const invalidSlots = []
        const validSlots = []

        slots.forEach((slot, index) => {
            if (!slot.date || !slot.modality) {
                invalidSlots.push({
                    index,
                    slot,
                    error: 'Faltan campos requeridos: date, modality'
                })
            } else if (!['virtual', 'presencial', 'llamada'].includes(slot.modality)) {
                invalidSlots.push({
                    index,
                    slot,
                    error: 'Modalidad inválida. Debe ser: virtual, presencial o llamada'
                })
            } else {
                // Convertir fecha si es string
                const slotData = {
                    date: new Date(slot.date),
                    modality: slot.modality,
                    status: slot.status || 'available'
                }

                // Validar fecha
                if (isNaN(slotData.date.getTime())) {
                    invalidSlots.push({
                        index,
                        slot,
                        error: 'Fecha inválida'
                    })
                } else {
                    validSlots.push(slotData)
                }
            }
        })

        // Si hay slots inválidos, retornar error
        if (invalidSlots.length > 0) {
            console.log('Slots inválidos encontrados:', invalidSlots)
            return res.status(400).json({
                error: 'Hay slots con formato inválido',
                invalidSlots,
                message: `${invalidSlots.length} slots tienen errores de validación`
            })
        }

        console.log(`${validSlots.length} slots válidos listos para insertar`)

        await connectToMongoose()
        // Crear los slots en la base de datos
        const createdSlots = await AgendaSlot.insertMany(validSlots)

        res.status(201).json({
            message: `${createdSlots.length} slots de agenda creados exitosamente`,
            slotsCreated: createdSlots.length,
            slots: createdSlots
        })
    } catch (error) {
        console.error('Error creating agenda slots:', error)

        // Manejar errores específicos de MongoDB
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Error de validación en los datos',
                details: error.message
            })
        }

        if (error.code === 11000) {
            return res.status(409).json({
                error: 'Conflicto: Ya existe un slot con esa fecha y hora',
                details: error.message
            })
        }

        res.status(500).json({
            error: 'Error interno del servidor al crear los slots',
            message: error.message
        })
    }
}

// Actualizar un slot de agenda con Optimistic Locking
export const updateSchedule = async (req, res) => {
    try {
        const { id } = req.query
        const updates = req.body
        console.log({ updates })

        // Validar campos permitidos para actualización
        const allowedUpdates = ['status', 'pre_booked_by', 'pre_booked_at', 'pre_booking_expires_at', 'scheduled_by', 'planId']
        const updateKeys = Object.keys(updates).filter(key => key !== '__v')
        const isValidOperation = updateKeys.every(update => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).json({
                error: 'Campos de actualización inválidos',
                allowedFields: allowedUpdates
            })
        }

        await connectToMongoose()

        // Limpiar slots pre-reservados expirados antes de procesar la actualización
        await AgendaSlot.cleanExpiredPreBookings()

        // OPTIMISTIC LOCKING: Obtener la versión actual del documento
        const currentSlot = await AgendaSlot.findById(id)
        if (!currentSlot) {
            return res.status(404).json({ error: 'Slot de agenda no encontrado' })
        }

        // Verificar si el cliente envió una versión específica para validar
        const clientVersion = updates.__v
        if (clientVersion !== undefined && currentSlot.__v !== clientVersion) {
            return res.status(409).json({
                error: 'Conflicto de concurrencia detectado',
                message: 'El slot ha sido modificado por otro usuario. Por favor, recarga los datos y vuelve a intentar.',
                currentVersion: currentSlot.__v,
                clientVersion: clientVersion,
                slot: currentSlot
            })
        }

        // VALIDACIÓN ESPECÍFICA PARA PRE-BOOKING: Verificar disponibilidad
        if (updates.status === 'pre-booked' || updates.pre_booked_by) {
            // Verificar que el slot esté disponible para pre-booking
            if (currentSlot.status !== 'available') {
                return res.status(409).json({
                    error: 'Slot no disponible para reserva',
                    message: `El slot ya está en estado: ${currentSlot.status}`,
                    currentStatus: currentSlot.status,
                    slot: currentSlot
                })
            }

            // Verificar que no haya expirado una pre-reserva anterior
            if (currentSlot.pre_booking_expires_at && currentSlot.pre_booking_expires_at > new Date()) {
                return res.status(409).json({
                    error: 'Slot temporalmente reservado',
                    message: 'Este slot está pre-reservado por otro usuario',
                    expiresAt: currentSlot.pre_booking_expires_at,
                    slot: currentSlot
                })
            }
        }

        // Usar findOneAndUpdate con la versión actual para garantizar atomicidad
        const query = {
            _id: id,
            __v: currentSlot.__v // Solo actualizar si la versión coincide
        }

        // Preparar las actualizaciones
        const updateData = { ...updates }
        delete updateData.__v // Remover __v de las actualizaciones, Mongoose lo maneja automáticamente

        console.log({ updateData })
        const updatedSlot = await AgendaSlot.findOneAndUpdate(
            query,
            {
                $set: updateData,
                $inc: { __v: 1 } // Incrementar versión manualmente para mayor control
            },
            {
                new: true,
                runValidators: true
            }
        )

        // Si no se encontró el documento con esa versión, significa que hubo un conflicto
        if (!updatedSlot) {
            // Obtener el estado actual para informar del conflicto
            const conflictSlot = await AgendaSlot.findById(id)
            return res.status(409).json({
                error: 'Conflicto de concurrencia detectado',
                message: 'El slot ha sido modificado por otro usuario durante la operación. Por favor, recarga los datos y vuelve a intentar.',
                expectedVersion: currentSlot.__v,
                currentVersion: conflictSlot?.__v,
                slot: conflictSlot
            })
        }

        res.status(200).json({
            message: 'Slot actualizado exitosamente',
            slot: updatedSlot,
            version: updatedSlot.__v
        })
    } catch (error) {
        console.error('Error updating agenda slot:', error)

        // Manejar errores específicos
        if (error.name === 'CastError') {
            return res.status(400).json({
                error: 'ID de slot inválido',
                message: error.message
            })
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Error de validación',
                message: error.message,
                details: error.errors
            })
        }

        res.status(500).json({
            error: 'Error interno del servidor al actualizar el slot',
            message: error.message
        })
    }
}

// Eliminar un slot de agenda
export const deleteSchedule = async (req, res) => {
    try {
        const { id } = req.query

        await connectToMongoose()
        const deletedSlot = await AgendaSlot.findByIdAndDelete(id)
        if (!deletedSlot) {
            return res.status(404).json({ error: 'Slot de agenda no encontrado' })
        }

        res.status(200).json({
            message: 'Slot eliminado exitosamente',
            deletedSlot
        })
    } catch (error) {
        console.error('Error deleting agenda slot:', error)
        res.status(500).json({
            error: 'Error al eliminar el slot',
            message: error.message
        })
    }
}
