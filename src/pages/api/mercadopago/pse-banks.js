export default async function handler (req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        // Verificar si es modo test desde los headers
        const isTestMode = req.headers['x-test-mode'] === 'true'

        // Usar el access token (no public key) para autenticación en el backend
        const accessToken = isTestMode
            ? process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN
            : process.env.MERCADO_PAGO_ACCESS_TOKEN

        if (!accessToken) {
            console.error('❌ Access token no configurado')
            return res.status(500).json({ error: 'Access token no configurado' })
        }

        console.log('🏦 Obteniendo métodos de pago desde Mercado Pago...')

        // Llamar al endpoint de payment methods con autenticación
        const paymentMethodsUrl = 'https://api.mercadopago.com/v1/payment_methods/search?site_id=MCO&id=pse'

        const response = await fetch(paymentMethodsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('❌ Error en respuesta de Mercado Pago:', errorText)
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const paymentMethodsData = await response.json()

        console.log('📦 Respuesta de Mercado Pago:', paymentMethodsData)

        // La respuesta es un objeto con un array "results"
        const results = paymentMethodsData.results

        if (!results || !Array.isArray(results) || results.length === 0) {
            console.warn('⚠️ No se encontraron métodos de pago PSE')
            return res.status(404).json({
                error: 'PSE no disponible',
                banks: []
            })
        }

        // Tomar el primer resultado PSE (ambos tienen la misma lista de bancos)
        const pseMethod = results[0]

        if (!pseMethod.financial_institutions || pseMethod.financial_institutions.length === 0) {
            console.warn('⚠️ PSE encontrado pero sin instituciones financieras')
            return res.status(404).json({
                error: 'PSE no tiene bancos disponibles',
                banks: []
            })
        }

        // Formatear los bancos
        const banks = pseMethod.financial_institutions.map(bank => ({
            id: bank.id,
            description: bank.description
        }))

        console.log(`✅ Se encontraron ${banks.length} bancos PSE`)

        return res.status(200).json({ banks })
    } catch (error) {
        console.error('❌ Error obteniendo bancos PSE:', error)
        return res.status(500).json({
            error: 'Error al obtener bancos PSE',
            message: error.message
        })
    }
}
