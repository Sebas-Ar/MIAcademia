'use client'

import { CreditCard, Lock, Shield, Smartphone, User } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const CoreMethodsPaymentForm = ({ sessions, planData, onSuccess, onError, isLoading, setIsLoading }) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [customerData, setCustomerData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        identificationType: 'CC',
        identificationNumber: ''
    })

    const [cardData, setCardData] = useState({
        cardNumber: '',
        expirationMonth: '',
        expirationYear: '',
        securityCode: '',
        cardholderName: '',
        installments: 1
    })

    const [bankTransferData, setBankTransferData] = useState({
        bank: '',
        userType: 'N', // N = Natural, J = Jurídica
        documentType: 'CC',
        documentNumber: ''
    })

    const [mercadoPago, setMercadoPago] = useState(null)
    const [testMode, setTestMode] = useState(false)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
    const [isLoadingMethods, setIsLoadingMethods] = useState(true)
    const [detectedCardType, setDetectedCardType] = useState(null)
    const [cardBrand, setCardBrand] = useState(null)
    const [currentStep, setCurrentStep] = useState(1) // 1: método de pago, 2: info usuario, 3: info método pago
    const [pseBanks, setPseBanks] = useState([]) // Lista de bancos para PSE

    // Calcular precio total
    const pricePerSession = 50000
    const total = sessions.length * pricePerSession
    const displayTotal = testMode ? 10000 : total

    // Manejar callback de PSE cuando el usuario regresa del banco
    useEffect(() => {
        const handlePSECallback = async () => {
            const status = searchParams.get('status')
            const paymentId = searchParams.get('payment_id')
            const externalReference = searchParams.get('external_reference')

            // Si hay parámetros de retorno de PSE, procesar el resultado
            if (status && paymentId) {
                console.log('🏦 PSE Callback detectado:', { status, paymentId, externalReference })

                setIsLoading(true)

                try {
                    // Consultar el estado actualizado del pago
                    const response = await fetch(`/api/mercadopago/payment-status?payment_id=${paymentId}`)
                    const paymentData = await response.json()

                    if (!response.ok) {
                        throw new Error(paymentData.error || 'Error consultando el estado del pago')
                    }

                    // Manejar según el estado
                    switch (paymentData.status) {
                        case 'approved':
                            toast.success('¡Pago PSE aprobado exitosamente!')
                            onSuccess(paymentData)
                            break
                        case 'pending':
                        case 'in_process':
                            toast.info('Tu pago PSE está siendo procesado. Te notificaremos cuando se confirme.')
                            break
                        case 'rejected':
                            toast.error(`Pago PSE rechazado: ${paymentData.status_detail || 'Error en el banco'}`)
                            onError(paymentData)
                            break
                        default:
                            toast.warning('Estado del pago PSE desconocido')
                            break
                    }

                    // Limpiar query params de la URL
                    router.replace('/asesoria-vocacional/payment', { scroll: false })
                } catch (error) {
                    console.error('Error procesando callback PSE:', error)
                    toast.error('Error al verificar el estado del pago PSE')
                    onError(error)
                } finally {
                    setIsLoading(false)
                }
            }
        }

        handlePSECallback()
    }, [searchParams, router, onSuccess, onError, setIsLoading])

    // Inicializar Mercado Pago SDK y cargar métodos de pago
    useEffect(() => {
        const initMercadoPago = async () => {
            try {
                // Obtener la clave pública desde el servidor
                const response = await fetch(`/api/mercadopago/public-key${testMode ? '?test=1' : ''}`, {
                    headers: testMode ? { 'x-test-mode': 'true' } : undefined
                })
                const publicKeyPayload = await response.json()
                if (!response.ok) {
                    throw new Error(publicKeyPayload.error || 'No se pudo obtener la clave pública')
                }
                const { publicKey } = publicKeyPayload

                // Inicializar el SDK
                const mp = new window.MercadoPago(publicKey, {
                    locale: 'es-CO'
                })

                setMercadoPago(mp)

                // Los métodos de pago se manejan directamente en el JSX
                // No necesitamos guardarlos en estado ya que son fijos

                // Cargar bancos disponibles para PSE desde el backend
                try {
                    console.log('🏦 Cargando bancos PSE desde la API de Mercado Pago...')
                    const banksResponse = await fetch('/api/mercadopago/pse-banks', {
                        headers: testMode ? { 'x-test-mode': 'true' } : undefined
                    })

                    if (!banksResponse.ok) {
                        throw new Error(`Error ${banksResponse.status}: No se pudieron cargar los bancos PSE`)
                    }

                    const banksData = await banksResponse.json()

                    if (!banksData.banks || banksData.banks.length === 0) {
                        throw new Error('No se encontraron bancos PSE disponibles')
                    }

                    console.log('✅ Bancos PSE cargados desde API:', banksData.banks.length)
                    setPseBanks(banksData.banks)
                } catch (error) {
                    console.error('❌ Error cargando bancos PSE:', error)
                    toast.error('No se pudieron cargar los bancos disponibles para PSE. Por favor, intenta de nuevo más tarde.')
                    setPseBanks([])
                }

                setIsLoadingMethods(false)

                console.log('Mercado Pago inicializado correctamente')
            } catch (error) {
                console.error('Error inicializando Mercado Pago:', error)
                toast.error('Error cargando el sistema de pagos')
                setIsLoadingMethods(false)
            }
        }

        // Cargar script de Mercado Pago si no está disponible
        if (!window.MercadoPago) {
            const script = document.createElement('script')
            script.src = 'https://sdk.mercadopago.com/js/v2'
            script.onload = initMercadoPago
            document.head.appendChild(script)
        } else {
            initMercadoPago()
        }
    }, [testMode])

    const processPayment = async (event) => {
        event.preventDefault()
        console.log('-----------------------------------------------------------------------------')

        if (!validateForm()) return

        setIsLoading(true)

        try {
            const paymentData = {
                transactionAmount: testMode ? 10000 : total,
                description: `Asesoría Vocacional - ${sessions.length} sesión(es)`,
                payer: {
                    email: customerData.email,
                    first_name: customerData.firstName,
                    last_name: customerData.lastName,
                    identification: {
                        type: customerData.identificationType,
                        number: customerData.identificationNumber
                    },
                    phone: {
                        number: customerData.phone
                    }
                },
                externalReference: `sessions_${Date.now()}`,
                metadata: {
                    sessions: JSON.stringify(sessions),
                    planData: JSON.stringify(planData)
                }
            }

            // Set test mode flag for all payment types
            if (testMode) {
                paymentData.testMode = true
                // In test mode, use standardized test data
                paymentData.payer = {
                    ...paymentData.payer,
                    first_name: 'APRO',
                    last_name: 'TEST',
                    email: customerData.email || 'test@example.com',
                    identification: {
                        type: 'CC',
                        number: '12345678'
                    }
                }
            }

            // Procesar según el tipo de método de pago
            if (selectedPaymentMethod?.payment_type_id === 'card') {
                // En modo test, exigir tarjetas de prueba oficiales de Mercado Pago
                if (testMode) {
                    const digits = (cardData.cardNumber || '').replace(/\s/g, '')
                    const allowed = new Set(['4013540682746260', '5254133674403564'])
                    if (!allowed.has(digits)) {
                        toast.error('En modo prueba, usa tarjetas de prueba oficiales: Visa 4509 9535 6623 3704 o Mastercard 5254 1336 7440 3564')
                        return
                    }
                }
                // Crear token de la tarjeta
                const expMonth = (cardData.expirationMonth || '').toString().padStart(2, '0')
                console.log({ expMonth })
                const expYear4 = (cardData.expirationYear || '').toString()
                console.log({ expMonth, expYear4 })
                if (!expMonth || !expYear4) {
                    throw new Error('Fecha de vencimiento inválida')
                }

                const cardToken = await mercadoPago.createCardToken({
                    cardNumber: cardData.cardNumber.replace(/\s/g, ''),
                    securityCode: cardData.securityCode,
                    // Enviar ambas variantes por compatibilidad con el SDK v2
                    expirationMonth: expMonth,
                    expirationYear: expYear4,
                    cardExpirationMonth: expMonth,
                    cardExpirationYear: expYear4,
                    cardholderName: testMode ? 'APRO' : cardData.cardholderName,
                    identificationType: testMode ? 'CC' : customerData.identificationType,
                    identificationNumber: testMode ? '12345678' : customerData.identificationNumber
                })

                if (!cardToken || !cardToken.id) {
                    throw new Error('No se pudo generar el token de la tarjeta')
                }

                paymentData.token = cardToken.id
                // Usar el tipo detectado automáticamente o credit_card como default
                paymentData.paymentMethodId = detectedCardType || 'credit_card'
                paymentData.paymentTypeId = detectedCardType || 'credit_card'
                paymentData.installments = parseInt(cardData.installments)
            } else if (selectedPaymentMethod?.payment_type_id === 'bank_transfer') {
                // Para PSE y transferencias bancarias
                paymentData.paymentMethodId = selectedPaymentMethod.id
                paymentData.paymentTypeId = selectedPaymentMethod.payment_type_id
                if (selectedPaymentMethod.id === 'pse') {
                    // Enriquecer con datos necesarios para PSE
                    paymentData.additionalInfo = {
                        ip_address: '127.0.0.1' // En producción, obtener la IP real
                    }
                    paymentData.metadata = {
                        ...(paymentData.metadata || {}),
                        bank: bankTransferData.bank,
                        userType: bankTransferData.userType
                    }
                    console.log('🏦 Enviando pago PSE con:', {
                        bankId: bankTransferData.bank,
                        bankType: typeof bankTransferData.bank,
                        bankFromAPI: pseBanks.find(b => b.id === bankTransferData.bank),
                        userType: bankTransferData.userType,
                        totalBanks: pseBanks.length
                    })
                    // URL de retorno después de PSE (vuelve a esta misma página)
                    const currentUrl = window.location.origin + window.location.pathname
                    paymentData.callbackUrl = currentUrl
                }
            } else if (selectedPaymentMethod?.payment_type_id === 'ticket') {
                // Para Efecty y otros tickets
                paymentData.paymentMethodId = selectedPaymentMethod.id
                paymentData.paymentTypeId = selectedPaymentMethod.payment_type_id
            }

            console.log('Datos de pago:', paymentData)
            console.log('Test mode state:', { testMode, displayTotal, sentAmount: paymentData.transactionAmount })

            // Procesar el pago
            const paymentResponse = await fetch('/api/mercadopago/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(testMode ? { 'x-test-mode': 'true' } : {})
                },
                body: JSON.stringify(paymentData)
            })

            const result = await paymentResponse.json()

            if (!paymentResponse.ok) {
                const details = result.details || result.message || result.error || 'Error procesando el pago'
                if (testMode && /no está configurad/i.test(details)) {
                    toast.error('Clave/token de prueba no configurados. Define MERCADO_PAGO_TEST_PUBLIC_KEY y MERCADO_PAGO_TEST_ACCESS_TOKEN.')
                }
                throw new Error(details)
            }

            // Manejar respuesta según estado
            switch (result.status) {
                case 'approved':
                    toast.success('¡Pago aprobado exitosamente!')
                    onSuccess(result)
                    break
                case 'pending':
                    if (selectedPaymentMethod?.id === 'pse') {
                        const bankUrl = result?.transaction_details?.external_resource_url
                        if (bankUrl) {
                            toast.info('Redirigiendo a tu banco para completar el pago...')
                            window.location.href = bankUrl
                            return
                        }
                    }
                    toast.info('Pago pendiente de aprobación')
                    break
                case 'in_process':
                    toast.info('Pago en proceso')
                    break
                case 'rejected':
                    toast.error(`Pago rechazado: ${result.status_detail}`)
                    onError(result)
                    break
                default:
                    toast.warning('Estado de pago desconocido')
                    break
            }
        } catch (error) {
            console.error('Error procesando pago:', error)
            toast.error(error.message || 'Error procesando el pago')
            onError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const validateForm = () => {
        if (!selectedPaymentMethod) {
            toast.error('Por favor selecciona un método de pago')
            return false
        }

        if (!customerData.firstName.trim()) {
            toast.error('Por favor ingresa tu nombre')
            return false
        }
        if (!customerData.lastName.trim()) {
            toast.error('Por favor ingresa tu apellido')
            return false
        }
        if (!customerData.email.trim() || !customerData.email.includes('@')) {
            toast.error('Por favor ingresa un email válido')
            return false
        }
        if (!customerData.phone.trim()) {
            toast.error('Por favor ingresa tu teléfono')
            return false
        }
        if (!customerData.identificationNumber.trim()) {
            toast.error('Por favor ingresa tu número de identificación')
            return false
        }

        // Validaciones específicas por tipo de método de pago
        if (selectedPaymentMethod?.payment_type_id === 'card') {
            if (!cardData.cardNumber.replace(/\s/g, '') || cardData.cardNumber.replace(/\s/g, '').length < 13) {
                toast.error('Por favor ingresa un número de tarjeta válido')
                return false
            }
            if (!cardData.expirationMonth || !cardData.expirationYear) {
                toast.error('Por favor ingresa la fecha de vencimiento')
                return false
            }
            if (!cardData.securityCode || cardData.securityCode.length < 3) {
                toast.error('Por favor ingresa el código de seguridad')
                return false
            }
            if (!cardData.cardholderName.trim()) {
                toast.error('Por favor ingresa el nombre del titular')
                return false
            }
        }

        // Validaciones adicionales para PSE
        if (selectedPaymentMethod?.id === 'pse') {
            if (!bankTransferData.bank) {
                toast.error('Por favor selecciona tu banco')
                return false
            }
        }

        return true
    }

    const handleCustomerDataChange = (field, value) => {
        setCustomerData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleCardDataChange = (field, value) => {
        setCardData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        const matches = v.match(/\d{4,16}/g)
        const match = (matches && matches[0]) || ''
        const parts = []

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }

        if (parts.length) {
            return parts.join(' ')
        } else {
            return v
        }
    }

    const handleCardNumberChange = async (e) => {
        const formatted = formatCardNumber(e.target.value)
        if (formatted.replace(/\s/g, '').length <= 16) {
            handleCardDataChange('cardNumber', formatted)
        }

        const digits = formatted.replace(/\s/g, '')

        // Auto-detección de tipo de tarjeta por BIN usando Mercado Pago SDK
        if (digits.length >= 6 && mercadoPago) {
            try {
                const bin = digits.slice(0, 8) // Mercado Pago usa 8 dígitos para el BIN
                const paymentMethods = await mercadoPago.getPaymentMethods({ bin })

                if (paymentMethods && paymentMethods.results && paymentMethods.results.length > 0) {
                    const method = paymentMethods.results[0]
                    setCardBrand(method.name) // Visa, Mastercard, etc.

                    // Auto-seleccionar el método de tarjeta y detectar el tipo específico
                    if (method.payment_type_id === 'credit_card' || method.payment_type_id === 'debit_card') {
                        handlePaymentMethodSelect({
                            id: 'card',
                            payment_type_id: 'card',
                            name: 'Tarjeta'
                        })
                        setDetectedCardType(method.payment_type_id)
                    }
                }
            } catch (error) {
                console.log('No se pudo detectar el tipo de tarjeta:', error)
                setCardBrand(null)
                setDetectedCardType(null)
            }
        } else {
            setCardBrand(null)
            setDetectedCardType(null)
        }

        // Auto activar modo test si detectamos BINs de tarjetas de prueba comunes
        try {
            const bin = digits.slice(0, 6)
            const knownTestBins = new Set([
                '503175', // Mastercard test (MP)
                '450995' // Visa test (MP)
            ])
            if (knownTestBins.has(bin)) {
                if (!testMode) setTestMode(true)
            }
        } catch {}
    }

    const renderPaymentMethodFields = () => {
        if (!selectedPaymentMethod) return null

        const { payment_type_id: paymentType, id: methodId } = selectedPaymentMethod

        if (paymentType === 'card') {
            return renderCardFields()
        } else if (methodId === 'pse') {
            return renderPSEFields()
        }

        return null
    }

    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method)
        setCurrentStep(2) // Avanzar automáticamente al paso 2
    }

    const handleContinueToUserInfo = () => {
        setCurrentStep(3)
    }

    const handleBackToPaymentMethods = () => {
        setCurrentStep(1)
    }

    const handleBackToUserInfo = () => {
        setCurrentStep(2)
    }

    const renderCardFields = () => (
        <div className="space-y-4">
            {/* Mostrar información de tarjeta detectada */}
            {cardBrand && detectedCardType && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-green-800 font-medium">
                            Tarjeta detectada: {cardBrand} ({detectedCardType === 'credit_card' ? 'Crédito' : 'Débito'})
                        </span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de tarjeta *
                    </label>
                    <input
                        type="text"
                        value={cardData.cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mes de vencimiento *
                    </label>
                    <select
                        value={cardData.expirationMonth}
                        onChange={(e) => handleCardDataChange('expirationMonth', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                    >
                        <option value="">Mes</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month.toString().padStart(2, '0')}>
                                {month.toString().padStart(2, '0')}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Año de vencimiento *
                    </label>
                    <select
                        value={cardData.expirationYear}
                        onChange={(e) => handleCardDataChange('expirationYear', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                    >
                        <option value="">Año</option>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                            <option key={year} value={year.toString()}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código de seguridad *
                    </label>
                    <input
                        type="text"
                        value={cardData.securityCode}
                        onChange={(e) => handleCardDataChange('securityCode', e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="CVV"
                        maxLength="4"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del titular *
                    </label>
                    <input
                        type="text"
                        value={cardData.cardholderName}
                        onChange={(e) => handleCardDataChange('cardholderName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Nombre como aparece en la tarjeta"
                        required
                    />
                </div>

                {detectedCardType === 'credit_card' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cuotas
                        </label>
                        <select
                            value={cardData.installments}
                            onChange={(e) => handleCardDataChange('installments', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                            <option value="1">1 cuota</option>
                            <option value="3">3 cuotas</option>
                            <option value="6">6 cuotas</option>
                            <option value="12">12 cuotas</option>
                        </select>
                    </div>
                )}
            </div>
        </div>
    )

    const renderPSEFields = () => {
        return (
            <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800">
                        <Smartphone className="w-5 h-5" />
                        <span className="font-medium">Pago con PSE</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-2">
                        Serás redirigido a la página de tu banco para completar el pago de forma segura.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de persona *
                    </label>
                    <select
                        value={bankTransferData.userType}
                        onChange={(e) => setBankTransferData((prev) => ({ ...prev, userType: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                    >
                        <option value="N">Persona Natural</option>
                        <option value="J">Persona Jurídica</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Banco *
                    </label>
                    <select
                        value={bankTransferData.bank}
                        onChange={(e) => setBankTransferData((prev) => ({ ...prev, bank: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                        disabled={pseBanks.length === 0}
                    >
                        <option value="">{
                            pseBanks.length === 0
                                ? 'No hay bancos disponibles'
                                : `Selecciona tu banco (${pseBanks.length} disponibles)`
                        }</option>
                        {pseBanks.map((bank) => (
                            <option key={bank.id} value={bank.id}>
                                {bank.description || bank.name || bank.id}
                            </option>
                        ))}
                    </select>
                    {pseBanks.length === 0 && (
                        <p className="text-sm text-red-600 mt-2">
                            No se pudieron cargar los bancos. Por favor, recarga la página.
                        </p>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            Completar Pago
                        </h2>
                        <p className="text-blue-100">
                            Información segura protegida por Mercado Pago
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {/* Indicador de pasos */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                            currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                            1
                        </div>
                        <div className={`w-12 h-1 ${
                            currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
                        }`}></div>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                            currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                            2
                        </div>
                        <div className={`w-12 h-1 ${
                            currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'
                        }`}></div>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                            currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                            3
                        </div>
                    </div>
                </div>

                <form onSubmit={processPayment} className="space-y-8">
                    {/* Dev/Test controls */}
                    {process.env.NODE_ENV !== 'production' && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                            <input
                                id="toggle-test-mode"
                                type="checkbox"
                                checked={testMode}
                                onChange={(e) => setTestMode(e.target.checked)}
                                className="h-4 w-4"
                            />
                            <label htmlFor="toggle-test-mode" className="text-sm text-gray-700">
                                Usar modo de prueba (tarjetas de prueba de Mercado Pago)
                            </label>
                        </div>
                    )}

                    {/* Paso 1: Selección de método de pago */}
                    {currentStep === 1 && (
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                Método de Pago
                            </h3>

                            {isLoadingMethods
                                ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <span className="ml-3 text-gray-600">Cargando métodos de pago...</span>
                                    </div>
                                )
                                : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Tarjeta (detección automática de crédito/débito) */}
                                        <div
                                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                                                selectedPaymentMethod?.payment_type_id === 'card'
                                                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => handlePaymentMethodSelect({ id: 'card', payment_type_id: 'card', name: 'Tarjeta' })}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${
                                                    selectedPaymentMethod?.payment_type_id === 'card'
                                                        ? 'bg-blue-100 text-blue-600'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    <CreditCard className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        Tarjeta
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Detección automática de crédito/débito
                                                    </p>
                                                </div>
                                            </div>

                                            {selectedPaymentMethod?.payment_type_id === 'card' && (
                                                <div className="absolute top-3 right-3">
                                                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* PSE - Temporalmente oculto */}
                                        {false && (
                                            <div
                                                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                                                    selectedPaymentMethod?.id === 'pse'
                                                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                onClick={() => handlePaymentMethodSelect({ id: 'pse', payment_type_id: 'bank_transfer', name: 'PSE' })}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${
                                                        selectedPaymentMethod?.id === 'pse'
                                                            ? 'bg-blue-100 text-blue-600'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        <Smartphone className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">
                                                        PSE
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                        Pago seguro con tu banco
                                                        </p>
                                                    </div>
                                                </div>

                                                {selectedPaymentMethod?.id === 'pse' && (
                                                    <div className="absolute top-3 right-3">
                                                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                        </div>
                    )}

                    {/* Paso 2: Información del cliente */}
                    {currentStep === 2 && (
                        <div className="space-y-8">
                            {/* Botón de regresar */}
                            <button
                                type="button"
                                onClick={handleBackToPaymentMethods}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                ← Cambiar método de pago
                            </button>

                            {/* Método seleccionado */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        {selectedPaymentMethod?.id === 'pse'
                                            ? <Smartphone className="w-5 h-5 text-blue-600" />
                                            : <CreditCard className="w-5 h-5 text-blue-600" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-blue-900">
                                            Método seleccionado: {selectedPaymentMethod?.name}
                                        </p>
                                        {selectedPaymentMethod?.id === 'card' && (
                                            <p className="text-sm text-blue-700">
                                                Detección automática de crédito/débito
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Información del cliente */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                            Datos del Cliente
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            value={customerData.firstName}
                                            onChange={(e) => handleCustomerDataChange('firstName', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Tu nombre"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Apellido *
                                        </label>
                                        <input
                                            type="text"
                                            value={customerData.lastName}
                                            onChange={(e) => handleCustomerDataChange('lastName', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Tu apellido"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={customerData.email}
                                            onChange={(e) => handleCustomerDataChange('email', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="tu@email.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono *
                                        </label>
                                        <input
                                            type="tel"
                                            value={customerData.phone}
                                            onChange={(e) => handleCustomerDataChange('phone', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="3001234567"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de documento *
                                        </label>
                                        <select
                                            value={customerData.identificationType}
                                            onChange={(e) => handleCustomerDataChange('identificationType', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        >
                                            <option value="CC">Cédula de Ciudadanía</option>
                                            <option value="CE">Cédula de Extranjería</option>
                                            <option value="NIT">NIT</option>
                                            <option value="PASSPORT">Pasaporte</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Número de documento *
                                        </label>
                                        <input
                                            type="text"
                                            value={customerData.identificationNumber}
                                            onChange={(e) => handleCustomerDataChange('identificationNumber', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Número de documento"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Botón para continuar al paso 3 */}
                            <div className="flex justify-center pt-6">
                                <button
                                    type="button"
                                    onClick={handleContinueToUserInfo}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Paso 3: Información del método de pago */}
                    {currentStep === 3 && (
                        <div className="space-y-8">
                            {/* Botón de regresar */}
                            <button
                                type="button"
                                onClick={handleBackToUserInfo}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                ← Volver a datos del cliente
                            </button>

                            {/* Método seleccionado */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        {selectedPaymentMethod?.id === 'pse'
                                            ? <Smartphone className="w-5 h-5 text-blue-600" />
                                            : <CreditCard className="w-5 h-5 text-blue-600" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-blue-900">
                                            {selectedPaymentMethod?.name}
                                        </p>
                                        {selectedPaymentMethod?.id === 'card' && (
                                            <p className="text-sm text-blue-700">
                                                Detección automática de crédito/débito
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Resumen de datos del cliente */}
                            {customerData.firstName && customerData.identificationNumber && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-blue-900">
                                                {customerData.firstName} {customerData.lastName}
                                            </p>
                                            <p className="text-sm text-blue-700">
                                                {customerData.identificationType}: {customerData.identificationNumber}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Campos específicos del método de pago */}
                            {selectedPaymentMethod && (
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                        Información de {selectedPaymentMethod.name}
                                    </h3>
                                    {renderPaymentMethodFields()}
                                </div>
                            )}

                            {/* Resumen del pedido */}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h4>
                                {testMode && (
                                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-yellow-800">
                                    🧪 Modo de prueba activo - Monto fijo de $10.000 COP
                                        </p>
                                    </div>
                                )}
                                <div className="space-y-3">
                                    {!testMode
                                        ? (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Sesiones ({sessions.length})</span>
                                                <span className="font-medium">${total.toLocaleString('es-CO')}</span>
                                            </div>
                                        )
                                        : (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Monto de prueba</span>
                                                <span className="font-medium">$10.000</span>
                                            </div>
                                        )}
                                    <div className="border-t border-gray-300 pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-bold text-gray-900">Total</span>
                                            <span className="text-2xl font-bold text-blue-600">${displayTotal.toLocaleString('es-CO')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botón de pago */}
                            <div className="space-y-4">
                                <button
                                    type="submit"
                                    disabled={isLoading || !selectedPaymentMethod}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    {isLoading
                                        ? (
                                            <>
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    Procesando...
                                            </>
                                        )
                                        : (
                                            <>
                                                <Lock className="w-6 h-6" />
                                    Pagar ${displayTotal.toLocaleString('es-CO')}
                                            </>
                                        )}
                                </button>

                                {/* Información de seguridad */}
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                    <Shield className="w-4 h-4" />
                                    <span>Tus datos están protegidos por Mercado Pago con encriptación SSL</span>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default CoreMethodsPaymentForm
