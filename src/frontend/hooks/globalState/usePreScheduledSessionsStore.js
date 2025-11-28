import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const usePreScheduledSessionsStore = create(persist(
    (set, get) => ({
        planName: '',
        planRoute: '',

        sessions: [],
        globalTimeout: null, // Tiempo global que se inicia con la primera sesión
        showTimeoutNotification: false, // Notificación de timeout

        // Estado para recarga manual
        lastManualRefresh: null, // Timestamp de la última recarga manual
        isManualRefreshing: false, // Estado de carga durante la recarga

        // Agregar nueva sesión
        addSession: async (sessionData, userId = '') => {
            console.log('agregando session')
            const currentState = get()
            const hasExistingSessions = currentState.sessions.length > 0

            let globalTimeout

            // Si no hay sesiones, esta será la primera e iniciará el tiempo global y el nombre del plan que se esta agendando
            if (!hasExistingSessions) {
                globalTimeout = new Date(Date.now() + 30 * 60 * 1000).toISOString()
                set({
                    globalTimeout,
                    planName: sessionData.planName,
                    planRoute: sessionData.planRoute
                })
            } else {
                globalTimeout = currentState.globalTimeout
            }

            const newSession = {
                id: sessionData.slotId,
                ...sessionData,
                status: 'pre-booked', // Agregar status inicial
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                // hay un error
                scheduledDateTime: `${sessionData.date}T${convertTo24Hour(sessionData.hour)}:00.000Z`
            }

            // Si se proporciona un slotId, actualizar el slot en la base de datos
            if (sessionData.slotId) {
                try {
                    // Obtener la información actual del slot (incluyendo versión)
                    const getSlotResponse = await fetch(`/api/schedules?id=${sessionData.slotId}`)
                    if (!getSlotResponse.ok) {
                        throw new Error('Error al obtener información del slot')
                    }

                    const { slots } = await getSlotResponse.json()
                    const currentSlot = slots.find(slot => slot._id === sessionData.slotId)

                    if (!currentSlot) {
                        throw new Error('Slot no encontrado')
                    }

                    // Verificar que el slot esté disponible
                    if (currentSlot.status !== 'available') {
                        throw new Error(`El slot ya está reservado (estado: ${currentSlot.status})`)
                    }

                    console.log({ sessionData })
                    const response = await fetch(`/api/schedules/${sessionData.slotId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            planId: sessionData.planId,
                            status: 'pre-booked',
                            pre_booked_at: new Date(),
                            pre_booking_expires_at: globalTimeout,
                            pre_booked_by: userId, // Agregar user_id cuando esté disponible la sesión del usuario
                            __v: currentSlot.__v // Incluir versión para Optimistic Locking
                        })
                    })

                    if (!response.ok) {
                        const errorData = await response.json()

                        // Manejar errores específicos de concurrencia
                        if (response.status === 409) {
                            throw new Error(errorData.message || 'El slot ha sido reservado por otro usuario')
                        }

                        throw new Error(errorData.message || 'Error al pre-agendar el slot')
                    }

                    // Obtener el status actualizado del slot después de la operación
                    const updatedSlotResponse = await response.json()
                    if (updatedSlotResponse && updatedSlotResponse.slot) {
                        newSession.status = updatedSlotResponse.slot.status
                    }
                } catch (error) {
                    console.error('Error updating slot:', error)
                    // Si falla la actualización del slot, no crear la sesión
                    throw error // Propagar el error para que el componente pueda manejarlo
                }
            }

            set((state) => ({
                sessions: [...state.sessions, newSession],
                globalTimeout: globalTimeout,
                showTimeoutNotification: false // Ocultar notificación al crear nueva sesión
            }))

            // Sincronizar con base de datos si hay userId
            if (userId) {
                try {
                    await get().addSessionToDB(
                        sessionData.slotId,
                        userId,
                        globalTimeout,
                        sessionData.planId
                    )
                } catch (error) {
                    console.error('Error syncing session to DB:', error)
                    // No fallar la operación local por errores de BD
                }
            }

            // Disparar recarga automática de slots para mantener datos actualizados
            get().triggerSlotsReload()

            return newSession.id
        },

        // Eliminar sesiones expiradas (usando tiempo global)
        cleanupExpiredSessions: async (userId = '') => {
            const now = new Date()
            const currentState = get()

            // Si hay tiempo global y ha expirado, eliminar todas las sesiones y mostrar notificación
            if (currentState.globalTimeout && new Date(currentState.globalTimeout) < now) {
                const hasExistingSessions = currentState.sessions.length > 0

                console.log('🕐 Timeout expired - cleaning up sessions:', {
                    hasExistingSessions,
                    userId: userId || 'NO_USER_ID',
                    sessionsCount: currentState.sessions.length,
                    expiredAt: currentState.globalTimeout
                })

                if (hasExistingSessions) {
                    // Primero liberar los slots en la BD (solo si hay userId)
                    if (userId) {
                        console.log('🔓 Liberating slots from database...')

                        // Liberar cada slot individualmente para evitar fallos en lote
                        const liberationPromises = currentState.sessions
                            .filter(session => session.slotId)
                            .map(async (session) => {
                                try {
                                    const getCurrentSlotResponse = await fetch(`/api/schedules?id=${session.slotId}`)
                                    if (getCurrentSlotResponse.ok) {
                                        const { slots } = await getCurrentSlotResponse.json()
                                        const currentSlotData = slots.find(slot => slot._id === session.slotId)

                                        if (currentSlotData) {
                                            const response = await fetch(`/api/schedules/${session.slotId}`, {
                                                method: 'PUT',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    planId: null,
                                                    status: 'available',
                                                    pre_booked_by: null,
                                                    pre_booked_at: null,
                                                    pre_booking_expires_at: null,
                                                    __v: currentSlotData.__v
                                                })
                                            })

                                            if (!response.ok) {
                                                const errorData = await response.json()
                                                console.error('❌ Error liberating slot:', session.slotId, errorData.message)
                                            } else {
                                                console.log('✅ Slot liberated:', session.slotId)
                                            }
                                        }
                                    }
                                } catch (error) {
                                    console.error('❌ Error liberating slot:', session.slotId, error)
                                }
                            })

                        // Esperar a que se liberen todos los slots
                        await Promise.allSettled(liberationPromises)

                        // Limpiar también desde la BD del usuario
                        try {
                            await get().clearSessionsFromDB(userId)
                            console.log('🗑️ User sessions cleared from DB')
                        } catch (error) {
                            console.error('❌ Error clearing sessions from DB:', error)
                        }
                    } else {
                        console.warn('⚠️ No userId provided - slots may remain locked in database')
                    }
                }

                // Limpiar estado local
                set(() => ({
                    sessions: [], // Eliminar todas las sesiones expiradas
                    globalTimeout: null, // Resetear el tiempo global
                    showTimeoutNotification: hasExistingSessions // Mostrar notificación si había sesiones
                }))

                console.log('🧹 Local sessions cleaned, notification shown:', hasExistingSessions)

                // Disparar recarga para actualizar slots en la UI
                if (hasExistingSessions) {
                    get().triggerSlotsReload('Cleanup expired sessions - reload slots')
                }

                return true // Indicar que hubo limpieza
            }

            return false // No hubo limpieza
        },

        // Eliminar sesión completamente
        deleteSession: async (sessionId, userId = '') => {
            const currentState = get()
            const sessionToDelete = currentState.sessions.find(session => session.id === sessionId)

            // Si la sesión tiene un slotId, liberar el slot en la base de datos
            if (sessionToDelete?.slotId) {
                try {
                    // Obtener versión actual del slot
                    const getCurrentSlotResponse = await fetch(`/api/schedules?id=${sessionToDelete.slotId}`)
                    if (getCurrentSlotResponse.ok) {
                        const { slots } = await getCurrentSlotResponse.json()
                        const currentSlotData = slots.find(slot => slot._id === sessionToDelete.slotId)

                        if (currentSlotData) {
                            const response = await fetch(`/api/schedules/${sessionToDelete.slotId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    planId: null,
                                    status: 'available',
                                    pre_booked_by: null,
                                    pre_booked_at: null,
                                    pre_booking_expires_at: null,
                                    __v: currentSlotData.__v // Incluir versión para Optimistic Locking
                                })
                            })

                            if (!response.ok) {
                                const errorData = await response.json()
                                console.error('Error liberating slot:', errorData.message)
                                // Continuar con la eliminación local incluso si falla la API
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error liberating slot:', error)
                    // Continuar con la eliminación local incluso si falla la API
                }
            }

            // Sincronizar con base de datos ANTES de eliminar localmente
            if (userId && sessionToDelete?.slotId) {
                try {
                    await get().removeSessionFromDB(sessionToDelete.slotId, userId)
                } catch (error) {
                    console.error('Error syncing session removal to DB:', error)
                    // No fallar la operación local por errores de BD
                }
            }

            set((state) => {
                const updatedSessions = state.sessions.filter(session => session.id !== sessionId)

                // Si no quedan sesiones, resetear el tiempo global y limpiar auto-cleanup
                if (updatedSessions.length === 0) {
                    get().clearAutoCleanup()
                }

                return {
                    sessions: updatedSessions,
                    globalTimeout: updatedSessions.length > 0 ? state.globalTimeout : null
                }
            })

            // Disparar recarga automática para actualizar el estado de los slots
            get().triggerSlotsReload()
        },

        // Actualizar sesión existente
        updateSession: async (sessionId, updatedData, userId = null) => {
            const currentState = get()
            const currentSession = currentState.sessions.find(session => session.id === sessionId)

            if (!currentSession) return

            // Si hay un nuevo slotId y es diferente al actual, manejar el cambio de slot
            if (updatedData.slotId && updatedData.slotId !== currentSession.slotId) {
                try {
                    // Liberar el slot anterior si existe
                    if (currentSession.slotId) {
                        // Obtener versión actual del slot anterior
                        const getCurrentSlotResponse = await fetch(`/api/schedules?id=${currentSession.slotId}`)
                        if (getCurrentSlotResponse.ok) {
                            const { slots } = await getCurrentSlotResponse.json()
                            const currentSlotData = slots.find(slot => slot._id === currentSession.slotId)

                            if (currentSlotData) {
                                await fetch(`/api/schedules/${currentSession.slotId}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        planId: null,
                                        status: 'available',
                                        pre_booked_by: null,
                                        pre_booked_at: null,
                                        pre_booking_expires_at: null,
                                        __v: currentSlotData.__v
                                    })
                                })
                            }
                        }
                    }

                    // Obtener información del nuevo slot (incluyendo versión)
                    const getNewSlotResponse = await fetch(`/api/schedules?id=${updatedData.slotId}`)
                    if (!getNewSlotResponse.ok) {
                        throw new Error('Error al obtener información del nuevo slot')
                    }

                    const { slots } = await getNewSlotResponse.json()
                    const newSlot = slots.find(slot => slot._id === updatedData.slotId)

                    if (!newSlot) {
                        throw new Error('Nuevo slot no encontrado')
                    }

                    // Verificar que el nuevo slot esté disponible
                    if (newSlot.status !== 'available') {
                        throw new Error(`El nuevo slot ya está reservado (estado: ${newSlot.status})`)
                    }

                    // Pre-agendar el nuevo slot
                    const response = await fetch(`/api/schedules/${updatedData.slotId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            planId: updatedData.planId,
                            status: 'pre-booked',
                            pre_booked_at: new Date(),
                            pre_booking_expires_at: new Date(Date.now() + 30 * 60 * 1000),
                            pre_booked_by: userId, // Agregar user_id
                            __v: newSlot.__v // Incluir versión para Optimistic Locking
                        })
                    })

                    if (!response.ok) {
                        const errorData = await response.json()

                        // Manejar errores específicos de concurrencia
                        if (response.status === 409) {
                            throw new Error(errorData.message || 'El slot ha sido reservado por otro usuario')
                        }

                        throw new Error(errorData.message || 'Error al actualizar el slot')
                    }
                } catch (error) {
                    console.error('Error updating slots:', error)
                    // Si falla, no continuar con la actualización
                    throw error // Propagar el error para que el componente pueda manejarlo
                }
            }

            set((state) => {
                const sessionIndex = state.sessions.findIndex(session => session.id === sessionId)
                if (sessionIndex === -1) return state

                const updatedSessions = [...state.sessions]
                updatedSessions[sessionIndex] = {
                    ...updatedSessions[sessionIndex],
                    ...updatedData,
                    status: updatedData.status || updatedSessions[sessionIndex].status, // Mantener status actualizado
                    updatedAt: new Date().toISOString(),
                    scheduledDateTime: `${updatedData.date}T${convertTo24Hour(updatedData.hour)}:00.000Z`
                }

                return {
                    sessions: updatedSessions
                }
            })

            // Disparar recarga automática para mantener slots actualizados
            get().triggerSlotsReload()
        },

        // Limpiar todas las sesiones (para cambio de plan o después de pago exitoso)
        clearAllSessions: async (userId = '', skipSlotLiberation = false) => {
            const currentState = get()

            // Solo liberar slots si no es después de un pago exitoso
            if (!skipSlotLiberation) {
                // Liberar todos los slots asociados con Optimistic Locking
                const promises = currentState.sessions
                    .filter(session => session.slotId)
                    .map(async (session) => {
                        try {
                            // Obtener versión actual del slot
                            const getCurrentSlotResponse = await fetch(`/api/schedules?id=${session.slotId}`)
                            if (getCurrentSlotResponse.ok) {
                                const { slots } = await getCurrentSlotResponse.json()
                                const currentSlotData = slots.find(slot => slot._id === session.slotId)

                                if (currentSlotData) {
                                    const response = await fetch(`/api/schedules/${session.slotId}`, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            planId: null,
                                            status: 'available',
                                            pre_booked_by: null,
                                            pre_booked_at: null,
                                            pre_booking_expires_at: null,
                                            __v: currentSlotData.__v // Incluir versión para Optimistic Locking
                                        })
                                    })

                                    if (!response.ok) {
                                        const errorData = await response.json()
                                        console.error('Error liberating slot:', errorData.message)
                                    }
                                }
                            }
                        } catch (error) {
                            console.error('Error liberating slot:', error)
                        }
                    })

                // Esperar a que se liberen todos los slots (sin bloquear si alguno falla)
                await Promise.allSettled(promises)
            }

            set(() => ({
                sessions: [],
                globalTimeout: null,
                showTimeoutNotification: false
            }))

            // Limpiar auto-cleanup cuando se limpian todas las sesiones
            get().clearAutoCleanup()

            // Solo sincronizar con BD si no es después de pago exitoso (ya fue manejado por el endpoint de confirmación)
            if (userId && !skipSlotLiberation) {
                try {
                    await get().clearSessionsFromDB(userId)
                } catch (error) {
                    console.error('Error syncing session clearing to DB:', error)
                    // No fallar la operación local por errores de BD
                }
            }

            // Disparar recarga automática para actualizar todos los slots
            const reloadReason = skipSlotLiberation
                ? 'Reload after payment success - slots now scheduled'
                : 'Reload after sessions cleared'
            get().triggerSlotsReload(reloadReason)

            // Si fue después de un pago exitoso, esperar un momento y disparar recarga adicional
            // para asegurar que los componentes reflejen el nuevo estado de los slots
            if (skipSlotLiberation) {
                setTimeout(() => {
                    get().triggerSlotsReload('Additional reload after payment - ensure UI sync')
                }, 1000) // Recarga adicional después de 1 segundo

                // Una tercera recarga después de más tiempo para asegurar sincronización completa
                setTimeout(() => {
                    get().triggerSlotsReload('Final reload after payment - complete sync')
                }, 3000) // Recarga final después de 3 segundos
            }
        },

        // Obtener tiempo global restante
        getGlobalTimeRemaining: () => {
            const currentState = get()
            if (!currentState.globalTimeout) return null

            const now = new Date()
            const expires = new Date(currentState.globalTimeout)
            const diff = expires - now

            if (diff <= 0) return 'Expirado'

            const minutes = Math.floor(diff / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            return `${minutes}:${seconds.toString().padStart(2, '0')}`
        },

        // Cerrar notificación de timeout
        dismissTimeoutNotification: () => {
            set((state) => ({
                showTimeoutNotification: false
            }))
        },

        // Recarga manual de estado de slots
        manualRefresh: async () => {
            const currentState = get()
            const now = new Date()

            // Verificar si ha pasado al menos 1 minuto desde la última recarga
            if (currentState.lastManualRefresh) {
                const timeSinceLastRefresh = now - new Date(currentState.lastManualRefresh)
                const oneMinute = 60 * 1000

                if (timeSinceLastRefresh < oneMinute) {
                    const remainingSeconds = Math.ceil((oneMinute - timeSinceLastRefresh) / 1000)
                    throw new Error(`Debes esperar ${remainingSeconds} segundos antes de actualizar nuevamente`)
                }
            }

            // Marcar como en proceso de recarga
            set({ isManualRefreshing: true, lastManualRefresh: now.toISOString() })

            try {
                // En lugar de recargar toda la página, emitir un evento personalizado
                // para que los componentes se actualicen
                window.dispatchEvent(new CustomEvent('manualRefreshRequested', {
                    detail: { timestamp: now.toISOString() }
                }))

                // Simular un pequeño delay para mostrar el estado de carga
                await new Promise(resolve => setTimeout(resolve, 500))

                set({ isManualRefreshing: false })
            } catch (error) {
                console.error('Error durante recarga manual:', error)
                set({ isManualRefreshing: false })
                throw error
            }
        },

        // Verificar si se puede hacer recarga manual
        canManualRefresh: () => {
            const currentState = get()
            const now = new Date()

            if (currentState.isManualRefreshing) {
                return { canRefresh: false, reason: 'Recarga en progreso...' }
            }

            if (currentState.lastManualRefresh) {
                const timeSinceLastRefresh = now - new Date(currentState.lastManualRefresh)
                const oneMinute = 60 * 1000

                if (timeSinceLastRefresh < oneMinute) {
                    const remainingSeconds = Math.ceil((oneMinute - timeSinceLastRefresh) / 1000)
                    return { canRefresh: false, reason: `Espera ${remainingSeconds}s` }
                }
            }

            return { canRefresh: true, reason: null }
        },

        // Helper para disparar reload automático de slots
        triggerSlotsReload: (reason = 'Auto-reload after store action') => {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('manualRefreshRequested', {
                    detail: {
                        timestamp: new Date().toISOString(),
                        reason: reason
                    }
                }))
            }
        },

        // Actualizar status de una sesión específica basándose en datos de BD
        updateSessionStatus: async (sessionId, newStatus) => {
            set((state) => {
                const sessionIndex = state.sessions.findIndex(session => session.id === sessionId)
                if (sessionIndex === -1) return state

                const updatedSessions = [...state.sessions]
                updatedSessions[sessionIndex] = {
                    ...updatedSessions[sessionIndex],
                    status: newStatus,
                    updatedAt: new Date().toISOString()
                }

                return {
                    sessions: updatedSessions
                }
            })
        },

        // Sincronizar status de todas las sesiones con BD
        syncSessionsStatus: async () => {
            const currentState = get()

            for (const session of currentState.sessions) {
                if (session.slotId) {
                    try {
                        const response = await fetch(`/api/schedules?id=${session.slotId}`)
                        if (response.ok) {
                            const { slots } = await response.json()
                            const currentSlot = slots.find(slot => slot._id === session.slotId)

                            if (currentSlot && currentSlot.status !== session.status) {
                                await get().updateSessionStatus(session.id, currentSlot.status)
                            }
                        }
                    } catch (error) {
                        console.error('Error syncing session status:', error)
                        // Continuar con las demás sesiones aunque una falle
                    }
                }
            }
        },

        // ====================================
        // SINCRONIZACIÓN CON BASE DE DATOS
        // ====================================

        // Cargar sesiones desde la base de datos
        loadSessionsFromDB: async (userId) => {
            if (!userId) return

            try {
                const response = await fetch(`/api/user-sessions?userId=${encodeURIComponent(userId)}`)
                if (!response.ok) {
                    throw new Error('Error al cargar sesiones del usuario')
                }

                const data = await response.json()
                const { scheduledSessions } = data

                // Convertir datos de BD a formato del store local
                const sessions = scheduledSessions.sessions?.map(slot => ({
                    id: slot._id,
                    slotId: slot._id,
                    date: slot.date.split('T')[0], // Extraer solo la fecha
                    hour: new Date(slot.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    modality: slot.modality,
                    planName: scheduledSessions.planName,
                    planRoute: scheduledSessions.planRoute,
                    status: slot.status || 'pre-booked', // Incluir status del slot
                    createdAt: slot.createdAt || new Date().toISOString(),
                    updatedAt: slot.updatedAt || new Date().toISOString(),
                    scheduledDateTime: slot.date
                })) || []

                // Actualizar store local con datos de BD
                set({
                    planName: scheduledSessions.planName || '',
                    planRoute: scheduledSessions.planRoute || '',
                    sessions: sessions,
                    globalTimeout: scheduledSessions.globalTimeout,
                    showTimeoutNotification: false
                })

                return sessions
            } catch (error) {
                console.error('Error loading sessions from DB:', error)
                throw error
            }
        },

        // Sincronizar datos locales con la base de datos
        syncWithDB: async (userId) => {
            if (!userId) return

            try {
                const currentState = get()

                const sessionData = {
                    planName: currentState.planName,
                    planRoute: currentState.planRoute,
                    sessions: currentState.sessions,
                    globalTimeout: currentState.globalTimeout,
                    status: 'pre-scheduled' // Estado por defecto
                }

                const response = await fetch('/api/user-sessions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId,
                        sessionData
                    })
                })

                if (!response.ok) {
                    throw new Error('Error al sincronizar con la base de datos')
                }

                const data = await response.json()
                console.log('Sesiones sincronizadas:', data.message)

                return data.scheduledSessions
            } catch (error) {
                console.error('Error syncing with DB:', error)
                throw error
            }
        },

        // Agregar sesión a la base de datos
        addSessionToDB: async (slotId, userId, planName, planRoute, globalTimeout, planId) => {
            if (!userId || !slotId) return

            try {
                const response = await fetch('/api/user-sessions/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId,
                        slotId
                    })
                })

                if (!response.ok) {
                    throw new Error('Error al agregar sesión a la base de datos')
                }

                const data = await response.json()
                console.log('Sesión agregada a BD:', data.message)

                return data.scheduledSessions
            } catch (error) {
                console.error('Error adding session to DB:', error)
                throw error
            }
        },

        // Remover sesión de la base de datos
        removeSessionFromDB: async (slotId, userId) => {
            if (!userId || !slotId) return

            try {
                const response = await fetch('/api/user-sessions/remove', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId,
                        slotId
                    })
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    console.error('Error response:', errorData)
                    throw new Error('Error al remover sesión de la base de datos')
                }

                const data = await response.json()
                console.log('Sesión removida de BD:', data.message)

                return data.scheduledSessions
            } catch (error) {
                console.error('Error removing session from DB:', error)
                throw error
            }
        },

        // Limpiar todas las sesiones de la base de datos
        clearSessionsFromDB: async (userId) => {
            if (!userId) return

            try {
                const response = await fetch('/api/user-sessions', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId
                    })
                })

                if (!response.ok) {
                    throw new Error('Error al limpiar sesiones de la base de datos')
                }

                const data = await response.json()
                console.log('Sesiones limpiadas de BD:', data.message)

                return data.scheduledSessions
            } catch (error) {
                console.error('Error clearing sessions from DB:', error)
                throw error
            }
        },

        // Obtener sesiones por estado (ya no necesario, pero mantenemos por compatibilidad)
        getSessionsByState: () => {
            return get().sessions // Todas las sesiones son pre-agendadas
        },

        // Obtener sesiones activas (todas las sesiones)
        getActiveSessions: () => {
            return get().sessions
        },

        // Obtener próximas sesiones
        getUpcomingSessions: () => {
            const now = new Date()
            return get().sessions
                .filter(session => new Date(session.scheduledDateTime) > now)
                .sort((a, b) => new Date(a.scheduledDateTime) - new Date(b.scheduledDateTime))
        },

        // Verificar conflictos de horario
        checkTimeConflict: (date, hour) => {
            const newDateTime = `${date}T${convertTo24Hour(hour)}:00.000Z`
            return get().sessions.some(session =>
                session.scheduledDateTime === newDateTime
            )
        },

        // Verificar si todas las sesiones están confirmadas (después del pago exitoso)
        areAllSessionsConfirmed: () => {
            const currentState = get()
            if (currentState.sessions.length === 0) return false

            // Verificar si todas las sesiones tienen status 'scheduled'
            return currentState.sessions.every(session => session.status === 'scheduled')
        },

        // Verificar si hay sesiones en proceso de agendamiento (pre-booked)
        hasPreBookedSessions: () => {
            const currentState = get()
            return currentState.sessions.some(session => session.status === 'pre-booked')
        },

        // Configurar limpieza automática con userId
        setupAutoCleanup: (userId) => {
            // Limpiar interval anterior si existe
            if (get().autoCleanupInterval) {
                clearInterval(get().autoCleanupInterval)
            }

            console.log('🔧 Setting up auto-cleanup with userId:', userId)

            // Configurar nuevo interval con userId - ejecutar cada 30 segundos para mayor precisión
            const intervalId = setInterval(async () => {
                const currentState = get()

                // Solo ejecutar si hay sesiones y timeout activo
                if (currentState.sessions.length > 0 && currentState.globalTimeout) {
                    const cleaned = await get().cleanupExpiredSessions(userId)
                    if (cleaned) {
                        console.log('🧹 Auto-cleanup executed successfully')
                        // Una vez limpiado, no necesitamos más timer
                        get().clearAutoCleanup()
                    }
                }
            }, 30000) // 30 segundos para mayor responsividad

            // Guardar el ID del interval para poder limpiarlo después
            set({ autoCleanupInterval: intervalId })

            return intervalId
        },

        // Limpiar auto-cleanup
        clearAutoCleanup: () => {
            const currentState = get()
            if (currentState.autoCleanupInterval) {
                console.log('🛑 Clearing auto-cleanup timer')
                clearInterval(currentState.autoCleanupInterval)
                set({ autoCleanupInterval: null })
            }
        },

        // Función para forzar limpieza (útil para debugging)
        forceCleanup: async (userId) => {
            console.log('🚨 Force cleanup requested by user')
            const result = await get().cleanupExpiredSessions(userId)
            if (!result) {
                // Si no había timeout, limpiar de todos modos
                console.log('🧹 No timeout found, but forcing cleanup anyway')
                set(() => ({
                    sessions: [],
                    globalTimeout: null,
                    showTimeoutNotification: true
                }))
                get().clearAutoCleanup()
                get().triggerSlotsReload('Force cleanup - manual trigger')
            }
            return result
        },

        // ID del interval de auto-limpieza (para poder limpiarlo)
        autoCleanupInterval: null
    }),
    {
        name: 'preScheduledSessionsStorage',
        storage: createJSONStorage(() => localStorage),
        // NO ejecutar cleanup en onRehydrateStorage porque no hay userId disponible
        // El cleanup se manejará en useSessionSync cuando el usuario se autentique
        onRehydrateStorage: () => (state) => {
            // Marcar que se requiere validación de sesiones cuando haya userId
            if (state) {
                console.log('🔄 Store rehydrated from localStorage:', {
                    sessionsCount: state.sessions?.length || 0,
                    hasTimeout: !!state.globalTimeout,
                    timeoutExpired: state.globalTimeout ? new Date(state.globalTimeout) < new Date() : false
                })
                // No ejecutar cleanup aquí - se hará en useSessionSync con userId
            }
        }
    }
))

// Función auxiliar para convertir hora de 12h a 24h
const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ')
    let [hours, minutes] = time.split(':')

    if (hours === '12') {
        hours = '00'
    }

    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12
    }

    return `${String(hours).padStart(2, '0')}:${minutes}`
}

// NOTA: Auto-cleanup movido a useSessionSync para incluir userId
// El timer global se ha eliminado para evitar conflictos
