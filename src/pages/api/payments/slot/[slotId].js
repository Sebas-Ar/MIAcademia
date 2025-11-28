import { connectToMongoose } from '@/backend/clients/mongooseDB'
import { AgendaSlot, Payment } from '@/backend/db/models/booking.models'

export default async function handler (req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' })
    }

    try {
        const { slotId, status } = req.query

        if (!slotId) {
            return res.status(400).json({
                error: 'ID de slot requerido'
            })
        }

        await connectToMongoose()

        // Verificar que el slot existe
        const slot = await AgendaSlot.findById(slotId)
        if (!slot) {
            return res.status(404).json({ error: 'Slot no encontrado' })
        }

        // Obtener historial de pagos del slot
        const payments = await Payment.findBySlot(slotId, status)

        // Estadísticas del slot
        const paymentStats = {
            total_attempts: payments.length,
            successful_payments: payments.filter(p => p.status === 'completed').length,
            failed_payments: payments.filter(p => p.status === 'failed').length,
            pending_payments: payments.filter(p => p.status === 'pending').length,
            refunded_payments: payments.filter(p => p.status === 'refunded').length,
            total_amount: payments
                .filter(p => p.status === 'completed')
                .reduce((sum, p) => sum + p.amount, 0)
        }

        res.status(200).json({
            slot: {
                _id: slot._id,
                date: slot.date,
                status: slot.status,
                modality: slot.modality
            },
            payments,
            stats: paymentStats
        })
    } catch (error) {
        console.error('Error getting payment history:', error)
        res.status(500).json({
            error: 'Error al obtener historial de pagos',
            message: error.message
        })
    }
}
