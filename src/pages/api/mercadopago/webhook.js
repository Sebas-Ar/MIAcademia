import { MercadoPagoConfig, Payment } from 'mercadopago'

// Configurar cliente de Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN
})

const handler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' })
    }

    try {
        const { type, data, action } = req.body

        console.log('Webhook recibido:', { type, data, action })

        // Verificar que es una notificación de pago
        if (type === 'payment') {
            const paymentId = data.id

            if (!paymentId) {
                return res.status(400).json({ error: 'ID de pago no encontrado' })
            }

            // Obtener información del pago
            const payment = new Payment(client)
            const paymentInfo = await payment.get({ id: paymentId })

            console.log('Información del pago:', {
                id: paymentInfo.id,
                status: paymentInfo.status,
                status_detail: paymentInfo.status_detail,
                external_reference: paymentInfo.external_reference,
                transaction_amount: paymentInfo.transaction_amount
            })

            // Procesar según el estado del pago
            switch (paymentInfo.status) {
                case 'approved':
                    await handleApprovedPayment(paymentInfo)
                    break
                case 'pending':
                    await handlePendingPayment(paymentInfo)
                    break
                case 'cancelled':
                case 'rejected':
                    await handleFailedPayment(paymentInfo)
                    break
                default:
                    console.log('Estado de pago no manejado:', paymentInfo.status)
            }
        }

        // Responder con éxito para confirmar recepción
        res.status(200).json({ received: true })
    } catch (error) {
        console.error('Error procesando webhook:', error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

// Manejar pago aprobado
const handleApprovedPayment = async (paymentInfo) => {
    try {
        console.log('Procesando pago aprobado:', paymentInfo.id)

        // Aquí puedes implementar la lógica para:
        // 1. Confirmar las sesiones en la base de datos
        // 2. Enviar emails de confirmación
        // 3. Actualizar el estado del pedido

        const metadata = paymentInfo.metadata || {}
        const sessions = metadata.sessions ? JSON.parse(metadata.sessions) : []
        const planData = metadata.plan_data ? JSON.parse(metadata.plan_data) : {}

        // Ejemplo de lógica para guardar las sesiones confirmadas
        if (sessions.length > 0) {
            // Aquí conectarías con tu base de datos para guardar las sesiones confirmadas
            console.log('Sesiones a confirmar:', sessions)
            console.log('Plan:', planData)

            // TODO: Implementar guardado en base de datos
            // await saveConfirmedSessions(sessions, paymentInfo)

            // TODO: Enviar email de confirmación
            // await sendConfirmationEmail(paymentInfo.payer.email, sessions)
        }
    } catch (error) {
        console.error('Error manejando pago aprobado:', error)
    }
}

// Manejar pago pendiente
const handlePendingPayment = async (paymentInfo) => {
    try {
        console.log('Procesando pago pendiente:', paymentInfo.id)

        // Aquí puedes implementar la lógica para:
        // 1. Notificar al usuario que el pago está pendiente
        // 2. Mantener las sesiones en estado "pendiente de pago"

        // TODO: Implementar notificación de pago pendiente
        // await sendPendingPaymentNotification(paymentInfo.payer.email)
    } catch (error) {
        console.error('Error manejando pago pendiente:', error)
    }
}

// Manejar pago fallido
const handleFailedPayment = async (paymentInfo) => {
    try {
        console.log('Procesando pago fallido:', paymentInfo.id)

        // Aquí puedes implementar la lógica para:
        // 1. Liberar las sesiones reservadas
        // 2. Notificar al usuario del fallo

        // TODO: Implementar liberación de sesiones y notificación
        // await releaseReservedSessions(paymentInfo.external_reference)
        // await sendFailedPaymentNotification(paymentInfo.payer.email)
    } catch (error) {
        console.error('Error manejando pago fallido:', error)
    }
}

export default handler
