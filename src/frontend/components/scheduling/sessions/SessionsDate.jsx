import { usePreScheduledSessionsStore } from '@/frontend/hooks/globalState/usePreScheduledSessionsStore'
import { AlertTriangle, ArrowBigLeft, ArrowBigRight, Calendar, Check } from 'lucide-react'
import { useState } from 'react'
import SessionsDateOptions from './SessionsDateOptions'

const SessionsDate = ({
    agendaSlots = [],
    dateRestrictions = null,
    existingSessionDates = [],
    formatDateForDisplay = () => {}
}) => {
    const sessions = usePreScheduledSessionsStore((state) => state.sessions)

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [monthLimit] = useState(1) // Customizable limit for months ahead

    const getDaysInMonth = (month, year) => {
        const days = []
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)

        // Add empty elements for days of the previous month
        for (let i = 1; i < firstDay.getDay(); i++) {
            days.push(<></>)
        }

        for (let i = 0; i <= lastDay.getDate() - firstDay.getDate(); i++) {
            const day = new Date(firstDay)
            day.setDate(firstDay.getDate() + i)
            if (day.getDay() !== 0) { // Skip Sundays
                days.push(day)
            }
        }

        return days
    }

    const days = getDaysInMonth(selectedMonth, selectedYear)

    const handleMonthChange = (direction) => {
        if (direction === 'prev') {
            if (selectedMonth === 0) {
                setSelectedMonth(11)
                setSelectedYear(selectedYear - 1)
            } else {
                setSelectedMonth(selectedMonth - 1)
            }
        } else if (direction === 'next') {
            if (selectedMonth === 11) {
                setSelectedMonth(0)
                setSelectedYear(selectedYear + 1)
            } else {
                setSelectedMonth(selectedMonth + 1)
            }
        }
    }

    const isPrevDisabled = () => {
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth()
        const currentYear = currentDate.getFullYear()
        return (
            selectedYear < currentYear ||
            (selectedYear === currentYear && selectedMonth <= currentMonth)
        )
    }

    const isNextDisabled = () => {
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth()
        const currentYear = currentDate.getFullYear()
        const maxDate = new Date(currentYear, currentMonth + monthLimit, 1)
        return (
            selectedYear > maxDate.getFullYear() ||
            (selectedYear === maxDate.getFullYear() && selectedMonth >= maxDate.getMonth())
        )
    }

    return <article>
        {/* Indicador de restricciones de fechas - Aparece cuando ya hay sesiones agendadas */}
        {sessions.length > 0 && dateRestrictions && (
            <div className="date-restrictions-info">
                <div className="info-header">
                    <Calendar size="1.2em" strokeWidth="0.15em" />
                    <span>Restricciones de esta sesión</span>
                </div>
                <div className="info-content">
                    <p>
                        Tu anterior sesión pre-agendada es el <strong className="current-session">{formatDateForDisplay(dateRestrictions.lastSessionDate)}</strong>
                    </p>
                    <p>
                        La próxima sesión debe ser entre el{' '}
                        <strong className="valid-date">{formatDateForDisplay(dateRestrictions.startDate)}</strong>
                        {' '}y el{' '}
                        <strong className="valid-date">{formatDateForDisplay(dateRestrictions.maxDate)}</strong>
                    </p>
                    <div className="restriction-explanation">
                        <span>• Mínimo 2 días de separación entre sesiones</span>
                        <span>• Máximo 1 semana de separación entre sesiones</span>
                    </div>
                </div>
            </div>
        )}

        <div className="calendar-legend">
            <div className="legend-item">
                <div className="legend-color available"></div>
                <span>Disponible</span>
            </div>
            {existingSessionDates.length > 0 && (
                <div className="legend-item">
                    <div className="legend-color occupied">
                        <Check size="100%" strokeWidth=".3em" />
                    </div>
                    <span>Ya agendada</span>
                </div>
            )}
            {dateRestrictions && (
                <div className="legend-item">
                    <div className="legend-color restricted">
                        <AlertTriangle size="100%" strokeWidth=".2em" />
                    </div>
                    <span>Fuera del rango</span>
                </div>
            )}
            <div className="legend-item">
                <div className="legend-color past"></div>
                <span>No disponible</span>
            </div>
        </div>

        <header>
            <button
                type="button"
                onClick={() => handleMonthChange('prev')}
                className={`prev-button ${isPrevDisabled() ? 'disabled' : ''}`}
                disabled={isPrevDisabled()}
            >
                <ArrowBigLeft size="1.7em" strokeWidth=".1em" />
            </button>
            <h4>
                {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h4>
            <button
                type="button"
                onClick={() => handleMonthChange('next')}
                className={`next-button ${isNextDisabled() ? 'disabled' : ''}`}
                disabled={isNextDisabled()}
            >
                <ArrowBigRight size="1.7em" strokeWidth=".1em" />
            </button>
        </header>
        <div className="weekdays">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mié</span>
            <span>Jue</span>
            <span>Vie</span>
            <span>Sáb</span>
        </div>
        <ul>
            {days.map((day, index) => (
                day instanceof Date
                    ? (
                        <SessionsDateOptions
                            agendaSlots={agendaSlots}
                            key={day.toISOString()}
                            date={day.getDate()}
                            month={selectedMonth}
                            year={selectedYear}
                            dateRestrictions={dateRestrictions}
                            existingSessionDates={existingSessionDates}
                        />
                    )
                    : (
                        <li key={`empty-${index}`} /> // Render an empty list item for placeholders
                    )
            ))}
        </ul>

        <style jsx>{`

            .date-restrictions-info {
                background: linear-gradient(135deg, #dbeafe, #bfdbfe);
                border: 1px solid #3b82f6;
                border-radius: 0.75em;
                padding: 1.5em;
                margin-bottom: 1em;
                animation: slideInFocus 0.6s ease-out;
            }

            .info-header {
                display: flex;
                align-items: center;
                gap: 0.5em;
                font-weight: 600;
                color: #1d4ed8;
                margin-bottom: 1em;
                font-size: 1.1em;
            }

            .info-content {
                display: grid;
                gap: 0.5em;
            }

            .info-content p {
                color: #1e40af;
                line-height: 1.5;
            }

            .current-session {
                white-space: nowrap;
                color: var(--blue);
                background: var(--white);
                border: .15em solid var(--blue);
                padding: 0.2em 0.4em;
                border-radius: 0.5em;
                font-weight: 600;
                line-height: 2lh;
            }

            .valid-date {
                line-height: 2lh;
                white-space: nowrap;
                color: var(--blue);
                background: var(--white);
                border: .15em solid var(--blue);
                padding: 0.2em 0.4em;
                border-radius: 0.5em;
                font-weight: 600;
            }

            .restriction-explanation {
                display: grid;
                gap: 0.25em;
                font-size: 0.9em;
                color: #4338ca;
                background: rgba(79, 70, 229, 0.05);
                padding: 0.75em;
                border-radius: 0.5em;
                border-left: 3px solid #6366f1;
            }

            .restriction-explanation span {
                display: flex;
                align-items: center;
                gap: 0.5em;
            }

            article {
                display: grid;
                gap: 1.5em;
            }

            header {
                display: flex;
                gap: 1.5em;
                justify-content: center;
                align-items: center;
            }

            h4 {
                font-size: 1.2em;
                font-weight: 600;
                text-transform: capitalize;
                text-align: center;
                border-bottom: .2em solid var(--yellow);
                border-radius: .2em;
                padding: 0 .5em;
            }

            ul {
                display: grid;
                grid-template-columns: repeat(6, 1fr); /* 6 columns for Monday to Saturday */
                gap: 1em;
            }

            .weekdays {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 1em;
                font-weight: 600;
                text-align: center;
            }
            
            .prev-button,
            .next-button {
                padding: .4em .8em;
                background: var(--blue);
                color: var(--white);
                border: none;
                border-radius: 0.25em;
                cursor: pointer;
                display: grid;
                place-items: center;
                transition: background 0.3s ease, transform 0.3s ease;
            }

            .prev-button:hover,
            .next-button:hover {
                transform: scale(1.05);
            }

            .prev-button.disabled,
            .next-button.disabled {
                transform: unset;
                opacity: 0.5;
                cursor: auto;
            }

            .calendar-legend {
                display: flex;
                flex-wrap: wrap;
                gap: 1em;
                justify-content: center;
                padding: 1em;
                background: #f8fafc;
                border-radius: 0.5em;
                border: 1px solid #e2e8f0;
                margin-top: 0.5em;
            }

            .legend-item {
                display: flex;
                align-items: center;
                gap: 0.5em;
                font-size: 0.85em;
                color: #4b5563;
            }

            .legend-color {
                width: 1.2em;
                height: 1.2em;
                border-radius: 0.25em;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1em;
                font-weight: 600;
                border: 2px solid;
            }

            .legend-color.available {
                border-color: var(--blue);
                background: var(--white);
            }

            .legend-color.occupied {
                width: 1.5em;
                height: 1.5em;
                border: unset;
                color: var(--yellow);
            }

            .legend-color.restricted {
                border: unset;
                color: var(--red);
            }

            .legend-color.past {
                border-color: var(--gray);
                background: #f9fafb;
            }
        `}</style>
    </article>
}

export default SessionsDate
