import { usePreScheduledSessionsStore } from '@/frontend/hooks/globalState/usePreScheduledSessionsStore'
import { AlertTriangle, Calendar, Clock, Edit3, Trash2, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import SessionProgress from './components/SessionProgress'

const SessionsScheduled = ({
    sessionsPreAgendaRef = null,
    planData = null,
    onEditSession = null,
    onCancelEdit = null,
    editingSessionId = null,
    userId = '', // Agregar userId para sincronización
    userEmail = '' // Mantener por compatibilidad
}) => {
    const sessions = usePreScheduledSessionsStore((state) => state.sessions)
    const globalTimeout = usePreScheduledSessionsStore((state) => state.globalTimeout)
    const deleteSession = usePreScheduledSessionsStore((state) => state.deleteSession)
    const cleanupExpiredSessions = usePreScheduledSessionsStore((state) => state.cleanupExpiredSessions)

    const [currentTime, setCurrentTime] = useState(new Date())
    const [showSubsequentSessionsWarning, setShowSubsequentSessionsWarning] = useState(false)
    const [showDeleteValidationWarning, setShowDeleteValidationWarning] = useState(false)
    const [sessionToEdit, setSessionToEdit] = useState(null)
    const [sessionToDelete, setSessionToDelete] = useState(null)
    const [subsequentSessionsToDelete, setSubsequentSessionsToDelete] = useState([])

    // Función helper para validar restricciones de tiempo entre sesiones
    const validateTimeRestrictions = (sessionToRemove) => {
        const sessionIndex = sessions.findIndex(s => s.id === sessionToRemove.id)

        // Si es la primera o última sesión, no hay problemas
        if (sessionIndex === 0 || sessionIndex === sessions.length - 1) {
            return { isValid: true, invalidSessions: [] }
        }

        // Obtener sesiones antes y después
        const previousSession = sessions[sessionIndex - 1]
        const nextSession = sessions[sessionIndex + 1]

        if (!previousSession || !nextSession) {
            return { isValid: true, invalidSessions: [] }
        }

        // Convertir fechas para comparación
        const previousDate = new Date(previousSession.date)
        const nextDate = new Date(nextSession.date)

        // Calcular diferencia en días
        const daysDifference = Math.floor((nextDate - previousDate) / (1000 * 60 * 60 * 24))

        // Verificar restricciones
        if (daysDifference < 2 || daysDifference > 7) {
            // Si no cumple restricciones, todas las sesiones posteriores deben eliminarse
            const invalidSessions = sessions.slice(sessionIndex + 1)
            return { isValid: false, invalidSessions }
        }

        return { isValid: true, invalidSessions: [] }
    }

    const handleDeleteSession = (sessionId) => {
        const session = sessions.find(s => s.id === sessionId)
        if (!session) return

        // Validar restricciones de tiempo
        const validation = validateTimeRestrictions(session)

        if (!validation.isValid && validation.invalidSessions.length > 0) {
            // Mostrar warning para eliminaciones en cascada
            setSessionToDelete(session)
            setSubsequentSessionsToDelete(validation.invalidSessions)
            setShowDeleteValidationWarning(true)
        } else {
            // Eliminación directa sin problemas de restricciones
            const { date, hour } = formatDateTime(session.date, session.hour)

            toast('¿Estás seguro de que quieres eliminar esta sesión?', {
                description: `Sesión del ${date} a las ${hour}`,
                duration: 10000, // 10 segundos
                action: {
                    label: 'Eliminar',
                    onClick: () => {
                        deleteSession(sessionId, userId)
                        toast.success('Sesión eliminada correctamente')
                    }
                },
                cancel: {
                    label: 'Cancelar',
                    onClick: () => {}
                }
            })
        }
    }

    // Handler para confirmar eliminación con advertencia
    const handleConfirmDeleteWithWarning = async () => {
        if (!sessionToDelete) return

        try {
            // Eliminar la sesión principal
            await deleteSession(sessionToDelete.id, userId)

            // Eliminar las sesiones subsecuentes si las hay
            for (const session of subsequentSessionsToDelete) {
                await deleteSession(session.id, userId)
            }

            // Limpiar estados
            setShowDeleteValidationWarning(false)
            setSessionToDelete(null)
            setSubsequentSessionsToDelete([])

            toast.success(`${1 + subsequentSessionsToDelete.length} sesión${1 + subsequentSessionsToDelete.length > 1 ? 'es eliminadas' : ' eliminada'} correctamente`, {
                description: 'Las restricciones de tiempo se mantuvieron correctamente'
            })
        } catch (error) {
            console.error('Error al eliminar sesiones:', error)
            toast.error('Error al eliminar las sesiones')
        }
    }

    // Handler para cancelar eliminación con advertencia
    const handleCancelDeleteWarning = () => {
        setShowDeleteValidationWarning(false)
        setSessionToDelete(null)
        setSubsequentSessionsToDelete([])
    }

    const handleEditSession = (sessionId) => {
        const session = sessions.find(s => s.id === sessionId)
        if (!session) return

        // Verificar si hay sesiones posteriores que serían afectadas
        const sessionIndex = sessions.findIndex(s => s.id === sessionId)
        const hasSubsequentSessions = sessionIndex < sessions.length - 1

        if (hasSubsequentSessions) {
            setSessionToEdit(session)
            setShowSubsequentSessionsWarning(true)
        } else {
            // Llamar directamente al callback de edición
            if (onEditSession) {
                onEditSession(sessionId)
            }
        }
    }

    const handleConfirmEditWithWarning = () => {
        if (sessionToEdit) {
            // Eliminar sesiones posteriores
            const sessionIndex = sessions.findIndex(s => s.id === sessionToEdit.id)
            const subsequentSessions = sessions.slice(sessionIndex + 1)

            // Eliminar todas las sesiones posteriores
            subsequentSessions.forEach(session => deleteSession(session.id, userId))

            // Iniciar edición
            if (onEditSession) {
                onEditSession(sessionToEdit.id)
            }
        }
        setShowSubsequentSessionsWarning(false)
        setSessionToEdit(null)
    }

    const handleCancelEditWarning = () => {
        setShowSubsequentSessionsWarning(false)
        setSessionToEdit(null)
    }

    // Función para manejar el acceso a videollamada
    const handleJoinVideoCall = (session) => {
        // Por ahora mostrar un toast, luego se puede integrar con el sistema de videollamadas
        toast.success('Redirigiendo a la videollamada...', {
            description: `Sesión del ${formatDateTime(session.date, session.hour).date} a las ${session.hour}`
        })

        // Aquí se podría agregar la lógica para:
        // - Abrir una nueva ventana con la URL de la videollamada
        // - Redirigir a una página de videollamada
        // - Integrar con servicios como Zoom, Google Meet, etc.

        console.log('Joining video call for session:', session)
    }

    useEffect(() => {
        // Limpiar sesiones expiradas al montar el componente solo si hay userId
        if (userId) {
            cleanupExpiredSessions(userId)
        }

        // Actualizar tiempo actual cada segundo para mostrar countdown en tiempo real
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date())

            // Verificar timeout cada segundo (más eficiente que timer separado)
            if (userId && globalTimeout) {
                const now = new Date()
                const expires = new Date(globalTimeout)

                // Solo ejecutar cleanup si está cerca de expirar o expiró
                if (expires <= now) {
                    cleanupExpiredSessions(userId)
                }
            }
        }, 1000)

        return () => {
            clearInterval(timeInterval)
        }
    }, [cleanupExpiredSessions, userId, globalTimeout])

    // Función para traducir status al español
    const getStatusInSpanish = (status) => {
        const statusTranslations = {
            available: 'Disponible',
            'pre-booked': 'Pre-agendada',
            scheduled: 'Agendada',
            completed: 'Completada',
            cancelled: 'Cancelada',
            'in-progress': 'En progreso'
        }
        return statusTranslations[status] || status
    }

    const formatDateTime = (dateStr, hourStr) => {
        const [year, month, day] = dateStr.split('-')
        const date = new Date(year, month - 1, day)
        return {
            date: date.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            hour: hourStr
        }
    }

    const getTimeRemaining = () => {
        if (!globalTimeout) return null

        const expires = new Date(globalTimeout)
        const diff = expires - currentTime

        if (diff <= 0) return 'Expirado'

        const minutes = Math.floor(diff / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    if (sessions.length === 0) return null

    // Verificar si todas las sesiones están confirmadas
    const allSessionsConfirmed = sessions.length > 0 && sessions.every(session => session.status === 'scheduled')

    return (
        <article className="sessions-scheduled" ref={sessionsPreAgendaRef}>

            {/* Progreso de sesiones */}
            <SessionProgress
                sessionsCount={sessions.length}
                totalSessions={planData?.sessionsNumber}
                sessions={sessions}
                allSessionsConfirmed={allSessionsConfirmed}
            />

            <header>
                {/* Mostrar tiempo global si hay sesiones pre-agendadas */}
                {globalTimeout && sessions.length > 0 && (
                    <div className="global-timer">
                        <Clock size="1em" strokeWidth="0.15em" />
                        <span>Tiempo restante para confirmar sesiones:</span>
                        <span className="timer-countdown">
                            {getTimeRemaining() || 'Cargando...'}
                        </span>
                    </div>
                )}
            </header>

            {/* Mensaje informativo cuando hay una sesión en edición */}
            {editingSessionId && (
                <div className="editing-info">
                    <Edit3 size="1em" strokeWidth="0.15em" />
                    <span>Editando sesión - Las demás sesiones están temporalmente deshabilitadas</span>
                </div>
            )}

            <div className="sessions-list">
                {sessions.map((session, index) => {
                    const { date, hour } = formatDateTime(session.date, session.hour)
                    const isEditing = editingSessionId === session.id
                    const hasEditingSession = editingSessionId !== null
                    const isOtherSessionEditing = hasEditingSession && !isEditing

                    return (
                        <div
                            key={session.id}
                            className={`session-card ${isEditing ? 'editing' : ''} ${isOtherSessionEditing ? 'dimmed' : ''}`}
                        >
                            {/* Indicador de edición */}
                            {isEditing && (
                                <div className="editing-indicator">
                                    <div className="editing-badge">
                                        <Edit3 size="0.9em" strokeWidth="0.2em" />
                                        <span>Editando</span>
                                    </div>
                                </div>
                            )}

                            <div className="session-header">
                                <div className="session-status">
                                    <span className={`status-icon ${isEditing ? 'editing-icon' : ''}`}>
                                        {isEditing
                                            ? (
                                                <Edit3 size="1.2em" strokeWidth="0.15em" />
                                            )
                                            : (
                                                <Clock size="1.2em" strokeWidth="0.15em" />
                                            )
                                        }
                                    </span>
                                    <span className="status-text">
                                        {isEditing ? 'Editando' : getStatusInSpanish(session.status)}
                                    </span>
                                </div>
                                <div className="session-number">Sesión {index + 1}</div>
                            </div>

                            <div className="session-details">
                                <div className="detail-item">
                                    <User size="1em" strokeWidth="0.15em" />
                                    <span>{session.modality}</span>
                                </div>
                                <div className="detail-item">
                                    <Calendar size="1em" strokeWidth="0.15em" />
                                    <span>{date}</span>
                                </div>
                                <div className="detail-item">
                                    <Clock size="1em" strokeWidth="0.15em" />
                                    <span>{hour}</span>
                                </div>
                            </div>

                            {/* Acciones según el status de la sesión */}
                            <div className="session-actions">
                                {session.status === 'scheduled'
                                    ? (() => {
                                        console.log({ hour }) // ej 10:00 AM
                                        const today = new Date()
                                        const [year, month, day] = session.date.split('-')
                                        const sessionDate = new Date(year, month - 1, day)
                                        const isToday = today.toDateString() === sessionDate.toDateString()
                                        const isPast = sessionDate < today && !isToday
                                        const isFuture = sessionDate > today

                                        if (isPast) {
                                            return (
                                                <button
                                                    className="action-btn completed-btn"
                                                    disabled
                                                    title="Sesión pasada"
                                                >
                                                    <Clock size="1em" strokeWidth="0.15em" />
                                                    <span>Sesión pasada</span>
                                                </button>
                                            )
                                        } else if (isFuture) {
                                            // Calcular días restantes
                                            const timeDiff = sessionDate - today
                                            const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

                                            return (
                                                <button
                                                    className="action-btn future-btn"
                                                    disabled
                                                    title={`Disponible el ${formatDateTime(session.date, session.hour).date}`}
                                                >
                                                    <Calendar size="1em" strokeWidth="0.15em" />
                                                    <span>
                                                        {daysRemaining === 1
                                                            ? 'Mañana'
                                                            : `En ${daysRemaining} días`}
                                                    </span>
                                                </button>
                                            )
                                        } else {
                                            // Es hoy - verificar la hora
                                            const [hourStr, minuteStr] = hour.split(':')
                                            const sessionHour = parseInt(hourStr)
                                            const sessionMinute = parseInt(minuteStr.replace(/[^0-9]/g, '')) // Remover AM/PM
                                            const isPM = hour.toLowerCase().includes('pm') && sessionHour !== 12
                                            const is12AM = hour.toLowerCase().includes('am') && sessionHour === 12

                                            const sessionTime = new Date(sessionDate)
                                            sessionTime.setHours(
                                                is12AM ? 0 : (isPM ? sessionHour + 12 : sessionHour),
                                                sessionMinute,
                                                0,
                                                0
                                            )

                                            const now = new Date()
                                            const timeDiff = sessionTime - now

                                            if (timeDiff > 0) {
                                                // La sesión es más tarde hoy - mostrar cuenta regresiva
                                                const hoursRemaining = Math.floor(timeDiff / (1000 * 60 * 60))
                                                const minutesRemaining = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

                                                return (
                                                    <button
                                                        className="action-btn countdown-btn"
                                                        onClick={() => handleJoinVideoCall(session)}
                                                        title={`La sesión comienza en ${hoursRemaining}h ${minutesRemaining}m - Clic para prepararte`}
                                                    >
                                                        <Clock size="1em" strokeWidth="0.15em" />
                                                        <span>En {hoursRemaining}h {minutesRemaining}m</span>
                                                    </button>
                                                )
                                            } else {
                                                // La hora ya pasó o es ahora - mostrar botón activo
                                                return (
                                                    <button
                                                        className="action-btn videocall-btn"
                                                        onClick={() => handleJoinVideoCall(session)}
                                                        title="Unirse a la videollamada"
                                                    >
                                                        <svg size="1em" strokeWidth="0.15em" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path d="M23 7l-7 5 7 5V7z"/>
                                                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                                                        </svg>
                                                        <span>Unirse a la sesión</span>
                                                    </button>
                                                )
                                            }
                                        }
                                    })()
                                    : isEditing
                                        ? <button
                                            className="action-btn cancel-edit-btn"
                                            onClick={onCancelEdit}
                                            title="Cancelar edición"
                                        >
                                            <X size="1em" strokeWidth="0.15em" />
                                            <span>Cancelar edición</span>
                                        </button>
                                        : <>
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={() => handleEditSession(session.id)}
                                                title="Editar sesión"
                                                disabled={isOtherSessionEditing}
                                            >
                                                <Edit3 size="1em" strokeWidth="0.15em" />
                                                <span>Editar</span>
                                            </button>
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={() => handleDeleteSession(session.id)}
                                                title="Eliminar sesión"
                                                disabled={isOtherSessionEditing}
                                            >
                                                <Trash2 size="1em" strokeWidth="0.15em" />
                                                <span>Eliminar</span>
                                            </button>
                                        </>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Modal de advertencia para sesiones posteriores */}
            {showSubsequentSessionsWarning && (
                <div className="modal-page-warning">
                    <div className="modal-background" onClick={handleCancelEditWarning}></div>
                    <div className="modal-wrapper-warning" onClick={(e) => e.stopPropagation()}>
                        <button onClick={handleCancelEditWarning} className="btn-close-warning">
                            <X size="1.4em" strokeWidth=".2em" />
                        </button>

                        <div className="modal-icon-warning">
                            <AlertTriangle size={40} strokeWidth={2} />
                        </div>

                        <h3>Advertencia: Edición de Sesión</h3>

                        <p className="modal-description-warning">
                            Esta sesión tiene <strong>{sessions.length - sessions.findIndex(s => s.id === sessionToEdit?.id) - 1} sesión{sessions.length - sessions.findIndex(s => s.id === sessionToEdit?.id) - 1 > 1 ? 'es' : ''} posterior{sessions.length - sessions.findIndex(s => s.id === sessionToEdit?.id) - 1 > 1 ? 'es' : ''}</strong> que dependen de su fecha y hora.
                        </p>

                        <p className="modal-info-warning">
                            Al editar esta sesión, <strong>todas las sesiones posteriores serán eliminadas</strong> automáticamente debido a las restricciones de tiempo condicional.
                        </p>

                        <p className="modal-question-warning">¿Estás seguro de que deseas continuar con la edición?</p>

                        <div className="options-container-warning">
                            <button className="option-btn-warning btn-cancel-warning" onClick={handleCancelEditWarning}>
                                Cancelar
                            </button>
                            <button className="option-btn-warning btn-confirm-warning" onClick={handleConfirmEditWithWarning}>
                                Confirmar y editar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de advertencia para eliminación con restricciones */}
            {showDeleteValidationWarning && sessionToDelete && (
                <div className="modal-page-delete">
                    <div className="modal-background" onClick={handleCancelDeleteWarning}></div>
                    <div className="modal-wrapper-delete" onClick={(e) => e.stopPropagation()}>
                        <button onClick={handleCancelDeleteWarning} className="btn-close-delete">
                            <X size="1.4em" strokeWidth=".2em" />
                        </button>

                        <div className="modal-icon-delete">
                            <AlertTriangle size={40} strokeWidth={2} />
                        </div>

                        <h3>Advertencia: Eliminación de Sesión</h3>

                        <p className="modal-description-delete">
                            Al eliminar esta sesión intermedia, las sesiones restantes <strong>no cumplirían las restricciones de tiempo</strong>:
                        </p>

                        <div className="restrictions-box">
                            <div>• Mínimo 2 días de separación entre sesiones</div>
                            <div>• Máximo 1 semana de separación entre sesiones</div>
                        </div>

                        <p className="modal-info-delete">
                            Para mantener la consistencia, <strong>{subsequentSessionsToDelete.length} sesión{subsequentSessionsToDelete.length > 1 ? 'es' : ''} posterior{subsequentSessionsToDelete.length > 1 ? 'es' : ''}</strong> también debe{subsequentSessionsToDelete.length > 1 ? 'n' : ''} ser eliminada{subsequentSessionsToDelete.length > 1 ? 's' : ''}:
                        </p>

                        <div className="sessions-to-delete-box">
                            {subsequentSessionsToDelete.map((session) => {
                                const { date, hour } = formatDateTime(session.date, session.hour)
                                return (
                                    <div key={session.id} className="session-delete-item">
                                        • Sesión {sessions.findIndex(s => s.id === session.id) + 1}: {date} a las {hour}
                                    </div>
                                )
                            })}
                        </div>

                        <p className="modal-question-delete">
                            <strong>¿Estás seguro de que deseas eliminar {1 + subsequentSessionsToDelete.length} sesión{1 + subsequentSessionsToDelete.length > 1 ? 'es' : ''}?</strong>
                        </p>

                        <div className="options-container-delete">
                            <button className="option-btn-delete btn-cancel-delete" onClick={handleCancelDeleteWarning}>
                                Cancelar
                            </button>
                            <button className="option-btn-delete btn-delete-confirm" onClick={handleConfirmDeleteWithWarning}>
                                Eliminar {1 + subsequentSessionsToDelete.length} sesión{1 + subsequentSessionsToDelete.length > 1 ? 'es' : ''}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .sessions-scheduled {
                    display: grid;
                    gap: 2em;
                }

                header {
                    display: grid;
                    gap: 1em;
                }

                .global-timer {
                    margin: auto;
                    display: flex;
                    align-items: center;
                    gap: 0.5em;
                    padding: 1em;
                    background: linear-gradient(135deg, var(--transparent-yellow), #fef3c7);
                    border: 1px solid var(--yellow);
                    border-radius: 0.5em;
                    font-size: 0.9em;
                    color: #92400e;
                }

                .timer-countdown {
                    font-weight: 600;
                    font-family: 'Courier New', monospace;
                    background: white;
                    padding: 0.25em 0.5em;
                    border-radius: 0.25em;
                    border: 1px solid #d97706;
                    color: #d97706;
                }

                .editing-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5em;
                    padding: 0.8em 1.2em;
                    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
                    border: 1px solid #3b82f6;
                    border-radius: 0.5em;
                    font-size: 0.9em;
                    color: #1e40af;
                    font-weight: 500;
                    animation: editingInfoSlide 0.3s ease-out;
                }

                @keyframes editingInfoSlide {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .sessions-list {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 2em;
                }

                .session-card {
                    min-width: 25em;
                    background: var(--white);
                    border: 1px solid var(--gray);
                    border-radius: 0.5em;
                    padding: 1.5em;
                    display: grid;
                    gap: 1em;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                /* Estilos para sesión en edición */
                .session-card.editing {
                    border: 2px solid #3b82f6;
                    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.25);
                    background: linear-gradient(135deg, #eff6ff, #ffffff);
                    transform: scale(1.02);
                    animation: editingGlow 2s ease-in-out infinite alternate;
                    z-index: 10;
                }

                /* Estilos para sesiones no editables cuando hay una en edición */
                .session-card.dimmed {
                    opacity: 0.6;
                    filter: grayscale(20%);
                    transform: scale(0.98);
                    pointer-events: none;
                }

                .editing-indicator {
                    position: absolute;
                    top: .5em;
                    left: 50%;
                    transform: translateX(-50%);
                    animation: editingSlide 2s linear infinite;
                }

                .editing-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.5em;
                    background: #3b82f6;
                    color: white;
                    padding: 0.4em 0.6em;
                    border-radius: 1em;
                    font-size: 0.75em;
                    font-weight: 600;
                    z-index: 10;
                    animation: editingPulse 1.5s ease-in-out infinite;
                }

                @keyframes editingGlow {
                    0% {
                        box-shadow: 0 4px 20px rgba(59, 130, 246, 0.25);
                    }
                    100% {
                        box-shadow: 0 6px 25px rgba(59, 130, 246, 0.4);
                    }
                }

                @keyframes editingSlide {
                    0% {
                        background-position: 0% 0%;
                    }
                    100% {
                        background-position: 200% 0%;
                    }
                }

                @keyframes editingPulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }

                .session-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .session-status {
                    display: flex;
                    align-items: center;
                    gap: 0.5em;
                }

                .status-icon {
                    display: flex;
                    align-items: center;
                    color: #f59e0b; /* Color amarillo para todas las sesiones pre-agendadas */
                    transition: all 0.3s ease;
                }

                .status-icon.editing-icon {
                    color: #3b82f6;
                    animation: editingIconPulse 1.5s ease-in-out infinite;
                }

                @keyframes editingIconPulse {
                    0%, 100% {
                        transform: scale(1);
                        color: #3b82f6;
                    }
                    50% {
                        transform: scale(1.1);
                        color: #1d4ed8;
                    }
                }

                .status-text {
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .time-remaining {
                    font-size: 0.8em;
                    color: var(--color-fg-muted);
                    background: var(--transparent-yellow);
                    padding: 0.25em 0.5em;
                    border-radius: 0.25em;
                }

                .session-number {
                    font-size: 0.8em;
                    font-weight: 600;
                    color: var(--color-fg-muted);
                    background: var(--gray);
                    padding: 0.25em 0.5em;
                    border-radius: 0.25em;
                }

                .session-details {
                    display: grid;
                    gap: 0.5em;
                }

                .detail-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5em;
                    font-size: 0.9em;
                }

                .session-actions {
                    display: flex;
                    gap: 0.75em;
                    margin-top: 0.5em;
                    padding-top: 1em;
                    border-top: 1px solid var(--gray);
                }

                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5em;
                    padding: 0.5em 0.75em;
                    border: 1px solid;
                    border-radius: 0.25em;
                    font-size: 0.85em;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: white;
                    flex: 1;
                    justify-content: center;
                }

                .edit-btn {
                    border-color: #3b82f6;
                    color: #3b82f6;
                }

                .edit-btn:hover:not(:disabled) {
                    background-color: #3b82f6;
                    color: white;
                }

                .edit-btn.editing-active {
                    background-color: #3b82f6;
                    color: white;
                    border-color: #1d4ed8;
                    cursor: not-allowed;
                    opacity: 0.8;
                }

                .delete-btn {
                    border-color: #ef4444;
                    color: #ef4444;
                }

                .delete-btn:hover:not(:disabled) {
                    background-color: #ef4444;
                    color: white;
                }

                .cancel-edit-btn {
                    border-color: #6b7280;
                    color: #6b7280;
                    background-color: #f9fafb;
                }

                .cancel-edit-btn:hover {
                    background-color: #6b7280;
                    color: white;
                    border-color: #4b5563;
                }

                .action-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .action-btn:disabled:hover {
                    background: white;
                    transform: none;
                }

                .videocall-btn {
                    border-color: #10b981;
                    color: #10b981;
                    font-weight: 600;
                }

                .videocall-btn:hover {
                    background-color: #10b981;
                    color: white;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }

                .videocall-btn svg {
                    width: 1em;
                    height: 1em;
                }

                .completed-btn {
                    border-color: #6b7280;
                    color: #6b7280;
                    background-color: #f9fafb;
                    cursor: not-allowed;
                }

                .future-btn {
                    border-color: #f59e0b;
                    color: #f59e0b;
                    background-color: #fffbeb;
                    cursor: not-allowed;
                }

                .countdown-btn {
                    border-color: #8b5cf6;
                    color: #8b5cf6;
                    background: linear-gradient(135deg, #f8fafc, #ede9fe);
                    cursor: pointer;
                    font-weight: 600;
                    animation: countdownPulse 2s ease-in-out infinite;
                    position: relative;
                    overflow: hidden;
                }

                .countdown-btn:hover {
                    border-color: #7c3aed;
                    color: #7c3aed;
                    background: linear-gradient(135deg, #ede9fe, #ddd6fe);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.25);
                    animation: none; /* Pausar pulso durante hover */
                }

                .countdown-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
                }

                @keyframes countdownPulse {
                    0%, 100% {
                        box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);
                        border-color: #8b5cf6;
                    }
                    50% {
                        box-shadow: 0 3px 12px rgba(139, 92, 246, 0.2);
                        border-color: #7c3aed;
                    }
                }

                .session-reason,
                .session-notes {
                    font-size: 0.9em;
                    padding: 0.75em;
                    background: var(--gray);
                    border-radius: 0.25em;
                }

                /* Estilos de los modales - Nuevo diseño */
                .modal-page-warning, .modal-page-delete {
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

                .modal-wrapper-warning, .modal-wrapper-delete {
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

                .btn-close-warning, .btn-close-delete {
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

                .btn-close-warning:hover, .btn-close-delete:hover {
                    transform: scale(1.2);
                }

                .modal-icon-warning, .modal-icon-delete {
                    display: grid;
                    place-items: center;
                    color: var(--yellow);
                    margin-bottom: .5em;
                }

                .modal-icon-delete {
                    color: #ef4444;
                }

                .modal-wrapper-warning h3, .modal-wrapper-delete h3 {
                    font-size: 1.1em;
                    color: var(--yellow);
                    text-align: center;
                    font-weight: 600;
                    text-transform: uppercase;
                    margin: 0;
                }

                .modal-description-warning, .modal-description-delete {
                    color: var(--yellow);
                    font-size: 1em;
                    text-align: center;
                    font-weight: 300;
                    margin: .5em 0;
                }

                .modal-description-warning strong, .modal-description-delete strong {
                    font-weight: 600;
                }

                .modal-info-warning, .modal-info-delete {
                    color: var(--yellow);
                    font-size: .95em;
                    text-align: center;
                    font-weight: 300;
                    margin: 0;
                }

                .modal-question-warning, .modal-question-delete {
                    color: var(--yellow);
                    font-size: 1em;
                    text-align: center;
                    font-weight: 500;
                    margin: .8em 0 .5em;
                }

                .restrictions-box {
                    background: var(--transparent-white);
                    border: .15em solid var(--yellow);
                    border-radius: .5em;
                    padding: 1em;
                    margin: .8em 0;
                    color: var(--yellow);
                    font-size: .9em;
                }

                .restrictions-box div {
                    margin: .3em 0;
                }

                .sessions-to-delete-box {
                    background: rgba(239, 68, 68, 0.1);
                    border: .15em solid #ef4444;
                    border-radius: .5em;
                    padding: 1em;
                    margin: .8em 0;
                }

                .session-delete-item {
                    color: #ef4444;
                    font-size: .9em;
                    font-weight: 500;
                    margin: .3em 0;
                }

                .options-container-warning, .options-container-delete {
                    display: grid;
                    gap: .8em;
                    margin-top: .5em;
                }

                .option-btn-warning, .option-btn-delete {
                    padding: .9em 1.2em;
                    border-radius: .5em;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform .3s, background .3s, box-shadow .3s;
                    font-size: .95em;
                }

                .btn-cancel-warning, .btn-cancel-delete {
                    background: var(--transparent-white);
                    border: .15em solid var(--yellow);
                    color: var(--yellow);
                }

                .btn-cancel-warning:hover, .btn-cancel-delete:hover {
                    transform: scale(1.02);
                    background: var(--yellow);
                    color: var(--dark-blue);
                    border-color: var(--dark-yellow);
                }

                .btn-confirm-warning {
                    background: var(--yellow);
                    border: .15em solid var(--dark-yellow);
                    color: var(--dark-blue);
                }

                .btn-confirm-warning:hover {
                    transform: scale(1.02);
                    background: var(--dark-yellow);
                    box-shadow: 0 4px 16px rgba(251, 191, 36, 0.4);
                }

                .btn-delete-confirm {
                    background: #ef4444;
                    border: .15em solid #dc2626;
                    color: white;
                }

                .btn-delete-confirm:hover {
                    transform: scale(1.02);
                    background: #dc2626;
                    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
                }

                .option-btn-warning:active, .option-btn-delete:active {
                    transform: scale(0.98);
                }

                .edit-modal {
                    max-width: 600px;
                }

                /* Estilos del formulario de edición */
                .edit-form {
                    display: grid;
                    gap: 1.5em;
                }

                .form-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #e5e5e5;
                }

                .cancel-btn, .save-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 6px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.95em;
                }

                .cancel-btn {
                    background-color: #f5f5f5;
                    color: #333;
                }

                .cancel-btn:hover {
                    background-color: #e5e5e5;
                }

                .save-btn {
                    background-color: #3b82f6;
                    color: white;
                }

                .save-btn:hover {
                    background-color: #2563eb;
                }
            `}</style>
        </article>
    )
}

export default SessionsScheduled
