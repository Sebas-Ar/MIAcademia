'use client'
import currency from 'currency.js'
import { ChevronDown, User } from 'lucide-react'
import { useState } from 'react'
import SchedulingPlanOptions from './SchedulingPlanOptions'

const SchedulingPlan = ({
    planData = null
}) => {
    const [showPlans, setShowPlans] = useState(false)

    const enablePlanOptions = () => {
        setShowPlans(true)
    }

    const disablePlanOptions = () => {
        setShowPlans(false)
    }

    return (
        <section>
            <article className="plan-selected" onMouseLeave={disablePlanOptions}>
                <header>
                    <span className="plan-label">Plan</span>
                    <button className="btn-select-plan" onClick={enablePlanOptions} onMouseEnter={enablePlanOptions}>
                        <ChevronDown size="1.5em" strokeWidth=".2em" />
                    </button>
                </header>
                <div className="plan-wrapper">
                    <h2 className="plan-title">
                        {planData?.title}
                    </h2>
                    <div className="info">
                        <span className="plan-price">
                            {currency(planData?.price, { precision: 0, separator: '.' }).format()} COP
                        </span>
                        <p className="plan-sessions">
                            <span className="wrapper-icon">
                                <User size="1.2em" strokeWidth=".17em" />
                            </span>
                            <span>
                                {planData?.sessionsNumber} sesiones
                            </span>
                        </p>
                    </div>
                </div>
                <p className="max-w-2xs text-center justify-self-center text-gray-900">
                    Tu éxito empieza aquí
                </p>
                <SchedulingPlanOptions showPlans={showPlans} />
            </article>

            <style jsx>{`
                section {
                    margin: 0em;
                    padding: 1em 2em 2em;
                    display: grid;
                    gap: 1.5em;
                }

                .plan-wrapper {
                    display: grid;
                    gap: 1em;
                    background: var(--white);
                    padding: 1.5em 2.5em;
                    border-radius: 1.5em 0 1.5em 0;
                    margin-bottom: .3em;
                }

                .plan-selected {
                    margin: auto;
                    background: var(--yellow);
                    padding: 1em 1.5em 1em;
                    border-radius: 0 1.5em 0 1.5em;
                    display: grid;
                    gap: .5em;
                    position: relative;

                    header {
                        display: flex;
                        justify-content: space-between;
                        padding: 0 1em;
                    }

                    .btn-select-plan {
                        display: grid;
                        place-items: center;
                        position: relative;
                        width: 1.8em;
                    }

                    .plan-label {
                        text-transform: capitalize;
                        font-size: 1.5em;
                        font-weight: 400;
                    }

                    .plan-title {
                        text-align: center;
                        text-transform: capitalize;
                        font-weight: 600;
                        font-size: 1.5em;
                    }

                    .info {
                        display: flex;
                        justify-content: space-between;
                        gap: 1.5em;
                    }

                    .plan-price {
                        font-weight: 500;
                        font-size: 1.3em;
                    }

                    .plan-sessions {
                        font-weight: 500;
                        font-size: 1.1em;
                        display: flex;
                        align-items: center;
                        gap: .3em;
                    }

                    .wrapper-icon {
                        display: grid;
                        place-items: center;
                    }
                }

                .plans-list {
                    margin-top: 1em;
                    padding: 1em;
                    background: var(--light-gray);
                    border-radius: .5em;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .plans-list h3 {
                    margin-bottom: 1em;
                    font-weight: 600;
                }

                .plans-list ul {
                    list-style: none;
                    padding: 0;
                    display: grid;
                    gap: 1em;
                }

                .plans-list li {
                    padding: 1em;
                    background: var(--white);
                    border-radius: .5em;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .plans-list h4 {
                    margin: 0 0 .5em;
                    font-weight: 600;
                }

                .plans-list p {
                    margin: 0 0 .5em;
                    font-size: .95em;
                    color: var(--dark-gray);
                }

                .plans-list span {
                    font-weight: 500;
                    color: var(--blue);
                }

            `}</style>
        </section>
    )
}

export default SchedulingPlan
