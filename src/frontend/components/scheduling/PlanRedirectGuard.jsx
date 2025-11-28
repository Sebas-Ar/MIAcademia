import { usePreScheduledSessionsStore } from '@/frontend/hooks/globalState/usePreScheduledSessionsStore'
import { AlertTriangle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * Componente que detecta cuando el usuario está en un plan diferente
 * al que tiene sesiones agendadas y muestra notificación automática
 */
const PlanRedirectGuard = ({ onActiveChange }) => {
    const [showModal, setShowModal] = useState(false)
    const [countdown, setCountdown] = useState(10)
    const router = useRouter()

    // get path params id in url
    const { route } = useParams()

    const sessions = usePreScheduledSessionsStore((state) => state.sessions)
    const planRoute = usePreScheduledSessionsStore((state) => state.planRoute)

    // Detectar cuando estamos en un plan diferente al que tiene sesiones agendadas
    useEffect(() => {
        console.log('🔍 PlanRedirectGuard - Verificando redirección automática:', {
            sessionsLength: sessions.length,
            planRoute,
            currentRoute: route,
            shouldRedirect: sessions.length > 0 && planRoute && route && route !== planRoute
        })

        const hasConflict = sessions.length > 0 && planRoute && route && route !== planRoute

        // Notificar cambio de estado si la función está disponible
        if (onActiveChange) {
            onActiveChange(hasConflict)
        }

        // Agregar un pequeño delay antes de mostrar el modal para evitar flickering durante navegación
        let timeoutId
        if (hasConflict) {
            timeoutId = setTimeout(() => {
                console.log('🚀 PlanRedirectGuard - Activando modal automático')
                setShowModal(true)
                setCountdown(10)
            }, 200) // 200ms de delay para permitir que se complete la limpieza de sesiones
        } else {
            // Si no hay condiciones para mostrar modal, asegurar que esté cerrado
            setShowModal(false)
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [sessions, planRoute, route, onActiveChange])

    // Manejar countdown y redirección automática
    useEffect(() => {
        let timer
        if (showModal && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1)
            }, 1000)
        } else if (showModal && countdown === 0) {
            console.log('⏰ PlanRedirectGuard - Ejecutando redirección automática a:', planRoute)
            setShowModal(false)
            router.push(`/asesoria-vocacional/agenda/${planRoute}`)
        }

        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [showModal, countdown, router, planRoute])

    const handleGoToPlan = () => {
        console.log('✅ PlanRedirectGuard - Usuario eligió ir al plan activo:', planRoute)
        setShowModal(false)
        router.push(`/asesoria-vocacional/agenda/${planRoute}`)
    }

    if (!showModal) {
        return null
    }

    return (
        <div className="modal-page">
            <div className="modal-background"></div>
            <div className="modal-wrapper">
                <div className="modal-icon">
                    <AlertTriangle size={40} strokeWidth={2} />
                </div>

                <h3>Redirigiendo al Plan Activo</h3>

                <p className="modal-description">
                    Tienes <strong>{sessions.length} sesión{sessions.length > 1 ? 'es' : ''}</strong> agendada{sessions.length > 1 ? 's' : ''} en otro plan.
                </p>

                <p className="modal-info">
                    Serás redirigido automáticamente al plan donde tienes las sesiones activas.
                </p>

                <div className="countdown-box">
                    <strong>Redirigiendo en {countdown} segundo{countdown !== 1 ? 's' : ''}...</strong>
                </div>

                <button onClick={handleGoToPlan} className="btn-confirm">
                    Ir al plan activo ahora
                </button>
            </div>

            <style jsx>{`
                .modal-page {
                    height: 100dvh;
                    width: 100vw;
                    position: fixed;
                    top: 0;
                    left: 0;
                    display: grid;
                    place-items: center;
                    padding: 2em;
                    z-index: 11111111111;
                }

                .modal-background {
                    height: 100%;
                    width: 100%;
                    background: var(--transparent-dark-gray);
                    position: absolute;
                    z-index: -1;
                }

                .modal-wrapper {
                    background-color: var(--dark-blue);
                    padding: 2.4em;
                    width: 100%;
                    max-width: 35em;
                    border-radius: 1em;
                    overflow: hidden;
                    border: .125em solid var(--yellow);
                    display: grid;
                    gap: 1em;
                    position: relative;
                }

                .modal-icon {
                    display: grid;
                    place-items: center;
                    color: var(--yellow);
                    margin-bottom: .5em;
                }

                .modal-wrapper h3 {
                    font-size: 1.1em;
                    color: var(--yellow);
                    text-align: center;
                    font-weight: 600;
                    text-transform: uppercase;
                    margin: 0;
                }

                .modal-description {
                    color: var(--yellow);
                    font-size: 1em;
                    text-align: center;
                    font-weight: 300;
                    margin: .5em 0;
                }

                .modal-description strong {
                    font-weight: 600;
                }

                .modal-info {
                    color: var(--yellow);
                    font-size: .95em;
                    text-align: center;
                    font-weight: 300;
                    margin: 0;
                    opacity: 0.9;
                }

                .countdown-box {
                    background: var(--transparent-white);
                    border: .15em solid var(--yellow);
                    border-radius: .5em;
                    padding: 1em;
                    text-align: center;
                    color: var(--yellow);
                    font-size: 1.1em;
                    margin: .5em 0;
                    animation: countdownPulse 1s ease-in-out infinite;
                }

                @keyframes countdownPulse {
                    0%, 100% {
                        transform: scale(1);
                        border-color: var(--yellow);
                    }
                    50% {
                        transform: scale(1.02);
                        border-color: var(--dark-yellow);
                    }
                }

                .btn-confirm {
                    background: var(--yellow);
                    border: .15em solid var(--dark-yellow);
                    color: var(--dark-blue);
                    padding: .8em 1.5em;
                    border-radius: .5em;
                    font-size: .95em;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform .3s, background .3s, box-shadow .3s;
                    justify-self: center;
                    margin-top: .5em;
                }

                .btn-confirm:hover {
                    transform: scale(1.05);
                    background: var(--dark-yellow);
                    box-shadow: 0 4px 16px rgba(251, 191, 36, 0.4);
                }

                .btn-confirm:active {
                    transform: scale(0.98);
                }
            `}</style>
        </div>
    )
}

export default PlanRedirectGuard
