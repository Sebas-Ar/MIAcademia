import { useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import VocationalOption from './VocationalOption'

const VocationalQuestion = ({
    question = '',
    response = '',
    numberQuestion = 0,
    selecetedQuestion = 0,
    answerQuestion = () => { }
}) => {
    const [isFinishText, setIsFinishText] = useState(false)

    const finishText = () => {
        setIsFinishText(true)
    }

    if (numberQuestion !== selecetedQuestion) return <></>
    return (
        <main className="container" onClick={finishText}>
            <article>
                <h4>
                    {
                        isFinishText
                            ? <span>{question}</span>
                            : <TypeAnimation
                                sequence={[
                                    question,
                                    () => {
                                        setIsFinishText(true)
                                    }
                                ]}
                                wrapper="span"
                                cursor={false}
                                repeat={0}
                                style={{ fontSize: '1.3em', display: 'block' }}
                                speed={120}
                            />
                    }

                </h4>

                <div className="options-list" onClick={finishText}>
                    <VocationalOption
                        numberQuestion={numberQuestion}
                        answerQuestion={answerQuestion}
                        optionText="Sí"
                        response={response}
                        isFinishText={isFinishText}
                    />
                    <VocationalOption
                        numberQuestion={numberQuestion}
                        answerQuestion={answerQuestion}
                        optionText="No"
                        response={response}
                        isFinishText={isFinishText}
                    />
                </div>
            </article>

            <style jsx>{`
                .container {
                    display: grid;
                    place-items: center;
                }

                .options-list {
                    justify-self: center;
                    display: flex;
                    gap: 1em;
                    opacity: ${isFinishText ? '1' : '0'}; 
                    transition: opacity .3s;
                }

                article {
                    display: grid;
                    gap: 1em;
                }

                h4 {
                    text-align: center;
                    max-width: 25em;
                    user-select: none;
                }

                span {
                    font-size: 1.3em;
                }
            `}</style>
        </main>
    )
}

export default VocationalQuestion
