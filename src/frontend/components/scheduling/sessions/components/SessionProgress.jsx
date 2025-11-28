const SessionProgress = ({
    sessionsCount,
    totalSessions,
    sessions = [], // Array de sesiones para analizar estados
    allSessionsConfirmed = false // Indicador si todas están confirmadas
}) => {
    // Lógica para calcular progreso según el estado de las sesiones
    const getProgressData = () => {
        if (allSessionsConfirmed) {
            // Si están confirmadas, contar las completadas
            const completedSessions = sessions.filter(session => session.status === 'completed').length
            return {
                current: completedSessions,
                total: sessionsCount, // Total de sesiones confirmadas
                label: 'Sesiones completadas',
                percentage: (completedSessions / sessionsCount) * 100
            }
        } else {
            // Si no están confirmadas, usar lógica original (agendadas vs total del plan)
            return {
                current: sessionsCount,
                total: totalSessions,
                label: 'Sesiones agendadas',
                percentage: (sessionsCount / totalSessions) * 100
            }
        }
    }

    const progressData = getProgressData()
    const { current, total, label, percentage } = progressData

    return (
        <div className="progress-wrapper">
            <header>
                <h3>{label}</h3>
                <span>
                    {current}/{total}
                </span>
            </header>
            <div className="progress-bar"></div>

            <style jsx>{`
                .progress-wrapper {
                    padding: 1em 1em 0;
                    border-radius: .5em;
                    margin: 0em 0;
                }

                header {
                    padding: 0 .5em;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1em;
                    font-weight: 600;
                }

                header h3,
                header span {
                    font-size: 1.3em;
                }

                span {
                    letter-spacing: .2em;
                }

                .progress-bar {
                    height: .6em;
                    background: var(--gray);
                    width: 100%;
                    border-radius: 5px;
                    position: relative;
                }

                .progress-bar::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: ${percentage}%;
                    background: var(--blue);
                    border-radius: 5px;
                }
            `}</style>
        </div>
    )
}

export default SessionProgress
