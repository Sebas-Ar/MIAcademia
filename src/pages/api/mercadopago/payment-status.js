import { MercadoPagoConfig, Payment } from 'mercadopago'

/**
 * API endpoint para consultar el estado de un pago
 * Usado principalmente para verificar pagos PSE después del callback
 */
const handler = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' })
    }

    try {
        const { payment_id: paymentId } = req.query

        if (!paymentId) {
            return res.status(400).json({ error: 'payment_id es requerido' })
        }

        // Determinar si es modo test basado en headers
        const isTestMode = req.headers['x-test-mode'] === 'true'

        // Seleccionar access token apropiado
        const accessToken = isTestMode
            ? process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN
            : process.env.MERCADO_PAGO_ACCESS_TOKEN

        if (!accessToken) {
            return res.status(500).json({
                error: 'Credenciales de Mercado Pago no configuradas',
                details: isTestMode
                    ? 'MERCADO_PAGO_TEST_ACCESS_TOKEN no está definido'
                    : 'MERCADO_PAGO_ACCESS_TOKEN no está definido'
            })
        }

        // Configurar cliente de Mercado Pago
        const client = new MercadoPagoConfig({ accessToken })
        const payment = new Payment(client)

        console.log(`🔍 Consultando estado del pago: ${paymentId} (test: ${isTestMode})`)

        // Obtener información del pago
        const paymentData = await payment.get({ id: paymentId })

        console.log('✅ Pago consultado exitosamente:', {
            id: paymentData.id,
            status: paymentData.status,
            status_detail: paymentData.status_detail,
            payment_method_id: paymentData.payment_method_id
        })

        // Retornar información del pago
        return res.status(200).json({
            id: paymentData.id,
            status: paymentData.status,
            status_detail: paymentData.status_detail,
            payment_method_id: paymentData.payment_method_id,
            transaction_amount: paymentData.transaction_amount,
            transaction_details: paymentData.transaction_details,
            payer: {
                email: paymentData.payer?.email,
                identification: paymentData.payer?.identification
            },
            external_reference: paymentData.external_reference,
            metadata: paymentData.metadata,
            date_created: paymentData.date_created,
            date_approved: paymentData.date_approved
        })
    } catch (error) {
        console.error('❌ Error consultando estado del pago:', error)

        // Manejar errores específicos de Mercado Pago
        if (error.status === 404) {
            return res.status(404).json({
                error: 'Pago no encontrado',
                details: error.message
            })
        }

        return res.status(500).json({
            error: 'Error al consultar el estado del pago',
            details: error.message
        })
    }
}

export default handler
