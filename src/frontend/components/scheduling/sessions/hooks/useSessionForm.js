import { usePreScheduledSessionsStore } from '@/frontend/hooks/globalState/usePreScheduledSessionsStore'
import { executeSlotOperation, handleConcurrencyError } from '@/frontend/utils/optimisticLocking'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const useSessionForm = ({
    planData,
    editingSessionId,
    onEditComplete,
    agendaSlots = [],
    refreshAgendaSlots = null, // Nueva función para recargar agenda slots
    id = '' // Agregar userEmail para las operaciones de la base de datos
}) => {
    const router = useRouter()
    const [internalEditingSessionId, setInternalEditingSessionId] = useState(editingSessionId)
    const [editCompleted, setEditCompleted] = useState(false) // Estado para detectar edición completada

    // Store hooks
    const addSession = usePreScheduledSessionsStore((state) => state.addSession)
    const updateSession = usePreScheduledSessionsStore((state) => state.updateSession)
    const checkTimeConflict = usePreScheduledSessionsStore((state) => state.checkTimeConflict)
    const sessions = usePreScheduledSessionsStore((state) => state.sessions)

    // Form hooks
    const methods = useForm({
        defaultValues: {
            slotId: '',
            modality: '',
            date: '',
            hour: ''
        }
    })

    const { handleSubmit, reset, watch } = methods
    const formData = watch()
    const prevFormData = useRef(formData)

    // Referencias para el scroll automático
    const modalityRef = useRef(null)
    const dateRef = useRef(null)
    const hourRef = useRef(null)
    const submitRef = useRef(null)
    const sessionsPreAgendaRef = useRef(null)

    // Estado derivado
    const currentEditingSessionId = editingSessionId || internalEditingSessionId
    const showDateSection = formData.modality && formData.modality !== ''
    const showHourSection = showDateSection && formData.date && formData.date !== ''
    const showSubmitButton = showHourSection && formData.hour && formData.hour !== ''

    // Estados separados para modo edición
    const isEditingMode = !!currentEditingSessionId
    const showCancelButton = isEditingMode // Siempre mostrar cancelar en modo edición
    const showSaveButton = isEditingMode && showSubmitButton // Solo mostrar guardar si está completo
    const showCreateButton = !isEditingMode && showSubmitButton // Solo mostrar crear si no está editando

    const requiredSessions = planData?.sessionsNumber || 1
    const showConfirmButton = sessions.length >= requiredSessions

    // Funciones helper para validación de fechas entre sesiones
    const getSessionDates = (excludeSessionId = null) => {
        return sessions
            .filter(session => session.id !== excludeSessionId) // Excluir sesión específica si se proporciona
            .map(session => {
                // Crear fecha local para evitar problemas de zona horaria
                const [year, month, day] = session.date.split('-')
                return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
            })
            .sort((a, b) => a - b)
    }

    const getNextValidDateRange = () => {
        // En modo edición, excluir la sesión que se está editando de las restricciones
        const excludeSessionId = currentEditingSessionId
        const sessionDates = getSessionDates(excludeSessionId)

        if (sessionDates.length === 0) return null

        // Obtener valores de intervalo del plan (con valores por defecto)
        const minDays = planData?.sessionInterval?.minDays || 2
        const maxDays = planData?.sessionInterval?.maxDays || 7

        const lastSessionDate = sessionDates[sessionDates.length - 1]

        // minDate debe respetar el minDays del plan
        const minDate = new Date(lastSessionDate)
        minDate.setDate(minDate.getDate() + minDays)

        const startDate = new Date(lastSessionDate)
        startDate.setDate(startDate.getDate() + minDays) // Fecha sugerida inicial

        const maxDate = new Date(lastSessionDate)
        maxDate.setDate(maxDate.getDate() + maxDays) // Máximo permitido

        return { minDate, maxDate, startDate, lastSessionDate }
    }

    const formatDateForDisplay = (date) => {
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        })
    }

    // Función para scroll suave
    const scrollToSection = (ref, block = 'center') => {
        if (ref.current) {
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block
            })
        }
    }

    // Handlers
    const handleStartEdit = (sessionId) => {
        // Si ya estamos editando, cancelar edición actual
        if (currentEditingSessionId) {
            reset({
                modality: '',
                date: '',
                hour: ''
            })
        }

        // Iniciar edición de la nueva sesión
        setInternalEditingSessionId(sessionId)
    }

    const handleFinishEdit = () => {
        setInternalEditingSessionId(null)

        // Limpiar el formulario
        reset({
            modality: '',
            date: '',
            hour: ''
        })

        if (onEditComplete) {
            onEditComplete() // Notificar que terminamos edición
        }
    }

    const handleConfirmScheduling = () => {
        router.push('/asesoria-vocacional/payment')
    }

    // Función para manejar errores de concurrencia
    const handleConcurrencyErrorAndRefresh = async (errorInfo) => {
        // Limpiar solo la hora seleccionada para volver al paso de selección de hora
        methods.setValue('hour', '')
        methods.setValue('slotId', '')

        // Recargar datos de agenda si la función está disponible
        if (refreshAgendaSlots) {
            await refreshAgendaSlots()
        }

        // Disparar evento para informar sobre el conflicto y actualización
        window.dispatchEvent(new CustomEvent('concurrencyErrorResolved', {
            detail: {
                timestamp: new Date().toISOString(),
                reason: 'Conflicto de concurrencia resuelto'
            }
        }))

        // Scroll automático hacia la sección de hora después de un breve delay
        setTimeout(() => {
            if (hourRef.current) {
                hourRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }
        }, 500)

        // Mostrar mensaje explicativo al usuario
        toast.info('Otro usuario pre agendó ese horario. Por favor, selecciona una nueva hora', {
            duration: 5000
        })
    }

    const onSubmit = async (data) => {
        // Validar que todos los campos estén completos
        if (!data.modality || !data.date || !data.hour) {
            toast.error('Por favor, completa todos los campos antes de agendar la sesión.')
            return
        }

        // edition mode active
        if (currentEditingSessionId) {
            // Modo edición
            // Verificar conflictos de horario (excluyendo la sesión actual)
            const otherSessions = sessions.filter(s => s.id !== currentEditingSessionId)
            const hasConflict = otherSessions.some(session =>
                session.date === data.date && session.hour === data.hour
            )

            if (hasConflict) {
                toast.error('Ya existe una sesión programada para esa fecha y hora. Por favor, selecciona otro horario.')
                return
            }

            // Validar restricciones de fechas entre sesiones (excluyendo la sesión actual)
            const [year, month, day] = data.date.split('-')
            const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
            const sessionDates = getSessionDates(currentEditingSessionId) // Excluir la sesión que se está editando

            if (sessionDates.length > 0) {
                // Obtener valores de intervalo del plan
                const minDays = planData?.sessionInterval?.minDays || 2
                const maxDays = planData?.sessionInterval?.maxDays || 7

                const lastSessionDate = sessionDates[sessionDates.length - 1]
                const daysDifference = Math.floor((selectedDate - lastSessionDate) / (1000 * 60 * 60 * 24))

                if (daysDifference < minDays) {
                    toast.error(`La sesión debe ser al menos ${minDays} días después de tu última sesión agendada (${formatDateForDisplay(lastSessionDate)}). Por favor, selecciona una fecha a partir del ${formatDateForDisplay(new Date(lastSessionDate.getTime() + minDays * 24 * 60 * 60 * 1000))}.`)
                    return
                }

                if (daysDifference > maxDays) {
                    toast.error(`La sesión no puede ser más de ${maxDays} días después de tu última sesión agendada (${formatDateForDisplay(lastSessionDate)}). Por favor, selecciona una fecha antes del ${formatDateForDisplay(new Date(lastSessionDate.getTime() + maxDays * 24 * 60 * 60 * 1000))}.`)
                    return
                }
            }

            // Actualizar la sesión
            try {
                await executeSlotOperation(
                    () => updateSession(currentEditingSessionId, { ...data, planId: planData._id }, id),
                    {
                        operationType: 'actualizar la sesión',
                        showToast: toast,
                        onConcurrencyError: handleConcurrencyErrorAndRefresh
                    }
                )
                toast.success('¡Sesión actualizada exitosamente!')

                // Marcar que se completó la edición para trigger del scroll
                setEditCompleted(true)

                // Finalizar edición
                setInternalEditingSessionId(null)

                // Llamar callback de finalización de edición
                if (onEditComplete) {
                    onEditComplete()
                }
            } catch (error) {
                // El error ya fue manejado por executeSlotOperation
                console.error('Error updating session:', error)
            }
        } else { // Modo creación
            // Verificar conflictos de horario
            if (checkTimeConflict(data.date, data.hour)) {
                toast.error('Ya existe una sesión agendada para esta fecha y hora. Por favor, selecciona otro horario.')
                return
            }

            // Validar restricciones de fechas entre sesiones
            // Crear fecha local para evitar problemas de zona horaria
            const [year, month, day] = data.date.split('-')
            const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
            const sessionDates = getSessionDates()

            if (sessionDates.length > 0) {
                // Obtener valores de intervalo del plan
                const minDays = planData?.sessionInterval?.minDays || 2
                const maxDays = planData?.sessionInterval?.maxDays || 7

                const lastSessionDate = sessionDates[sessionDates.length - 1]
                const daysDifference = Math.floor((selectedDate - lastSessionDate) / (1000 * 60 * 60 * 24))

                if (daysDifference < minDays) {
                    toast.error(`La próxima sesión debe ser al menos ${minDays} días después de tu última sesión agendada (${formatDateForDisplay(lastSessionDate)}). Por favor, selecciona una fecha a partir del ${formatDateForDisplay(new Date(lastSessionDate.getTime() + minDays * 24 * 60 * 60 * 1000))}.`)
                    return
                }

                if (daysDifference > maxDays) {
                    toast.error(`La próxima sesión no puede ser más de ${maxDays} días después de tu última sesión agendada (${formatDateForDisplay(lastSessionDate)}). Por favor, selecciona una fecha antes del ${formatDateForDisplay(new Date(lastSessionDate.getTime() + maxDays * 24 * 60 * 60 * 1000))}.`)
                    return
                }
            }
            try {
                const sessionId = await executeSlotOperation(
                    () => addSession({
                        ...data,
                        planId: planData?._id
                    }, id),
                    {
                        operationType: 'reservar el horario',
                        showToast: toast,
                        onConcurrencyError: handleConcurrencyErrorAndRefresh
                    }
                )

                if (sessionId) {
                    toast.success('¡Sesión pre-agendada exitosamente! Tienes 30 minutos para confirmarla.')
                    reset() // Limpiar el formulario
                }
            } catch (error) {
                console.log(error.message)
                const errorInfo = handleConcurrencyError(error, 'agendar la sesión')

                // Ya se mostró el toast en executeSlotOperation, pero podemos agregar lógica específica
                if (errorInfo.type === 'concurrency') {
                    // Recargar datos después de un error de concurrencia
                    console.warn('Conflicto de concurrencia detectado, considera recargar los slots disponibles')
                }
            }
        }
    }

    // Effects
    // Detectar cuando se limpian campos dependientes
    useEffect(() => {
        const prev = prevFormData.current

        // Si la modalidad cambió y había fecha/hora seleccionadas antes
        if (prev.modality !== formData.modality && (prev.date || prev.hour)) {
            if (!formData.date && !formData.hour) {
                // Los campos se limpian automáticamente, no necesitamos notificación
            }
        }

        // Si la fecha cambió y había hora seleccionada antes
        if (prev.date !== formData.date && prev.hour && !formData.hour) {
            // La hora se limpia automáticamente, no necesitamos notificación
        }

        prevFormData.current = formData
    }, [formData])

    // Cargar datos de sesión cuando se está editando
    useEffect(() => {
        if (currentEditingSessionId) {
            const sessionToEdit = sessions.find(s => s.id === currentEditingSessionId)
            if (sessionToEdit) {
                reset({
                    modality: sessionToEdit.modality,
                    date: sessionToEdit.date,
                    hour: sessionToEdit.hour
                })
            }
        } else {
            // Si no estamos editando, limpiar el formulario
            reset({
                modality: '',
                date: '',
                hour: ''
            })
        }
    }, [currentEditingSessionId, sessions, reset])

    // Efectos para scroll automático cuando aparecen nuevas secciones
    useEffect(() => {
        if (formData.modality && formData.modality !== '') {
            // Delay para permitir que la sección se renderice
            setTimeout(() => {
                scrollToSection(dateRef)
            }, 100)
        }
    }, [formData.modality])

    useEffect(() => {
        if (formData.date && formData.date !== '') {
            setTimeout(() => {
                scrollToSection(hourRef)
            }, 100)
        }
    }, [formData.date])

    useEffect(() => {
        if (formData.hour && formData.hour !== '') {
            setTimeout(() => {
                scrollToSection(submitRef)
            }, 100)
        }
    }, [formData.hour])

    // Efecto para scroll a la pre-agenda cuando se agrega una nueva sesión o se confirma una edición
    useEffect(() => {
        if (sessionsPreAgendaRef.current && (sessions.length > 0 || editCompleted)) {
            scrollToSection(sessionsPreAgendaRef, 'start')

            // Reset del estado de edición completada
            if (editCompleted) {
                setEditCompleted(false)
            }
        }
    }, [sessions.length, editCompleted]) // Detectar tanto nuevas sesiones como ediciones completadas

    return {
        // Form methods
        methods,
        handleSubmit,
        formData,
        onSubmit,

        // State
        currentEditingSessionId,
        sessions,
        showDateSection,
        showHourSection,
        showSubmitButton,
        showConfirmButton,

        // Estados separados para botones en modo edición
        isEditingMode,
        showCancelButton,
        showSaveButton,
        showCreateButton,

        // Handlers
        handleStartEdit,
        handleFinishEdit,
        handleConfirmScheduling,

        // Refs
        modalityRef,
        dateRef,
        hourRef,
        submitRef,
        sessionsPreAgendaRef,

        // Helper functions
        getNextValidDateRange,
        getSessionDates,
        formatDateForDisplay
    }
}
