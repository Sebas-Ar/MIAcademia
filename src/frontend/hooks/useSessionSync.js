import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { usePreScheduledSessionsStore } from './globalState/usePreScheduledSessionsStore'

/**
 * Hook para sincronizar automáticamente las sesiones del usuario
 * entre localStorage y la base de datos MongoDB
 */
export const useSessionSync = () => {
    const { data: session, status } = useSession()
    const {
        loadSessionsFromDB,
        syncWithDB,
        setupAutoCleanup,
        clearAutoCleanup,
        syncSessionsStatus,
        cleanupExpiredSessions,
        sessions,
        planName,
        planRoute,
        globalTimeout
    } = usePreScheduledSessionsStore()

    // Cargar sesiones desde BD cuando el usuario se autentica
    useEffect(() => {
        const loadUserSessions = async () => {
            if (status === 'authenticated' && session?.user?.id) {
                try {
                    console.log('🔄 Loading user sessions from DB...')
                    await loadSessionsFromDB(session.user.id)

                    // Ejecutar cleanup inmediatamente después de cargar para validar si las sesiones expiraron
                    console.log('🧹 Checking for expired sessions after DB load...')
                    const wasCleanedUp = await cleanupExpiredSessions(session.user.id)

                    if (wasCleanedUp) {
                        console.log('✅ Expired sessions were cleaned up')
                    } else {
                        console.log('✅ No expired sessions found')
                    }

                    // Configurar auto-cleanup con userId una vez autenticado
                    setupAutoCleanup(session.user.id)
                } catch (error) {
                    console.error('❌ Error loading sessions from DB:', error)
                    // Si falla cargar desde BD, mantener datos locales
                }
            }
        }

        loadUserSessions()
    }, [status, session?.user?.id, loadSessionsFromDB, setupAutoCleanup, cleanupExpiredSessions])

    // Limpiar auto-cleanup cuando el usuario se desautentica
    useEffect(() => {
        if (status === 'unauthenticated') {
            clearAutoCleanup()
        }
    }, [status, clearAutoCleanup])

    // Sincronizar cambios locales con BD automáticamente
    useEffect(() => {
        const syncChanges = async () => {
            if (status === 'authenticated' && session?.user?.id) {
                // Solo sincronizar si hay datos para sincronizar
                if (sessions.length > 0 || planName || planRoute || globalTimeout) {
                    try {
                        console.log('Syncing local changes to DB...')
                        await syncWithDB(session.user.id)
                    } catch (error) {
                        console.error('Error syncing changes to DB:', error)
                        // No interrumpir la experiencia del usuario por errores de sincronización
                    }
                }
            }
        }

        // Debounce la sincronización para evitar llamadas excesivas
        const timeoutId = setTimeout(syncChanges, 2000)

        return () => clearTimeout(timeoutId)
    }, [sessions, planName, planRoute, globalTimeout, status, session?.user?.id, syncWithDB])

    // Sincronizar status de sesiones cada 2 minutos para mantener datos actualizados
    useEffect(() => {
        const syncStatus = async () => {
            if (status === 'authenticated' && sessions.length > 0) {
                try {
                    await syncSessionsStatus()
                } catch (error) {
                    console.error('Error syncing sessions status:', error)
                }
            }
        }

        // Sincronización periódica cada 2 minutos
        const intervalId = setInterval(syncStatus, 2 * 60 * 1000)

        return () => clearInterval(intervalId)
    }, [status, sessions.length, syncSessionsStatus])

    return {
        isAuthenticated: status === 'authenticated',
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        isLoading: status === 'loading'
    }
}

export default useSessionSync
