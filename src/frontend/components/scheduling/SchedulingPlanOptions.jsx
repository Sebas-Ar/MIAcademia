import { usePreScheduledSessionsStore } from '@/frontend/hooks/globalState/usePreScheduledSessionsStore'
import { AlertTriangle, X } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const SchedulingPlanOptions = ({
    showPlans = false
}) => {
    const [plans, setPlans] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const router = useRouter()
    // get path params id in url
    const { route } = useParams() // Uncomment if using React Router or similar

    const sessions = usePreScheduledSessionsStore((state) => state.sessions)
    const planRoute = usePreScheduledSessionsStore((state) => state.planRoute)
    const clearAllSessions = usePreScheduledSessionsStore((state) => state.clearAllSessions)

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch('/api/plans')
                const result = await response.json()
                setPlans(result) // Correctly accessing the 'data' array from the API response
            } catch (error) {
                console.error('Error fetching plans:', error)
            }
        }

        fetchPlans()
    }, [])

    // Nota: La detección automática de plan incorrecto se maneja en PlanRedirectGuard
    // Este componente solo maneja la selección manual de planes

    const handlePlanSelect = (plan, event) => {
        event.preventDefault()

        // Si hay sesiones pre-agendadas y es un plan diferente al actual
        if (sessions.length > 0 && plan.route !== route) {
            setSelectedPlan(plan)
            setShowModal(true)
        } else {
            router.push(`/asesoria-vocacional/agenda/${plan.route}`)
        }
    }

    const handleModalCancel = () => {
        setShowModal(false)
        setSelectedPlan(null)
    }

    const handleReleaseAndChange = async () => {
        if (!selectedPlan) return

        try {
            // Limpiar todas las sesiones pre-agendadas usando el store
            await clearAllSessions()

            // Pequeño delay para asegurar que el store se actualice completamente
            await new Promise(resolve => setTimeout(resolve, 100))

            setShowModal(false)
            setSelectedPlan(null)

            // Navegar después de que las sesiones estén completamente limpias
            router.push(`/asesoria-vocacional/agenda/${selectedPlan.route}`)
        } catch (error) {
            console.error('Error al liberar sesiones:', error)
            // Aquí podrías mostrar un toast de error
        }
    }

    return <>
        <div className="plan-options-wrapper">
            <ul className="plan-options">
                {
                    plans && plans.length > 0 && (
                        plans.map((plan, index, array) => {
                            const hasScheduledSessions = sessions.length > 0
                            const isCurrentPlan = route === plan.route

                            return (
                                <li key={plan._id}>
                                    <button
                                        className={`plan-option-button ${
                                            isCurrentPlan ? 'selected' : ''
                                        }`}
                                        onClick={(e) => handlePlanSelect(plan, e)}
                                    >
                                        <h4>{plan.title}</h4>
                                        <div className="plan-info">
                                            <span>${plan.price} {plan.currency}</span>
                                            <span>{plan.sessionsNumber} sesiones</span>
                                        </div>
                                        {hasScheduledSessions && plan.route === planRoute && (
                                            <div className="active-plan-badge">
                                                Plan activo
                                            </div>
                                        )}
                                    </button>
                                    {
                                        index < array.length - 1 && <div className="line"></div>
                                    }
                                </li>
                            )
                        })
                    )
                }
            </ul>

            <style jsx>{`

                .plan-options-wrapper {
                    z-index: 1;
                    padding: 1em 0;
                    position: absolute;
                    width: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    top: 100%;
                    font-size: ${showPlans ? '1em' : '0'};
                    opacity: ${showPlans ? '1' : '0'};
                    transition: font-size 0.3s ease, opacity 0.3s ease;
                }

                .plan-options {
                    border-radius: 0.5em;
                    overflow: hidden;
                    background: var(--light-blue);
                    border: .2em solid var(--blue);
                }

                .plan-option-button {
                    display: block;
                    width: 100%;
                    text-align: left;
                    padding: 1em;
                    transition: background 0.3s ease, opacity 0.3s ease;
                    cursor: pointer;
                    position: relative;
                }

                .plan-option-button:hover:not(.disabled) {
                    background: var(--yellow);
                }

                .plan-option-button.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    background: #f5f5f5;
                }

                .plan-option-button.disabled:hover {
                    background: #f5f5f5;
                }

                .selected {
                    background: var(--yellow);
                }

                .active-plan-badge {
                    position: absolute;
                    top: 0.5em;
                    right: 0.5em;
                    background: var(--blue);
                    color: white;
                    font-size: 0.75em;
                    padding: 0.25em 0.5em;
                    border-radius: 0.25em;
                    font-weight: 500;
                }

                .plan-option-button:last-child {
                    border-bottom: none;
                }

                .plan-options h4 {
                    text-transform: capitalize;
                    text-align: center;
                    margin: 0 0 .5em;
                    font-weight: 600;
                }

                .plan-options .plan-info {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.9em;
                    padding: 0 3.5em
                }

                .plan-options span {
                    font-weight: 400;
                    color: var(--dark-gray);
                }

                .plan-options .line {
                    height: .2em;
                    width: 80%;
                    border-radius: 1em;
                    background: var(--blue);
                    margin: 0 auto;
                }
            `}</style>
        </div>

        {/* Modal de advertencia para cambio de plan */}
        {showModal && (
            <div className="modal-page">
                <div className="modal-background" onClick={handleModalCancel}></div>
                <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
                    <button onClick={handleModalCancel} className="btn-close">
                        <X size="1.4em" strokeWidth=".2em" />
                    </button>

                    <div className="modal-icon">
                        <AlertTriangle size={40} strokeWidth={2} />
                    </div>

                    <h3>Sesiones Agendadas Activas</h3>

                    <p className="modal-description">
                        Tienes <strong>{sessions.length} sesión{sessions.length > 1 ? 'es' : ''}</strong> pre-agendada{sessions.length > 1 ? 's' : ''} en el plan actual.
                    </p>

                    <p className="modal-question">¿Qué quieres hacer?</p>

                    <div className="options-container">
                        <div className="option-card" onClick={() => {
                            setShowModal(false)
                            router.push(`/asesoria-vocacional/agenda/${planRoute}`)
                        }}>
                            <div className="option-number">1</div>
                            <div className="option-content">
                                <h4>Mantener Sesiones</h4>
                                <p>Permanece en el plan actual donde están agendadas tus sesiones.</p>
                            </div>
                        </div>

                        <div className="option-card" onClick={handleReleaseAndChange}>
                            <div className="option-number">2</div>
                            <div className="option-content">
                                <h4>Cambiar de Plan</h4>
                                <p>Libera las sesiones pre-agendadas y cambia a <strong>{selectedPlan?.title}</strong>.</p>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleModalCancel} className="btn-cancel-bottom">
                        Cancelar
                    </button>
                </div>

                <style jsx>{`
                    /* Estilos del modal */
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
                        max-width: 40em;
                        border-radius: 1em;
                        overflow: hidden;
                        border: .125em solid var(--yellow);
                        display: grid;
                        gap: 1em;
                        position: relative;
                    }

                    .btn-close {
                        position: absolute;
                        top: 1em;
                        right: 1em;
                        color: var(--yellow);
                        display: grid;
                        place-items: center;
                        padding: .1em;
                        cursor: pointer;
                        transition: transform .3s;
                        background: none;
                        border: none;
                    }

                    .btn-close:hover {
                        transform: scale(1.2);
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

                    .modal-question {
                        color: var(--yellow);
                        font-size: 1em;
                        text-align: center;
                        font-weight: 500;
                        margin: .5em 0 1em;
                    }

                    .options-container {
                        display: grid;
                        gap: 1em;
                        margin: 1em 0;
                    }

                    .option-card {
                        background: var(--transparent-white);
                        border: .15em solid var(--yellow);
                        border-radius: .5em;
                        padding: 1.2em;
                        display: flex;
                        gap: 1em;
                        align-items: flex-start;
                        cursor: pointer;
                        transition: transform .3s, background .3s, border .3s;
                    }

                    .option-card:hover {
                        transform: scale(1.02);
                        background: var(--yellow);
                        border-color: var(--dark-yellow);
                    }

                    .option-card:hover .option-number {
                        background: var(--dark-blue);
                        color: var(--yellow);
                    }

                    .option-card:hover .option-content h4,
                    .option-card:hover .option-content p {
                        color: var(--dark-blue);
                    }

                    .option-number {
                        background: var(--yellow);
                        color: var(--dark-blue);
                        width: 2.5em;
                        height: 2.5em;
                        border-radius: 50%;
                        display: grid;
                        place-items: center;
                        font-size: 1.2em;
                        font-weight: 700;
                        flex-shrink: 0;
                        transition: background .3s, color .3s;
                    }

                    .option-content {
                        flex: 1;
                    }

                    .option-content h4 {
                        color: var(--white);
                        font-size: 1em;
                        font-weight: 600;
                        margin: 0 0 .3em;
                        transition: color .3s;
                    }

                    .option-content p {
                        color: var(--white);
                        font-size: .9em;
                        font-weight: 300;
                        margin: 0;
                        line-height: 1.4;
                        transition: color .3s;
                    }

                    .option-content p strong {
                        font-weight: 600;
                    }

                    .btn-cancel-bottom {
                        background: var(--transparent-white);
                        border: .15em solid var(--yellow);
                        color: var(--white);
                        padding: .7em 1.5em;
                        border-radius: .5em;
                        font-size: .95em;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform .3s, background .3s, color .3s, border .3s;
                        justify-self: center;
                        margin-top: .5em;
                    }

                    .btn-cancel-bottom:hover {
                        transform: scale(1.05);
                        background: var(--yellow);
                        color: var(--dark-blue);
                        border-color: var(--dark-yellow);
                    }
                `}</style>
            </div>
        )}
    </>
}

export default SchedulingPlanOptions
