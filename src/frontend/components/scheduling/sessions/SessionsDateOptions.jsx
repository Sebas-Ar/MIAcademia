import { AlertTriangle, Check } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

const SessionsDateOptions = ({
    agendaSlots = [],
    date = '',
    month = new Date().getMonth(),
    year = new Date().getFullYear(),
    dateRestrictions = null,
    existingSessionDates = []
}) => {
    const { setValue, watch } = useFormContext()
    const selectedDate = watch('date')
    const selectedModality = watch('modality')
    const today = new Date()
    const currentDate = new Date(year, month, date)

    const isPastOrToday = date &&
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() >= date

    // Verificar si la fecha está en el rango válido según las restricciones
    const isInValidRange = () => {
        if (!dateRestrictions) return true

        const { minDate, maxDate } = dateRestrictions
        return currentDate > minDate && currentDate <= maxDate
    }

    // Verificar si ya existe una sesión en esta fecha
    const hasExistingSession = () => {
        return existingSessionDates.some(sessionDate => {
            const session = new Date(sessionDate)
            return session.getFullYear() === year &&
                   session.getMonth() === month &&
                   session.getDate() === date
        })
    }

    const isExistSlot = agendaSlots?.slots?.some(slot => {
        if (slot.modality !== selectedModality) return false

        const slotDate = new Date(slot.date)

        return slotDate.getFullYear() === year &&
               slotDate.getMonth() === month &&
               slotDate.getDate() === date
    })

    // Determinar el estado de la fecha
    const getDateStatus = () => {
        if (isPastOrToday) return 'past'
        if (hasExistingSession()) return 'occupied'
        if (dateRestrictions && !isInValidRange()) return 'restricted'
        if (isExistSlot) return 'available'
        return 'past'
    }

    const dateStatus = getDateStatus()
    const isDateDisabled = dateStatus === 'past' || dateStatus === 'restricted' || dateStatus === 'occupied' || dateStatus === 'disabled'

    const dateValue = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    const isSelected = selectedDate === dateValue

    const handleClick = () => {
        if (!isDateDisabled) {
            setValue('date', dateValue)
        }
    }

    // Obtener el título descriptivo para el tooltip
    const getTooltipTitle = () => {
        switch (dateStatus) {
            case 'past':
                return 'Fecha pasada - No disponible'
            case 'occupied':
                return 'Ya tienes una sesión agendada este día'
            case 'restricted':
                if (dateRestrictions) {
                    const { minDate, maxDate } = dateRestrictions
                    if (currentDate <= minDate) {
                        return `Muy pronto - La próxima sesión debe ser después del ${minDate.toLocaleDateString('es-ES')}`
                    }
                    if (currentDate > maxDate) {
                        return `Muy tarde - La próxima sesión debe ser antes del ${maxDate.toLocaleDateString('es-ES')}`
                    }
                }
                return 'Fecha no válida según las restricciones'
            case 'available':
                return 'Fecha disponible'
            default:
                return ''
        }
    }

    return <li className="option-item">
        <button
            className={`btn-option ${isSelected ? 'selected' : ''} ${dateStatus}`}
            type="button"
            disabled={isDateDisabled}
            onClick={handleClick}
            title={getTooltipTitle()}
        >
            <span className="date-number">{date}</span>
            {dateStatus === 'occupied' &&
                <span className="indicator">
                    <Check size=".9em" strokeWidth=".2em" />
                </span>}
            {dateStatus === 'restricted' &&
                <span className="indicator">
                    <AlertTriangle size=".9em" strokeWidth=".2em" />
                </span>}
        </button>
        <style jsx>{`
            .option-item {
                
            }

            .btn-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                padding: 0.75em 0.5em;
                border: 0.2em solid var(--blue);
                border-radius: 0.5em;
                background: var(--white);
                transition: all 0.2s ease;
                position: relative;
                min-height: 3em;
                cursor: pointer;
            }

            .btn-option:not(:disabled):hover {
                border-color: var(--dark-yellow);
                background: var(--transparent-yellow);
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .btn-option:disabled {
                cursor: auto;
            }

            .btn-option.selected {
                border-color: var(--dark-yellow);
                background: var(--transparent-yellow);
                box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
            }

            /* Estados específicos */
            .btn-option.past {
                border-color: var(--gray);
                background: #f9fafb;
                color: #6b7280;
            }

            .btn-option.occupied {
                border-color: var(--yellow);
                background: var(--transparent-yellow);
                color: var(--dark-blue);
            }

            .btn-option.restricted {
                border-color: #ef4444;
                background: #fef2f2;
                color: #dc2626;
                opacity: .6;
            }

            .btn-option.available {
                border-color: var(--blue);
                background: var(--white);
            }

            .btn-option.available:hover {
                border-color: var(--yellow);
                background: var(--transparent-yellow);
                color: var(--dark-blue);
            }

            .date-number {
                font-weight: 600;
                font-size: 1em;
            }

            .indicator {
                position: absolute;
                display: grid;
                place-items: center;
                right: 0.2em;
                top: 0.2em;
            }

        `}</style>
    </li>
}

export default SessionsDateOptions
