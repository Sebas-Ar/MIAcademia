import { MercadoPagoConfig, Preference } from 'mercadopago'

// Configurar cliente de Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
})

const handler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' })
    }

    try {
        // Debug: verificar access token
        console.log('Access Token disponible:', !!process.env.MERCADO_PAGO_ACCESS_TOKEN)
        console.log('Access Token primeros caracteres:', process.env.MERCADO_PAGO_ACCESS_TOKEN?.substring(0, 10))

        const {
            items,
            payer,
            paymentMethods,
            backUrls,
            externalReference,
            metadata
        } = req.body

        // Debug: verificar datos recibidos
        console.log('Datos recibidos:', {
            itemsCount: items?.length,
            payerEmail: payer?.email,
            backUrls
        })

        // Validar datos requeridos
        if (!items || !items.length) {
            return res.status(400).json({ error: 'Items son requeridos' })
        }

        if (!payer || !payer.email) {
            return res.status(400).json({ error: 'Información del pagador es requerida' })
        }

        // Crear instancia de preferencia
        const preference = new Preference(client)

        // Construir URLs base
        const baseUrl = req.headers.origin ||
            (req.headers.host ? `https://${req.headers.host}` : null) ||
            'http://localhost:3000'

        console.log('Base URL detectada:', baseUrl)
        console.log('URLs de retorno:', {
            success: `${baseUrl}/asesoria-vocacional/payment/success`,
            failure: `${baseUrl}/asesoria-vocacional/payment/failure`,
            pending: `${baseUrl}/asesoria-vocacional/payment/pending`
        })

        // Configurar preferencia de pago
        const preferenceData = {
            items: items.map(item => ({
                id: item.id || `item_${Date.now()}`,
                title: item.title,
                description: item.description || '',
                quantity: item.quantity || 1,
                unit_price: item.unit_price,
                currency_id: item.currency_id || 'COP'
            })),
            payer: {
                name: 'Test',
                surname: 'User',
                email: 'your_test_email@example.com',
                phone: {
                    area_code: '11',
                    number: '4444-4444'
                },
                identification: {
                    type: 'CPF',
                    number: '19119119100'
                },
                address: {
                    zip_code: '06233200',
                    street_name: 'Street',
                    street_number: 123
                }
            },
            payment_methods: {
                excluded_payment_types: paymentMethods?.excluded_payment_types || [],
                excluded_payment_methods: paymentMethods?.excluded_payment_methods || [],
                installments: paymentMethods?.installments || 12,
                default_installments: 1
            },
            back_urls: {
                success: 'https://test.com/success',
                failure: 'https://test.com/failure',
                pending: 'https://test.com/pending'
            },
            auto_return: 'approved',
            external_reference: externalReference || `ref_${Date.now()}`,
            metadata: metadata || {},
            notification_url: `${baseUrl}/api/mercadopago/webhook`,
            statement_descriptor: 'MIA ACADEMY',
            binary_mode: false,
            expires: true,
            expiration_date_from: new Date().toISOString(),
            expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
            marketplace: 'NONE'
        }

        // Debug: Log completo de la preferencia antes de enviar
        console.log('Configuración completa de preferencia:', JSON.stringify(preferenceData, null, 2))

        // Crear preferencia en Mercado Pago
        const result = await preference.create({ body: preferenceData })

        console.log('Preferencia creada:', {
            id: result.id,
            init_point: result.init_point,
            sandbox_init_point: result.sandbox_init_point
        })

        // Retornar respuesta exitosa
        res.status(200).json({
            id: result.id,
            init_point: result.init_point,
            sandbox_init_point: result.sandbox_init_point,
            external_reference: result.external_reference,
            collector_id: result.collector_id
        })
    } catch (error) {
        console.error('Error creando preferencia de Mercado Pago:', error)

        // Manejo de errores específicos de Mercado Pago
        if (error.cause && error.cause.length > 0) {
            const mpError = error.cause[0]
            return res.status(400).json({
                error: 'Error de Mercado Pago',
                details: mpError.description || mpError.message,
                code: mpError.code
            })
        }

        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        })
    }
}

export default handler
