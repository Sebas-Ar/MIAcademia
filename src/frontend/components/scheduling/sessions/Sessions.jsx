import { usePreScheduledSessionsStore } from '@/frontend/hooks/globalState/usePreScheduledSessionsStore'
import { useSessionSync } from '@/frontend/hooks/useSessionSync'
import { useEffect, useState } from 'react'
import ConfirmScheduling from './components/ConfirmScheduling'
import SessionFormProvider from './components/SessionFormProvider'
import TimeoutNotification from './components/TimeoutNotification'
import { useSessionForm } from './hooks/useSessionForm'
import SessionsScheduled from './SessionsScheduled'

const Sessions = ({
    id = '',
    planData = null,
    editingSessionId = null,
    onEditComplete = null
}) => {
    // Store hooks
    const showTimeoutNotification = usePreScheduledSessionsStore((state) => state.showTimeoutNotification)
    const dismissTimeoutNotification = usePreScheduledSessionsStore((state) => state.dismissTimeoutNotification)
    const areAllSessionsConfirmed = usePreScheduledSessionsStore((state) => state.areAllSessionsConfirmed)

    // Hook de sincronización automática
    const { userId, userEmail } = useSessionSync()

    const [agendaSlots, setAgendaSlots] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Función para obtener los datos de agenda
    const getAgendaSlots = async () => {
        try {
            setIsRefreshing(true)
            const response = await fetch('/api/schedules')
            const data = await response.json()
            setAgendaSlots(data)
        } catch (error) {
            console.error('Error fetching agenda slots:', error)
        } finally {
            setIsRefreshing(false)
        }
    }

    // Custom hook con toda la lógica del formulario
    const {
        methods,
        handleSubmit,
        formData,
        onSubmit,
        currentEditingSessionId,
        sessions,
        showDateSection,
        showHourSection,
        showConfirmButton,
        handleStartEdit,
        handleFinishEdit,
        handleConfirmScheduling,
        modalityRef,
        dateRef,
        hourRef,
        submitRef,
        sessionsPreAgendaRef,
        getNextValidDateRange,
        getSessionDates,
        formatDateForDisplay,
        // Estados separados para botones en modo edición
        isEditingMode,
        showCancelButton,
        showSaveButton,
        showCreateButton
    } = useSessionForm({
        planData,
        editingSessionId,
        onEditComplete,
        agendaSlots,
        refreshAgendaSlots: getAgendaSlots, // Pasar función de recarga
        id: userId || id // Usar ID del usuario autenticado o el id prop
    })

    useEffect(() => {
        // Cargar datos iniciales
        getAgendaSlots()

        // Escuchar eventos de recarga manual
        const handleManualRefresh = () => {
            getAgendaSlots()
        }

        window.addEventListener('manualRefreshRequested', handleManualRefresh)

        return () => {
            window.removeEventListener('manualRefreshRequested', handleManualRefresh)
        }
    }, [])

    // Determinar si se debe mostrar el formulario de agendamiento
    const allSessionsConfirmed = areAllSessionsConfirmed()
    const shouldShowForm = !allSessionsConfirmed

    return (
        <div className="sessions-container">
            {/* Notificación de timeout */}
            <TimeoutNotification
                showTimeoutNotification={showTimeoutNotification}
                onDismiss={dismissTimeoutNotification}
            />

            {/* Lista de sesiones agendadas */}
            <SessionsScheduled
                sessionsPreAgendaRef={sessionsPreAgendaRef}
                planData={planData}
                onEditSession={handleStartEdit}
                onCancelEdit={handleFinishEdit}
                editingSessionId={currentEditingSessionId}
                userId={userId} // Pasar userId para sincronización
                userEmail={userEmail} // Mantener por compatibilidad
            />

            {/* Mensaje cuando todas las sesiones están confirmadas */}
            {allSessionsConfirmed && (
                <div className="sessions-completed-info">
                    <div className="completion-badge">
                        <span>✅</span>
                        <h3>Todas las sesiones confirmadas</h3>
                    </div>
                    <p>
                        Has completado exitosamente el proceso de agendamiento.
                        Todas tus sesiones han sido confirmadas y están listas.
                    </p>
                    <p className="contact-info">
                        Si necesitas realizar cambios, por favor contacta a nuestro equipo de soporte.
                    </p>
                </div>
            )}

            {/* Formulario de agendamiento/edición */}
            {shouldShowForm && (!showConfirmButton || currentEditingSessionId) && (
                <SessionFormProvider
                    agendaSlots={agendaSlots}
                    isRefreshing={isRefreshing}
                    methods={methods}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    formData={formData}
                    currentEditingSessionId={currentEditingSessionId}
                    sessions={sessions}
                    planData={planData}
                    showDateSection={showDateSection}
                    showHourSection={showHourSection}
                    showCancelButton={showCancelButton}
                    showSaveButton={showSaveButton}
                    showCreateButton={showCreateButton}
                    isEditingMode={isEditingMode}
                    onFinishEdit={handleFinishEdit}
                    getNextValidDateRange={getNextValidDateRange}
                    getSessionDates={getSessionDates}
                    formatDateForDisplay={formatDateForDisplay}
                    modalityRef={modalityRef}
                    dateRef={dateRef}
                    hourRef={hourRef}
                    submitRef={submitRef}
                    id={id}
                />
            )}

            {/* Confirmación de agendamiento completo */}
            {shouldShowForm && showConfirmButton && !currentEditingSessionId && (
                <ConfirmScheduling
                    onConfirm={handleConfirmScheduling}
                />
            )}

            <style jsx>{`
                .sessions-container {
                    max-width: 65em;
                    margin-inline: auto;
                }

                .sessions-completed-info {
                    background: linear-gradient(135deg, #d1fae5, #ecfdf5);
                    border: 2px solid #10b981;
                    border-radius: 12px;
                    padding: 2em;
                    margin: 2em 0;
                    text-align: center;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
                }

                .completion-badge {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75em;
                    margin-bottom: 1.5em;
                }

                .completion-badge span {
                    font-size: 2em;
                    animation: celebration 2s ease-in-out infinite;
                }

                .completion-badge h3 {
                    margin: 0;
                    color: #047857;
                    font-size: 1.5em;
                    font-weight: 600;
                }

                .sessions-completed-info p {
                    color: #047857;
                    font-size: 1.1em;
                    line-height: 1.6;
                    margin: 1em 0;
                    max-width: 600px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .contact-info {
                    font-size: 1em !important;
                    color: #065f46 !important;
                    font-weight: 500;
                    background: rgba(16, 185, 129, 0.1);
                    padding: 1em;
                    border-radius: 8px;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }

                @keyframes celebration {
                    0%, 100% {
                        transform: scale(1) rotate(0deg);
                    }
                    25% {
                        transform: scale(1.1) rotate(-5deg);
                    }
                    50% {
                        transform: scale(1.2) rotate(0deg);
                    }
                    75% {
                        transform: scale(1.1) rotate(5deg);
                    }
                }
            `}</style>
        </div>
    )
}

export default Sessions
