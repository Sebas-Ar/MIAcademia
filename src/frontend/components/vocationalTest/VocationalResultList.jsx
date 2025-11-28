'use client'

import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { getTimeAgo } from '@/frontend/utils/time'
import { BookOpenCheck, FileSymlink, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

const VocatinalResultList = ({ testsList = [] }) => {
    const router = useRouter()

    const onClick = (e, { test }) => {
        e.preventDefault()
        triggerEvent(eventCategories.TEST_VOCACIONAL, eventNames.OPEN_RESULT, {
            testID: test._id
        })
        router.push(`/test-vocacional/holland/${test._id}/result`)
    }

    return (
        <div className="container">
            <h3>
                <Save strokeWidth=".15em" size="1.5em" />
                <span>
                    Resultados guardados
                </span>
                <Save strokeWidth=".15em" size="1.5em" style={{ transform: 'rotate(-180deg)' }} />
            </h3>

            <div className="result-list">
                {
                    testsList && testsList.length > 0 && testsList.filter(test => test.completedAt).map((test, index) => (
                        <a
                            key={test._id}
                            onClick={(e) => onClick(e, { test })}
                            href={`/test-vocacional/holland/${test._id}/result`}
                        >
                            <div className="result">
                                <div className="wrapper-time">
                                    <BookOpenCheck strokeWidth=".15em" size="1.5em" />
                                    <p>
                                        {getTimeAgo(test.completedAt.replace('Z', '-05:00'))}
                                    </p>
                                </div>
                                <button>
                                    <FileSymlink size="2em" />
                                </button>
                            </div>
                        </a>
                    )).reverse()
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

                .first-icon {
                    display: grid;
                    place-items: center;
                }

                .second-icon {
                    display: none;
                }

                .result:hover .first-icon {
                    display: none;
                }

                .result:hover .second-icon {
                    display: grid;
                    place-items: center;
                }

                p {
                    color: var(--white);
                    font-weight: 300;
                    text-transform: capitalize;
                }

                a {
                    cursor: pointer;
                }
            `}</style>
        </div>
    )
}

export default VocatinalResultList
