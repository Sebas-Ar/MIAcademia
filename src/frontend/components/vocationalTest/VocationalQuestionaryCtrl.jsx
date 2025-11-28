import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { Redo2, Undo2 } from 'lucide-react'

const VocationalQuestionaryCtrl = ({
    questionsList = [],
    selectedQuestion = 0,
    setSelectedQuestion = () => { },
    finishTest = () => { }
}) => {
    const nextQuestion = () => {
        triggerEvent(eventCategories.TEST_VOCACIONAL, eventNames.PASS_TO_NEXT_QUESTION)
        setSelectedQuestion(current => {
            if (current < questionsList.length - 1) return current + 1
            return current
        })
    }

    const previousQuestion = () => {
        triggerEvent(eventCategories.TEST_VOCACIONAL, eventNames.BACK_TO_PREVIOUS_QUESTION)
        setSelectedQuestion(current => {
            if (current > 0) return current - 1
            return current
        })
    }

    const disableNextQuestion = () => {
        if (selectedQuestion === questionsList.length - 1) return true
        if (!questionsList[selectedQuestion + 1]?.value) {
            if (questionsList[selectedQuestion]?.value) {
                return false
            }
            return true
        }
        return false
    }

    const disablePreviousQuestion = () => {
        return selectedQuestion === 0
    }

    return (
        <div className="container">

            <button onClick={previousQuestion} disabled={disablePreviousQuestion()}>
                <span>Pregunta Anterior</span>
                <Undo2 size="2.5em" strokeWidth={1.25} />
            </button>

            {questionsList.length > 0 && !questionsList.some(question => question.value === null) &&
            <button onClick={finishTest} className="btn-finish">Finalizar Test</button>}

            <button onClick={nextQuestion} disabled={disableNextQuestion()}>
                <span>Siguiente Pregunta</span>
                <Redo2 size="2.5em" strokeWidth={1.25} />
            </button>

            <style jsx>{`
                .container {
                    display: flex;
                    justify-content: space-between;
                    margin: 0 1em 2em;
                }

                button {
                    position: relative;
                    color: var(--white);
                    display: block;
                    border: .15em solid var(--light-gray);
                    display: grid;
                    padding: .5em;
                    place-items: center;
                    border-radius: 50%;
                    background: var(--transparent-white);
                    transition: transform .3s;
                }

                button:hover {
                    transform: scale(1.1);
                }

                button:disabled {
                    opacity: 0;
                    cursor: auto;
                }

                button:disabled:hover {
                    transform: none;
                }

                .btn-finish {
                    background-color: var(--yellow);
                    color: var(--dark-blue);
                    border: .15em solid var(--yellow);
                    border-radius: .5em;
                    padding: 1em 1em;
                    font-weight: 600;
                    animation: scale .5s infinite alternate;
                }

                @keyframes scale {
                    0% {
                        transform: scale(1);
                    }

                    100% {
                        transform: scale(1.1);
                    }
                }

                button span {
                    position: absolute;
                    top: 100%;
                    text-align: center;
                    font-size: .7em;
                    padding-top: 1em;
                    display: block;
                    white-space: nowrap;
                    user-select: none;
                }
                
            `}</style>
        </div>
    )
}

export default VocationalQuestionaryCtrl
