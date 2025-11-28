const handler = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' })
    }

    try {
        const isTest = (req.query?.test === '1' || req.query?.test === 'true') || (req.headers['x-test-mode'] === 'true')
        if (isTest && !process.env.MERCADO_PAGO_TEST_PUBLIC_KEY) {
            return res.status(400).json({ error: 'Test public key (MERCADO_PAGO_TEST_PUBLIC_KEY) no está configurada' })
        }
        const publicKey = isTest
            ? process.env.MERCADO_PAGO_TEST_PUBLIC_KEY
            : process.env.MERCADO_PAGO_PUBLIC_KEY

        if (!publicKey) {
            return res.status(500).json({
                error: 'Clave pública no configurada'
            })
        }

        res.status(200).json({
            publicKey: publicKey
        })
    } catch (error) {
        console.error('Error obteniendo clave pública:', error)

        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        })
    }
}

export default handler
