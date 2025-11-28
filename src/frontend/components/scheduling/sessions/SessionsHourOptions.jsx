import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

const SessionsHourOptions = ({
    slotId = '',
    hour = '',
    status = 'available',
    originalStatus = 'available',
    preBookingExpiresAt = null,
    isExpiredPreBooking = false,
    timeRemainingMinutes = null,
    preBookedBy = null,
    isOwnPreBooking = false,
    isEditingMode = false
}) => {
    const { setValue, watch } = useFormContext()
    const selectedHour = watch('hour')
    const isSelected = selectedHour === hour

    // Estado para el tiempo restante en tiempo real
    const [currentTimeRemaining, setCurrentTimeRemaining] = useState(timeRemainingMinutes)

    // Verificar si es un slot pre-reservado vigente
    const isActivePreBooking = originalStatus === 'pre-booked' && status === 'pre-booked' && currentTimeRemaining !== null && currentTimeRemaining > 0

    // Efecto para actualizar el tiempo restante cada minuto
    useEffect(() => {
        if (originalStatus === 'pre-booked' && preBookingExpiresAt) {
            const updateTimer = () => {
                const now = new Date()
                const expirationDate = new Date(preBookingExpiresAt)
                const timeDiff = expirationDate - now
                const minutesRemaining = Math.ceil(timeDiff / (1000 * 60))

                if (minutesRemaining <= 0) {
                    setCurrentTimeRemaining(0)
                    // Forzar actualización del componente padre después de la expiración
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                } else {
                    setCurrentTimeRemaining(minutesRemaining)
                }
            }

            // Actualizar inmediatamente
            updateTimer()

            // Configurar intervalo para actualizar cada 30 segundos
            const interval = setInterval(updateTimer, 30000)

            return () => clearInterval(interval)
        }
    }, [originalStatus, preBookingExpiresAt])

    const handleClick = () => {
        // Permitir selección si:
        // 1. El slot está disponible, O
        // 2. Es modo edición y es la propia pre-reserva del usuario
        if (status === 'available' || (isEditingMode && isOwnPreBooking)) {
            setValue('hour', hour)
            setValue('slotId', slotId)
        }
    }

    // Determinar el texto del tooltip
    const getTooltipText = () => {
        if (isActivePreBooking) {
            if (isOwnPreBooking && isEditingMode) {
                const timeText = currentTimeRemaining === 1 ? 'minuto' : 'minutos'
                return `Tu sesión pre-reservada. Se liberará en ${currentTimeRemaining} ${timeText} si no la confirmas`
            } else {
                const userInfo = preBookedBy?.name ? ` por ${preBookedBy.name}` : ''
                const timeText = currentTimeRemaining === 1 ? 'minuto' : 'minutos'
                return `Pre-reservado${userInfo}. Se liberará en ${currentTimeRemaining} ${timeText}`
            }
        }
        if (status !== 'available') {
            if (status === 'scheduled') {
                return 'Horario confirmado y ocupado'
            }
            return `No disponible (${status.replace('-', ' ')})`
        }
        if (isExpiredPreBooking) {
            return 'Disponible (pre-reserva expirada)'
        }
        return 'Horario disponible'
    }

    // Determinar el texto del indicador para pre-reservas activas
    const getIndicatorText = () => {
        if (isActivePreBooking) {
            return `⏱ ${currentTimeRemaining}min`
        }
        if (isExpiredPreBooking) {
            return '*'
        }
        return ''
    }

    return <li className="option-item">
        <button
            className={`btn-option ${isSelected ? 'selected' : ''} ${status} ${isExpiredPreBooking ? 'expired-prebooking' : ''} ${isActivePreBooking ? 'active-prebooking' : ''} ${isOwnPreBooking && isEditingMode ? 'own-prebooking' : ''}`}
            type="button"
            disabled={status !== 'available' && !(isEditingMode && isOwnPreBooking)}
            onClick={handleClick}
            title={getTooltipText()}
        >
            <span className="hour-text">{hour}</span>
            {getIndicatorText() && (
                <span className={`indicator ${isActivePreBooking ? 'time-indicator' : 'expired-indicator'}`}>
                    {getIndicatorText()}
                </span>
            )}
        </button>
        <style jsx>{`
            .option-item {
                list-style: none;
            }

            .btn-option {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                padding: 1em 1.5em;
                border: .2em solid var(--blue);
                border-radius: .5em;
                background: var(--white);
                transition: background .2s ease, border-color .2s ease;

                &:not(:disabled):hover {
                    border-color: var(--dark-yellow);
                    background: var(--transparent-yellow);
                }
            }

            .btn-option.selected {
                border-color: var(--dark-yellow);
                background: var(--transparent-yellow);
            }
            
            .btn-option.pre-booked {
                border-color: var(--color-red-300);
                color: var(--color-red-300);
                background: var(--color-red-50, #fef2f2);
            }

            .btn-option.active-prebooking {
                border-color: var(--color-orange-400, #fb923c);
                color: var(--color-orange-700, #c2410c);
                background: var(--color-orange-50, #fff7ed);
                cursor: not-allowed;
                position: relative;
            }

            /* Estilo especial para la propia pre-reserva del usuario en modo edición */
            .btn-option.own-prebooking {
                border-color: var(--color-blue-400, #60a5fa);
                color: var(--color-blue-700, #1d4ed8);
                background: var(--color-blue-50, #eff6ff);
                cursor: pointer !important;
                position: relative;
            }

            .btn-option.own-prebooking::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, transparent 30%, var(--color-blue-200, #bfdbfe) 30%, var(--color-blue-200, #bfdbfe) 40%, transparent 40%);
                border-radius: inherit;
                opacity: 0.3;
            }

            .btn-option.own-prebooking:hover {
                border-color: var(--color-blue-500, #3b82f6);
                background: var(--color-blue-100, #dbeafe);
            }

            .btn-option.active-prebooking::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, transparent 30%, var(--color-orange-200, #fed7aa) 30%, var(--color-orange-200, #fed7aa) 40%, transparent 40%);
                border-radius: inherit;
                opacity: 0.3;
            }

            .btn-option.scheduled {
                color: var(--gray);
                background: var(--color-gray-100, #f3f4f6);
            }

            .btn-option.expired-prebooking {
                border-color: var(--dark-yellow);
                background: linear-gradient(135deg, var(--transparent-yellow) 50%, var(--white) 50%);
                position: relative;
            }

            .hour-text {
                font-weight: 500;
            }

            .indicator {
                font-size: 0.75em;
                font-weight: bold;
                margin-left: 4px;
            }

            .time-indicator {
                color: var(--color-orange-600, #ea580c);
                background: var(--color-orange-100, #ffedd5);
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 0.7em;
                white-space: nowrap;
                animation: pulse-subtle 3s ease-in-out infinite;
            }

            @keyframes pulse-subtle {
                0%, 100% {
                    opacity: 1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.8;
                    transform: scale(0.98);
                }
            }

            .expired-indicator {
                color: var(--dark-yellow);
                font-size: 0.8em;
                vertical-align: super;
            }

            .btn-option.expired-prebooking:hover {
                background: var(--transparent-yellow);
            }

        `}</style>
    </li>
}

export default SessionsHourOptions
