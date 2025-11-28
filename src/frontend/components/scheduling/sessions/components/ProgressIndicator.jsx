const ProgressIndicator = ({
    hasModality,
    showDateSection,
    hasDate,
    showHourSection,
    hasHour
}) => {
    return (
        <div className="progress-indicator">
            <div className="wrapper-steps">
                <div className={`step ${hasModality ? 'completed' : 'active'}`}>
                    <span className="step-number">1</span>
                    <span className="step-label">Modalidad</span>
                </div>
                <div className="line"></div>
                <div className={`step ${!showDateSection ? 'disabled' : hasDate ? 'completed' : 'active'}`}>
                    <span className="step-number">2</span>
                    <span className="step-label">Fecha</span>
                </div>
                <div className="line"></div>
                <div className={`step ${!showHourSection ? 'disabled' : hasHour ? 'completed' : 'active'}`}>
                    <span className="step-number">3</span>
                    <span className="step-label">Hora</span>
                </div>
            </div>

            <style jsx>{`
                .progress-indicator {
                    margin: auto;
                    display: flex;
                    justify-content: center;
                    padding: 1em 3.5em 2em;
                    background: var(--light-blue);
                    border-radius: 0.5em;
                    margin-top: 1em;
                }

                .wrapper-steps {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr auto 1fr;
                    gap: 1.5em;
                }

                .line {
                    background: var(--yellow);
                    width: 3em;
                    height: .3em;
                    border-radius: 1em;
                    align-self: center;
                }

                .step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5em;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .step-number {
                    width: 2.5em;
                    height: 2.5em;
                    border-radius: 50%;
                    display: grid;
                    place-items: center;
                    font-weight: 600;
                    font-size: 0.9em;
                    transition: all 0.3s ease;
                }

                .step-label {
                    font-size: 0.8em;
                    font-weight: 700;
                    text-align: center;
                    transition: all 0.3s ease;
                    position: absolute;
                    top: calc(100% + 0.2em);
                }

                .step.disabled .step-number {
                    background: var(--dark-gray);
                    color: var(--white, #9ca3af);
                }

                .step.disabled .step-label {
                    color: var(--dark-gray);
                }

                .step.active .step-number {
                    background: var(--dark-blue, #3b82f6);
                    color: white;
                    animation: pulse 2s infinite;
                }

                .step.active .step-label {
                    color: var(--dark-blue, #3b82f6);
                    font-weight: 800;
                }

                .step.completed .step-number {
                    background: var(--yellow);
                    color: var(--blue);
                }

                .step.completed .step-label {
                    color: var(--dark-blue);
                    font-weight: 700;
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }
            `}</style>
        </div>
    )
}

export default ProgressIndicator
