import { Calendar, Clock } from 'lucide-react'

const PlanTime = ({
    sessionsNumber = 0,
    sessionTime = 0,
    sessionTimeUnit = 'min',
    transparentBackground = 'var(--transparent-yellow)',
    textColor = 'var(--dark-blue)'
}) => {
    return <div className="plan-time-wrapper">
        <div className="sessions">
            <div className="wrapper-icon calendar-icon">
                <Calendar size="1.5em" strokeWidth=".14em" />
            </div>
            <span className="number-sessions">{sessionsNumber}</span>
            <span>Sesiones</span>
        </div>
        <div className="time">
            <div className="wrapper-icon">
                <Clock size="1.3em" strokeWidth=".16em" />
            </div>
            <span>{sessionTime} {sessionTimeUnit}</span>
        </div>

        <style jsx>{`
            .plan-time-wrapper {
                color: ${textColor};
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: ${transparentBackground};
                padding: 1em 1.5em;
                border-radius: .5em;
            }

            .wrapper-icon {
                display: grid;
                place-items: center;
            }

            .calendar-icon {
                transform: translateY(-.08em);
            }

            .sessions, .time {
                display: flex;
                align-items: center;
                gap: .5em;
            }

            .number-sessions {
                font-size: 1.5em;
                font-weight: 700;
            }

        `}</style>
    </div>
}

export default PlanTime
