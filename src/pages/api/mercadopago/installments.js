import { MercadoPagoConfig, PaymentMethod } from 'mercadopago'

// Configurar cliente de Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
})

const handler = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' })
    }

    try {
        const {
            payment_method_id: paymentMethodId,
            amount,
            issuer_id: issuerId
        } = req.query

        if (!paymentMethodId || !amount) {
            return res.status(400).json({
                error: 'payment_method_id y amount son requeridos'
            })
        }

        console.log('Obteniendo cuotas para:', { payment_method_id: paymentMethodId, amount, issuer_id: issuerId })

        const paymentMethod = new PaymentMethod(client)

        // Obtener las cuotas disponibles
        const installments = await paymentMethod.getInstallments({
            payment_method_id: paymentMethodId,
            amount: parseFloat(amount),
            issuer_id: issuerId ? parseInt(issuerId) : undefined
        })

        console.log(`Se encontraron ${installments.length} opciones de cuotas`)

        res.status(200).json({
            installments: installments.map(option => ({
                payment_method_id: option.payment_method_id,
                issuer: option.issuer,
                payer_costs: option.payer_costs.map(cost => ({
                    installments: cost.installments,
                    installment_rate: cost.installment_rate,
                    discount_rate: cost.discount_rate,
                    labels: cost.labels,
                    installment_rate_collector: cost.installment_rate_collector,
                    min_allowed_amount: cost.min_allowed_amount,
                    max_allowed_amount: cost.max_allowed_amount,
                    recommended_message: cost.recommended_message,
                    installment_amount: cost.installment_amount,
                    total_amount: cost.total_amount
                }))
            }))
        })
    } catch (error) {
        console.error('Error obteniendo cuotas:', error)

        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        })
    }
}

export default handler
