import { usePreScheduledSessionsStore } from '@/frontend/hooks/globalState/usePreScheduledSessionsStore'
import { RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const ManualRefreshButton = ({
    isRefreshing: externalRefreshing = false,
    compact = false
}) => {
    const { manualRefresh, canManualRefresh, isManualRefreshing } = usePreScheduledSessionsStore()
    const [refreshState, setRefreshState] = useState({ canRefresh: true, reason: null })

    // Combinar estados de recarga interno y externo
    const isRefreshing = isManualRefreshing || externalRefreshing

    // Actualizar el estado del botón cada segundo para mostrar countdown
    useEffect(() => {
        const updateRefreshState = () => {
            setRefreshState(canManualRefresh())
        }

        // Actualizar inmediatamente
        updateRefreshState()

        // Actualizar cada segundo para el countdown
        const interval = setInterval(updateRefreshState, 1000)

        return () => clearInterval(interval)
    }, [canManualRefresh])

    const handleRefresh = async () => {
        try {
            await manualRefresh()
            toast.success('Estado actualizado correctamente')
        } catch (error) {
            toast.error(error.message || 'Error al actualizar')
        }
    }

    return (
        <button
            onClick={handleRefresh}
            disabled={!refreshState.canRefresh || isRefreshing}
            className={`manual-refresh-btn ${!refreshState.canRefresh || isRefreshing ? 'disabled' : ''} ${compact ? 'compact' : ''}`}
            title={refreshState.reason || 'Actualizar estado de sesiones reservadas por otros usuarios'}
        >
            <RefreshCw
                size={16}
                className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`}
            />
            <span className="btn-text">
                {isRefreshing
                    ? 'Actualizando...'
                    : refreshState.reason || 'Actualizar'
                }
            </span>

            <style jsx>{`
                .manual-refresh-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 12px;
                    border: 1px solid var(--color-blue-500, #3b82f6);
                    border-radius: 6px;
                    background: var(--white);
                    color: var(--color-blue-600, #2563eb);
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    min-width: 120px;
                    justify-content: center;
                }

                .manual-refresh-btn.compact {
                    padding: 6px 10px;
                    min-width: 100px;
                    font-size: 0.8rem;
                    gap: 4px;
                }

                .manual-refresh-btn:hover:not(.disabled) {
                    background: var(--color-blue-50, #eff6ff);
                    border-color: var(--color-blue-600, #2563eb);
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
                }

                .manual-refresh-btn:active:not(.disabled) {
                    transform: translateY(0);
                    box-shadow: none;
                }

                .manual-refresh-btn.disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    background: var(--color-gray-50, #f9fafb);
                    border-color: var(--color-gray-300, #d1d5db);
                    color: var(--color-gray-500, #6b7280);
                }

                .refresh-icon {
                    transition: transform 0.2s ease;
                }

                .refresh-icon.spinning {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                .btn-text {
                    white-space: nowrap;
                }

                /* Responsivo para pantallas pequeñas */
                @media (max-width: 768px) {
                    .manual-refresh-btn {
                        min-width: 100px;
                        padding: 6px 10px;
                        font-size: 0.8rem;
                    }
                }
            `}</style>
        </button>
    )
}

export default ManualRefreshButton
