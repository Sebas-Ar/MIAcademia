'use client'

import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { getTimeAgo } from '@/frontend/utils/time'
import { PauseCircle, PencilRuler, StepForward } from 'lucide-react'
import { useRouter } from 'next/navigation'

const VocatinalInProgressList = ({ testsList = [] }) => {
    const router = useRouter()

    const onClick = (e, { test }) => {
        e.preventDefault()
        triggerEvent(eventCategories.TEST_VOCACIONAL, eventNames.OPEN_TEST_IN_PROGRESS, {
            testID: test._id
        })
        router.push(`/test-vocacional/holland/${test._id}/questionary`)
    }
    return (
        <div className="container">
            <h3>
                <PencilRuler strokeWidth=".15em" size="1.5em" />
                <span>
                    Test en progreso
                </span>
                <PencilRuler strokeWidth=".15em" size="1.5em" style={{ transform: 'rotate(-90deg)' }} />
            </h3>

            <div className="result-list">
                <p className="description">Finaliza el test en progreso para poder iniciar uno nuevo</p>
                {
                    testsList && testsList.length > 0 && testsList.filter(test => !test.completedAt).map((test, index) => (
                        <a
                            key={index}
                            onClick={(e) => onClick(e, { test })}
                            href={`/test-vocacional/holland/${test._id}/questionary`}
                        >
                            <div className="result">
                                <div className="wrapper-time">
                                    <PauseCircle strokeWidth=".15em" size="1.5em" />
                                    <p>
                                            Iniciado {getTimeAgo(test.startedAt.replace('Z', '-05:00'))}
                                    </p>
                                </div>
                                <button>
                                    <StepForward size="2em"/>
                                </button>
                            </div>
                        </a>
                    ))
                }
            </div>

            <style jsx>{`
                .container {
                    background: var(--transparent-dark-blue);
                    padding: 1em;
                    border-radius: .5em;
                }

                h3 {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: .5em;
                    margin-bottom: 1em;
                    color: var(--yellow);
                }

                h3 span {
                    color: var(--white);
                    font-weight: 500;
                    text-transform: uppercase;
                }

                .result-list {
                    display: grid;
                    gap: 1em;
                }

                .result {
                    display: flex;
                    gap: .5em;
                    border: .15em solid var(--yellow);
                    padding: .5em;
                    align-items: center;
                    justify-content: space-between;
                    border-radius: .5em;
                    transition: transform .3s;
                    color: var(--yellow);
                    box-shadow: 0 0 1em .01em transparent;
                    transition: box-shadow .3s;
                }

                .result:hover {
                    box-shadow: 0 0 1em .1em var(--transparent-yellow);
                }

                .wrapper-time {
                    display: flex;
                    gap: .5em;
                    align-items: center;
                }

                button {
                    background-color: var(--yellow);
                    border-radius: .2em;
                    padding: .2em;
                    font-size: .8em;
                    font-weight: 600;
                    display: grid;
                    place-items: center;
                }

                p {
                    color: var(--white);
                    font-weight: 300;
                }

                .description {
                    font-weight: 400;
                    font-size: .85em;
                }

                a {
                    cursor: pointer;
                }
            `}</style>
        </div>
    )
}

export default VocatinalInProgressList
