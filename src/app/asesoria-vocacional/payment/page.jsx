'use client'

import { usePreScheduledSessionsStore } from '@/frontend/hooks/globalState/usePreScheduledSessionsStore'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import CoreMethodsPaymentForm from './components/CoreMethodsPaymentForm'
import PaymentSummary from './components/PaymentSummary'

const PaymentPage = () => {
    const router = useRouter()
    const { data: session, status } = useSession()
    const clearAllSessions = usePreScheduledSessionsStore((state) => state.clearAllSessions)

    const [isLoading, setIsLoading] = useState(true)
    const [planData, setPlanData] = useState(null)
    const [dbSessions, setDbSessions] = useState([])

    // Validar sesiones desde la base de datos (fuente de verdad)
    useEffect(() => {
        const validateSessionsFromDB = async () => {
            if (session?.user?.id) {
                try {
                    setIsLoading(true)

                    // Obtener sesiones desde la base de datos (fuente de verdad)
                    const response = await fetch(`/api/user-sessions?userId=${session.user.id}`)
                    const result = await response.json()

                    if (!response.ok) {
                        throw new Error(result.error || 'Error al obtener las sesiones')
                    }

                    const userSessions = result.sessions || []

                    if (userSessions.length === 0) {
                        toast.error('No hay sesiones agendadas para procesar el pago')
                        router.push('/asesoria-vocacional')
                        return
                    }

                    // Validar que las sesiones sean válidas y no hayan expirado
                    const validSessions = userSessions.filter(session => {
                        const sessionDate = new Date(session.date)
                        const now = new Date()
                        return sessionDate > now // Solo sesiones futuras
                    })

                    if (validSessions.length === 0) {
                        toast.error('Las sesiones agendadas han expirado')
                        router.push('/asesoria-vocacional')
                        return
                    }

                    setDbSessions(validSessions)
                    console.log(validSessions)
                    // Obtener datos del plan desde las sesiones de BD
                    if (validSessions.length > 0) {
                        const firstSession = validSessions[0]
                        setPlanData({
                            title: firstSession?.planId?.title,
                            route: firstSession?.planId?.route,
                            sessionsNumber: validSessions.length
                        })
                    }
                } catch (error) {
                    console.error('Error validating sessions:', error)
                    toast.error('Error al validar las sesiones: ' + error.message)
                    router.push('/asesoria-vocacional')
                } finally {
                    setIsLoading(false)
                }
            }
        }

        validateSessionsFromDB()
    }, [session, status, router])

    const handlePaymentSuccess = async (paymentData) => {
        try {
            setIsLoading(true)

            // Confirmar las sesiones en la base de datos
            const response = await fetch('/api/user-sessions/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    paymentData,
                    sessionIds: dbSessions.map(s => s._id)
                })
            })

            if (!response.ok) {
                throw new Error('Error al confirmar las sesiones')
            }

            toast.success('¡Pago procesado exitosamente!')

            // Sincronizar estado local con los cambios de BD (slots ahora están "scheduled")
            await clearAllSessions(session.user.id, true) // true = no liberar slots, solo limpiar local

            // Redirigir a página de confirmación
            router.push('/asesoria-vocacional/confirmation')
        } catch (error) {
            console.error('Error confirming sessions:', error)
            toast.error('Error al confirmar las sesiones: ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePaymentError = (error) => {
        toast.error('Error en el procesamiento del pago: ' + error.message)
        setIsLoading(false)
    }

    if (isLoading) {
        return (
            <div className="payment-loading">
                <p>Validando sesiones desde base de datos...</p>
            </div>
        )
    }

    if (dbSessions.length === 0) {
        return (
            <div className="payment-loading">
                <p>Redirigiendo...</p>
            </div>
        )
    }

    return (
        <div className="payment-page">
            <div className="payment-container">
                <div className="payment-content">
                    <PaymentSummary
                        sessions={dbSessions}
                        planData={planData}
                    />

                    <CoreMethodsPaymentForm
                        sessions={dbSessions}
                        planData={planData}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                    />
                </div>
            </div>

            <style jsx>{`
                .payment-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
                    padding: 2em 1em;
                }

                .payment-container {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .back-button {
                    background: none;
                    border: 1px solid #e2e8f0;
                    padding: 0.5em 1em;
                    border-radius: 0.5em;
                    cursor: pointer;
                    margin-bottom: 1em;
                    transition: all 0.2s ease;
                }

                .back-button:hover {
                    background: #f1f5f9;
                    border-color: #cbd5e1;
                }

                .payment-header h1 {
                    font-size: 2.5em;
                    color: #1e293b;
                    margin: 0.5em 0;
                }

                .payment-header p {
                    color: #64748b;
                    font-size: 1.1em;
                }

                .payment-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3em;
                    align-items: start;
                }

                .payment-loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 50vh;
                    font-size: 1.2em;
                    color: #64748b;
                }

                @media (max-width: 768px) {
                    .payment-content {
                        grid-template-columns: 1fr;
                        gap: 2em;
                    }
                    
                    .payment-header h1 {
                        font-size: 2em;
                    }
                }
            `}</style>
        </div>
    )
}

export default PaymentPage
