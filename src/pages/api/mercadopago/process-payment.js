import { MercadoPagoConfig, Payment } from 'mercadopago'

// Configurar cliente de Mercado Pago (nota: el access token podrá cambiar por request si viene en modo test)
let defaultClient
const getClient = (accessToken) => {
    if (accessToken) {
        return new MercadoPagoConfig({ accessToken })
    }
    if (!defaultClient) {
        defaultClient = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN })
    }
    return defaultClient
}

const handler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' })
    }

    try {
        console.log('Procesando pago con Core Methods:', req.body)

        const {
            token,
            paymentMethodId,
            paymentTypeId, // 'credit_card' | 'debit_card' | 'prepaid_card' | 'bank_transfer' | 'ticket' | etc
            issuerId,
            installments,
            transactionAmount,
            description,
            payer,
            externalReference,
            metadata,
            additionalInfo, // camelCase from client, map to additional_info for MP API
            callbackUrl, // URL de retorno para PSE
            testMode // optional flag from client for running with test credentials
        } = req.body

        const isTestMode = Boolean(testMode) || req.headers['x-test-mode'] === 'true'
        console.log('Test mode detection:', { testMode, header: req.headers['x-test-mode'], isTestMode })

        // Validar datos requeridos
        // Para tarjeta: permitimos ausencia de paymentMethodId si hay token
        // Para otros métodos: paymentMethodId es obligatorio
        const isCardPayment = Boolean(token) || ['credit_card', 'debit_card', 'prepaid_card'].includes(paymentTypeId)
        if (!isCardPayment && !paymentMethodId) {
            return res.status(400).json({ error: 'Método de pago es requerido' })
        }

        if (!transactionAmount || transactionAmount <= 0) {
            return res.status(400).json({ error: 'Monto de transacción inválido' })
        }

        if (!payer || !payer.email) {
            return res.status(400).json({ error: 'Información del pagador es requerida' })
        }

        // Si es pago con tarjeta, el token es obligatorio
        if (isCardPayment && !token) {
            return res.status(400).json({ error: 'Token de la tarjeta es requerido para pagos con tarjeta' })
        }

        // Crear instancia de pago con el access token correspondiente
        if (isTestMode && !process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN) {
            return res.status(400).json({ error: 'Test access token (MERCADO_PAGO_TEST_ACCESS_TOKEN) no está configurado' })
        }
        const accessTokenToUse = isTestMode
            ? process.env.MERCADO_PAGO_TEST_ACCESS_TOKEN
            : process.env.MERCADO_PAGO_ACCESS_TOKEN
        const payment = new Payment(getClient(accessTokenToUse))

        // Configurar datos del pago
        // Determinar una base URL pública para webhooks (túnel en dev, dominio en prod)
        const getBaseUrl = () => {
            const envUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').trim()
            const headerProto = req.headers['x-forwarded-proto'] || req.headers['x-forwarded-protocol']
            const headerHost = req.headers['x-forwarded-host'] || req.headers.host
            const headerUrl = headerProto && headerHost ? `${headerProto}://${headerHost}` : undefined

            const candidate = envUrl || headerUrl
            if (!candidate) return undefined
            try {
                const u = new URL(candidate)
                // Evitar localhost en producción; permitirlo sólo si se explicitó
                const isLocal = ['localhost', '127.0.0.1'].includes(u.hostname)
                if (isLocal && process.env.ALLOW_LOCAL_NOTIFICATION_URL !== 'true') return undefined
                return u.origin
            } catch {
                return undefined
            }
        }
        const baseUrl = getBaseUrl()
        const amountToCharge = isTestMode ? 10000 : parseFloat(transactionAmount)
        console.log('Amount calculation:', { originalAmount: transactionAmount, isTestMode, amountToCharge })

        // Truncar descripción si es muy larga (máximo 256 caracteres según MP)
        const truncatedDescription = (description || 'Asesoría Vocacional MIA Academy').slice(0, 256)

        const paymentData = {
            transaction_amount: amountToCharge,
            // token sólo si viene (p.ej. pagos con tarjeta)
            token: token,
            description: truncatedDescription,
            installments: parseInt(installments) || 1,
            payment_method_id: paymentMethodId,
            issuer_id: issuerId ? parseInt(issuerId) : undefined,
            payer: {
                email: payer.email,
                first_name: isTestMode ? 'APRO' : (payer.first_name || 'Cliente'),
                last_name: isTestMode ? 'TEST' : (payer.last_name || 'MIA'),
                identification: payer.identification
                    ? {
                        type: isTestMode ? 'CC' : (payer.identification.type || 'CC'),
                        number: isTestMode ? '12345678' : payer.identification.number
                    }
                    : undefined,
                phone: payer.phone
                    ? {
                        area_code: payer.phone.area_code || '57',
                        number: payer.phone.number
                    }
                    : undefined,
                address: payer.address
                    ? {
                        zip_code: payer.address.zip_code || '110111',
                        street_name: payer.address.street_name || 'Calle Principal',
                        street_number: payer.address.street_number || 123
                    }
                    : undefined
            },
            external_reference: externalReference || `payment_${Date.now()}`,
            metadata: { ...(metadata || {}), _test_mode: isTestMode ? true : undefined },
            // notification_url se define sólo si hay una base URL pública válida
            // (en dev, usar un túnel y establecer NEXT_PUBLIC_SITE_URL)
            // Nota: si es undefined, el SDK omitirá la propiedad
            notification_url: baseUrl ? `${baseUrl}/api/mercadopago/webhook` : undefined,
            // callback_url: usar el que viene del frontend o generar uno por defecto
            // Para PSE es OBLIGATORIO, así que si no viene, usar baseUrl o una URL por defecto
            callback_url: (baseUrl ? `${baseUrl}/asesoria-vocacional/payment` : undefined),
            statement_descriptor: 'MIA ACADEMY',
            binary_mode: false,
            capture: true
        }

        // En test mode, simplificar para evitar rechazos por configuración
        if (isTestMode) {
            paymentData.installments = 1
            // Dejar que MP infiera método/issuer desde el token
            delete paymentData.payment_method_id
            delete paymentData.issuer_id
            paymentData.binary_mode = true
        }

        // Si es tarjeta, derivar payment_method_id y issuer_id desde el token para evitar desajustes
        if (isCardPayment && token && !isTestMode) {
            try {
                const resp = await fetch(`https://api.mercadopago.com/v1/card_tokens/${encodeURIComponent(token)}`, {
                    headers: {
                        Authorization: `Bearer ${accessTokenToUse}`
                    }
                })
                if (resp.ok) {
                    const tokenInfo = await resp.json()
                    try {
                        const keys = Object.keys(tokenInfo || {})
                        console.log('Token info keys:', keys)
                        if (tokenInfo && tokenInfo.site_id) {
                            console.log('Token site_id:', tokenInfo.site_id)
                        }
                    } catch {}
                    // Algunos entornos devuelven payment_method_id directo; en otros viene anidado
                    const pmFromToken = tokenInfo.payment_method_id || tokenInfo.payment_method?.id
                    const issuerFromToken = tokenInfo.issuer_id || tokenInfo.issuer?.id || tokenInfo.card?.issuer?.id
                    console.log('Token de tarjeta consultado:', {
                        payment_method_from_token: pmFromToken,
                        issuer_from_token: issuerFromToken
                    })
                    if (pmFromToken) {
                        paymentData.payment_method_id = pmFromToken
                    } else {
                        // Si no logramos derivar el método de pago desde el token, evitar enviar uno incorrecto
                        delete paymentData.payment_method_id
                    }
                    if (issuerFromToken) {
                        paymentData.issuer_id = parseInt(issuerFromToken)
                    } else {
                        // Si no logramos derivar issuer desde el token, evitar enviar uno incorrecto
                        delete paymentData.issuer_id
                    }
                } else {
                    const text = await resp.text()
                    console.warn('No se pudo obtener info del token de tarjeta:', resp.status, text)
                    // Evitar enviar IDs potencialmente incorrectos
                    delete paymentData.payment_method_id
                    delete paymentData.issuer_id
                }
            } catch (e) {
                console.warn('Error consultando token de tarjeta:', e?.message || e)
                // Evitar enviar IDs potencialmente incorrectos
                delete paymentData.payment_method_id
                delete paymentData.issuer_id
            }
        } else if (isCardPayment) {
            // Sin token info confiable, no enviar method/issuer y dejar que MP infiera
            delete paymentData.payment_method_id
            delete paymentData.issuer_id
        }

        // Asegurar objeto additional_info y enriquecer con datos útiles para antifraude (sin exponer sensibles)
        try {
            paymentData.additional_info = paymentData.additional_info || {}
            // Items de la compra
            const items = []
            let sessionsCount
            if (metadata?.sessions) {
                try {
                    const arr = JSON.parse(metadata.sessions)
                    if (Array.isArray(arr)) sessionsCount = arr.length
                } catch {}
            }
            items.push({
                id: 'asesoria-vocacional',
                title: 'Asesoría Vocacional',
                description: sessionsCount ? `${sessionsCount} sesión(es)` : undefined,
                category_id: 'educational_services',
                quantity: 1,
                unit_price: amountToCharge
            })
            paymentData.additional_info.items = paymentData.additional_info.items || items

            // Payer complementario (sin identification en additional_info.payer)
            const p = paymentData.payer || {}
            paymentData.additional_info.payer = {
                first_name: isTestMode ? 'APRO' : p.first_name,
                last_name: isTestMode ? 'TEST' : p.last_name,
                phone: p.phone ? { area_code: p.phone.area_code, number: p.phone.number } : undefined,
                address: p.address
                    ? {
                        zip_code: p.address.zip_code,
                        street_name: p.address.street_name,
                        street_number: p.address.street_number
                    }
                    : undefined
                // No incluir identification aquí - debe ir solo en payer principal
            }
        } catch {}

        // Mapear additionalInfo del cliente a additional_info (snake_case) para MP (mezclar en lugar de reemplazar)
        if (additionalInfo && typeof additionalInfo === 'object') {
            paymentData.additional_info = { ...(paymentData.additional_info || {}), ...additionalInfo }
        } else {
            paymentData.additional_info = paymentData.additional_info || {}
        }

        // Agregar IP del cliente si no viene en additionalInfo
        try {
            const fwdFor = req.headers['x-forwarded-for'] || req.headers['x-real-ip']
            const ipFromHeader = Array.isArray(fwdFor)
                ? fwdFor[0]
                : (typeof fwdFor === 'string' ? fwdFor.split(',')[0] : undefined)
            const socketIp = req.socket && req.socket.remoteAddress
            const ipAddress = (ipFromHeader || socketIp || '').toString().trim()
            if (ipAddress && !paymentData.additional_info.ip_address) {
                paymentData.additional_info.ip_address = ipAddress
            }
        } catch {}

        // PSE (transferencia bancaria en CO) requiere el banco y tipo de persona
        if (paymentMethodId === 'pse') {
            console.log('🏦 Configurando pago PSE con:', {
                bank: metadata?.bank,
                bankType: typeof metadata?.bank,
                userType: metadata?.userType,
                callbackUrl,
                transactionAmount: amountToCharge
            })

            // Validar montos para PSE (según documentación de Mercado Pago)
            const PSE_MIN_AMOUNT = 1600 // COP
            const PSE_MAX_AMOUNT = 340000000 // COP

            if (amountToCharge < PSE_MIN_AMOUNT) {
                return res.status(400).json({
                    error: `El monto mínimo para PSE es $${PSE_MIN_AMOUNT.toLocaleString('es-CO')} COP`,
                    status: 'error'
                })
            }

            if (amountToCharge > PSE_MAX_AMOUNT) {
                return res.status(400).json({
                    error: `El monto máximo para PSE es $${PSE_MAX_AMOUNT.toLocaleString('es-CO')} COP`,
                    status: 'error'
                })
            }

            // transaction_details.financial_institution con el ID del banco (string)
            const bank = (metadata && (metadata.bank || metadata.financial_institution)) || undefined
            if (!bank) {
                return res.status(400).json({
                    error: 'Debes seleccionar un banco para pagar con PSE',
                    status: 'error'
                })
            }

            // Convertir el ID del banco a string y loguear información detallada
            const bankString = bank.toString().trim()

            paymentData.transaction_details = {
                ...(paymentData.transaction_details || {}),
                financial_institution: bankString
            }
            console.log('✅ Banco PSE configurado:', {
                bankOriginal: bank,
                bankString,
                bankLength: bankString.length,
                bankType: typeof bankString
            })

            // Mapear userType (N/J) a entity_type esperado por MP: 'individual' | 'association'
            const userType = metadata && metadata.userType
            const entityType = userType === 'J' ? 'association' : 'individual'
            paymentData.payer = {
                ...paymentData.payer,
                entity_type: entityType
            }
            console.log('✅ Tipo de entidad PSE configurado:', entityType)

            // Asegurar que los datos del pagador están completos para PSE
            if (!paymentData.payer.identification || !paymentData.payer.identification.number) {
                return res.status(400).json({
                    error: 'La identificación del pagador es requerida para PSE',
                    status: 'error'
                })
            }

            // IMPORTANTE: PSE requiere datos completos de dirección y teléfono (obligatorio según docs MP)
            // Asegurar dirección completa
            if (!paymentData.payer.address) {
                paymentData.payer.address = {}
            }
            paymentData.payer.address = {
                zip_code: paymentData.payer.address.zip_code || '110111',
                street_name: paymentData.payer.address.street_name || 'Calle',
                street_number: paymentData.payer.address.street_number || '1',
                neighborhood: paymentData.payer.address.neighborhood || 'Centro',
                city: paymentData.payer.address.city || 'Bogotá',
                federal_unit: paymentData.payer.address.federal_unit || 'DC'
            }

            // Asegurar teléfono completo
            if (!paymentData.payer.phone) {
                paymentData.payer.phone = {}
            }
            paymentData.payer.phone = {
                area_code: paymentData.payer.phone.area_code || '57',
                number: paymentData.payer.phone.number || '3000000000'
            }

            console.log('✅ Datos PSE completos:', {
                entity_type: paymentData.payer.entity_type,
                identification: paymentData.payer.identification,
                address: paymentData.payer.address,
                phone: paymentData.payer.phone,
                financial_institution: paymentData.transaction_details.financial_institution
            })

            // Validar que callback_url esté definido (OBLIGATORIO para PSE)
            if (!paymentData.callback_url) {
                console.error('❌ callback_url no definido para PSE')
                return res.status(400).json({
                    error: 'callback_url es obligatorio para PSE. Asegúrate de tener NEXT_PUBLIC_SITE_URL configurado o usar un túnel.',
                    status: 'error'
                })
            }

            console.log('✅ callback_url PSE:', paymentData.callback_url)

            // Advertencia: PSE en producción requiere URL pública accesible
            if (!isTestMode && paymentData.callback_url.includes('localhost')) {
                console.warn('⚠️ ADVERTENCIA: Usando localhost con PSE en producción. Esto causará errores.')
                console.warn('⚠️ Usa un túnel (ngrok, cloudflared) o configura NEXT_PUBLIC_SITE_URL con tu dominio público.')
            }
        }

        console.log('📤 Datos finales del pago a enviar a Mercado Pago:')
        console.log(JSON.stringify(paymentData, null, 2))

        // Procesar el pago
        const result = await payment.create({ body: paymentData })

        console.log('Resultado del pago:', {
            id: result.id,
            status: result.status,
            status_detail: result.status_detail,
            external_reference: result.external_reference
        })

        // Respuesta exitosa
        res.status(200).json({
            id: result.id,
            status: result.status,
            status_detail: result.status_detail,
            external_reference: result.external_reference,
            transaction_amount: result.transaction_amount,
            currency_id: result.currency_id,
            payment_method_id: result.payment_method_id,
            transaction_details: result.transaction_details,
            installments: result.installments,
            date_created: result.date_created,
            date_approved: result.date_approved,
            test_mode: isTestMode,
            live_mode: result.live_mode,
            payer: {
                email: result.payer?.email
            }
        })
    } catch (error) {
        console.error('Error procesando pago:', error)
        console.error('Error completo:', JSON.stringify(error, null, 2))

        // Manejo de errores específicos de Mercado Pago
        if (error.cause && error.cause.length > 0) {
            const mpError = error.cause[0]
            console.error('Error de Mercado Pago detallado:', {
                code: mpError.code,
                description: mpError.description,
                message: mpError.message,
                status: mpError.status,
                data: mpError.data
            })

            // Error 9032 específico para PSE - BankTransfers Api fail
            if (mpError.code === 9032) {
                console.error('❌ Error PSE 9032 - BankTransfers Api fail')
                console.error('Datos del pago que causaron el error:', {
                    paymentMethodId: req.body.paymentMethodId,
                    callback_url: req.body.callbackUrl,
                    bank: req.body.metadata?.bank,
                    userType: req.body.metadata?.userType,
                    amount: req.body.transactionAmount
                })
                return res.status(400).json({
                    error: 'Error procesando el pago con PSE',
                    details: 'El banco no pudo procesar la transacción. Por favor, intenta con otro banco o verifica que todos los datos sean correctos.',
                    code: mpError.code,
                    status: 'rejected',
                    errorData: mpError.data
                })
            }

            return res.status(400).json({
                error: 'Error de Mercado Pago',
                details: mpError.description || mpError.message,
                code: mpError.code,
                status: mpError.status || 'rejected'
            })
        }

        // Si es un error de API con apiResponse
        if (error.apiResponse) {
            console.error('API Response error:', error.apiResponse)
        }

        res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message,
            status: 'error'
        })
    }
}

export default handler
