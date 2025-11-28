import { BookOpenCheck, LogOut } from 'lucide-react'

const VocationalHeader = ({
    selectedQuestion = 0,
    questionsList = [],
    enableExitModal = () => {}
}) => {
    return (
        <header>

            <div className="progress-bar"></div>
            <div className="container">
                <div className="title-wrapper">
                    <BookOpenCheck size="2em" strokeWidth={1.25} />
                    <h3>Test de Holland</h3>
                </div>
                <p className="question-count">
                    Pregunta <span>{selectedQuestion + 1}</span> de <span>{questionsList.length}</span>
                </p>

                <button onClick={enableExitModal} className="exit-btn-wrapper">
                    <div className="exit-btn">
                        <div className="wrapper-icon">
                            <LogOut size="1.2em" strokeWidth={2.5} />
                        </div>
                        <span>Salir</span>
                    </div>
                </button>
            </div>

            <style jsx>{`
                header {
                    position: relative;
                    z-index: 11111111;
                }

                .container {
                    display: flex;
                    justify-content: space-between;
                    padding: 1em;
                    align-items: center;
                }

                .title-wrapper {
                    display: flex;
                    gap: .5em;
                    align-items: center;
                }

                .question-count {
                    font-weight: 200;
                    justify-self: center;
                }

                .question-count span {
                    font-weight: 600;
                }

                .exit-btn-wrapper {
                    position: fixed;
                    top: 1.2em;
                    left: .5em;
                }

                .exit-btn {
                    background: var(--transparent-white);
                    border-radius: .5em;
                    color: var(--white);
                    border: .1em solid var(--white);
                    font-weight: 500;
                    padding: .3em .7em;
                    display: flex;
                    align-items: center;
                    gap: .5em;
                    transition: transform .3s;
                }

                .exit-btn:hover {
                    transform: scale(1.05);
                }

                .wrapper-icon {
                    display: grid;
                    place-items: center;
                    transform: rotate(180deg);
                }

                .progress-bar {
                    margin-top: .3em;
                    position: relative;
                    background: var(--dark-gray);
                    height: .3em;
                    border-radius: 1em;
                }

                .progress-bar::after {
                    content: "";
                    position: absolute;
                    width: ${(selectedQuestion + 1) / (questionsList.length) * 100}%;
                    height: 100%;
                    background: var(--yellow);
                    animation: progress-bar 1s linear infinite;
                    animation-play-state: paused;
                    border-radius: 1em;
                    transition: width .3s;
                }
                
            `}</style>
        </header>
    )
}

export default VocationalHeader
