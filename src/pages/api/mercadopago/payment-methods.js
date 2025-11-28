import { MercadoPagoConfig, PaymentMethod } from 'mercadopago'

// Cliente por defecto (prod). Para test, construimos por request.
let defaultClient
const getClient = (accessToken) => {
    if (accessToken) return new MercadoPagoConfig({ accessToken })
    if (!defaultClient) defaultClient = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN })
    return defaultClient
}

const handler = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' })
    }

    try {
        const isTest = (req.query?.test === '1' || req.query?.test === 'true') || (req.headers['x-test-mode'] === 'true')
        if (isTest && !process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN) {
            return res.status(400).json({ error: 'Test access token (MERCADO_PAGO_TEST_ACCESS_TOKEN) no está configurado' })
        }
        const accessTokenToUse = process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN

        const paymentMethod = new PaymentMethod(getClient(accessTokenToUse))

        // Obtener todos los métodos de pago
        const methods = await paymentMethod.get()
        console.log({ methodsCount: methods.length })
        // Filtrar solo los métodos activos y disponibles en Colombia
        const availableMethods = methods.filter(method =>
            method.status === 'active' &&
            // processing_modes is an array, check if it includes 'aggregator'
            method.processing_modes && method.processing_modes.includes('aggregator')
        )

        console.log(`Se encontraron ${availableMethods.length} métodos de pago disponibles`)

        res.status(200).json({
            methods: availableMethods.map(method => ({
                id: method.id,
                name: method.name,
                payment_type_id: method.payment_type_id,
                status: method.status,
                secure_thumbnail: method.secure_thumbnail,
                thumbnail: method.thumbnail,
                min_allowed_amount: method.min_allowed_amount,
                max_allowed_amount: method.max_allowed_amount,
                accreditation_time: method.accreditation_time,
                financial_institutions: method.financial_institutions
            }))
        })
    } catch (error) {
        console.error('Error obteniendo métodos de pago:', error)

        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        })
    }
}

export default handler
