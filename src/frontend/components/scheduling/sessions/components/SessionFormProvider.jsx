import { Calendar, Clock, User } from 'lucide-react'
import { FormProvider } from 'react-hook-form'
import SessionsDate from '../SessionsDate'
import SessionsHour from '../SessionsHour'
import SessionsModality from '../SessionsModality'
import SessionWrapperSection from '../SessionWrapperSection'
import FormControls from './FormControls'
import FormTitle from './FormTitle'
import ProgressIndicator from './ProgressIndicator'

const SessionFormProvider = ({
    agendaSlots = [],
    isRefreshing = false,
    methods,
    handleSubmit,
    onSubmit,
    formData,
    currentEditingSessionId,
    sessions,
    planData,
    showDateSection,
    showHourSection,
    showCancelButton,
    showSaveButton,
    showCreateButton,
    isEditingMode,
    onFinishEdit,
    getNextValidDateRange,
    getSessionDates,
    formatDateForDisplay,
    modalityRef,
    dateRef,
    hourRef,
    submitRef,
    id
}) => {
    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Título del formulario */}
                <FormTitle
                    isEditing={!!currentEditingSessionId}
                    currentSessionNumber={sessions.length + 1}
                    totalSessions={planData?.sessionsNumber}
                />

                {/* Indicador de progreso */}
                <ProgressIndicator
                    hasModality={!!formData.modality}
                    showDateSection={showDateSection}
                    hasDate={!!formData.date}
                    showHourSection={showHourSection}
                    hasHour={!!formData.hour}
                />

                {/* Modalidad - Siempre visible */}
                <div ref={modalityRef}>
                    <SessionWrapperSection
                        title='Modalidad'
                        icon={<User size="1.5em" strokeWidth=".2em" />}
                        fieldName="modality"
                    >
                        <SessionsModality
                            agendaSlots={agendaSlots}
                        />
                    </SessionWrapperSection>
                </div>

                {/* Fecha - Solo visible después de seleccionar modalidad */}
                {showDateSection && (
                    <div ref={dateRef} className="section-fade-in">
                        <SessionWrapperSection
                            title='Fecha'
                            icon={<Calendar size="1.5em" strokeWidth=".1em" />}
                            fieldName="date"
                        >
                            <SessionsDate
                                agendaSlots={agendaSlots}
                                dateRestrictions={getNextValidDateRange()}
                                existingSessionDates={getSessionDates(currentEditingSessionId)}
                                formatDateForDisplay={formatDateForDisplay}
                            />
                        </SessionWrapperSection>
                    </div>
                )}

                {/* Hora - Solo visible después de seleccionar fecha */}
                {showHourSection && (
                    <div ref={hourRef} className="section-fade-in">
                        <SessionWrapperSection
                            title='Hora'
                            icon={<Clock size="1.5em" strokeWidth=".1em" />}
                            fieldName="hour"
                        >
                            <SessionsHour
                                agendaSlots={agendaSlots}
                                isRefreshing={isRefreshing}
                                id={id}
                                isEditing={!!currentEditingSessionId}
                            />
                        </SessionWrapperSection>
                    </div>
                )}

                {/* Botones de control - Lógica separada para edición y creación */}
                {(showCancelButton || showSaveButton || showCreateButton) && (
                    <div ref={submitRef}>
                        <FormControls
                            isEditing={isEditingMode}
                            showCancelButton={showCancelButton}
                            showSaveButton={showSaveButton}
                            showCreateButton={showCreateButton}
                            onCancel={onFinishEdit}
                        />
                    </div>
                )}

                <style jsx>{`
                    form {
                        margin: 1em;
                        padding: 2em;
                        background: var(--white);
                        border-radius: .5em;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        display: grid;
                        gap: 2em;
                    }

                    /* Animaciones para las secciones */
                    .section-fade-in {
                        animation: slideInFocus 0.6s ease-out;
                        position: relative;
                    }

                    .section-fade-in::before {
                        content: '';
                        position: absolute;
                        top: -10px;
                        left: -10px;
                        right: -10px;
                        bottom: -10px;
                        background: linear-gradient(45deg, var(--yellow), var(--transparent-yellow));
                        border-radius: 1em;
                        opacity: 0.1;
                        z-index: -1;
                        animation: highlightPulse 2s ease-out;
                    }

                    @keyframes highlightPulse {
                        0% {
                            opacity: 0;
                            transform: scale(0.9);
                        }
                        50% {
                            opacity: 0.2;
                            transform: scale(1.02);
                        }
                        100% {
                            opacity: 0.1;
                            transform: scale(1);
                        }
                    }

                    @keyframes slideInFocus {
                        0% {
                            opacity: 0;
                            transform: translateY(30px) scale(0.95);
                        }
                        50% {
                            opacity: 0.7;
                            transform: translateY(10px) scale(0.98);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }

                    section {
                        transition: all 0.3s ease;
                    }
                `}</style>
            </form>
        </FormProvider>
    )
}

export default SessionFormProvider
