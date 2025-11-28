'use client'

import currency from 'currency.js'
import { Calendar, CalendarCheck, Clock, Undo2 } from 'lucide-react'
import { Link } from 'next-view-transitions'
import PlanPopular from '../plans/PlanPopular'

const PlanPageHeader = ({
    icon = <></>,
    title = '',
    description = '',
    sessions = 0,
    duration = '',
    sessionTimeUnit = '',
    price = 0,
    isPopular = false,
    route = ''
}) => {
    return (
        <main>
            <header>
                <div className="wrapper-main-icon">
                    {icon}
                </div>
                <div className="title-wrapper">
                    <h1>{title}</h1>
                    {
                        isPopular && <PlanPopular position="auto" />
                    }
                </div>
                <p className="description">{description}</p>
                <div className="go-back">
                    <Link href="/asesoria-vocacional">
                        <div className="wrapper-back-icon">
                            <Undo2 size="1.7em" strokeWidth=".2em" />
                        </div>
                    </Link>
                </div>
            </header>
            <div className="wrapper-main-info">
                <div className="wrapper-item">
                    <span className="wrapper-item-icon">
                        <Calendar size="1.5em" strokeWidth=".15em" color="var(--dark-yellow)" />
                    </span>
                    <span className="sessions">{sessions} sesiones</span>
                </div>
                <div className="wrapper-item">
                    <span className="wrapper-item-icon">
                        <Clock size="1.5em" strokeWidth=".15em" color="var(--dark-yellow)" />
                    </span>
                    <span className="duration">{duration} {sessionTimeUnit} cada una</span>
                </div>
                <div className="wrapper-price">
                    <span className="price">{currency(price, { precision: 0, separator: '.' }).format()}</span>
                    &nbsp;
                    <span className="currency">COP</span>

                </div>
            </div>
            <Link href={`/asesoria-vocacional/agenda/${route}`}>
                <div className="btn-schedule">
                    <CalendarCheck height="1.4em" strokeWidth=".15em" />
                    <span>Agendar Plan</span>
                </div>
            </Link>

            <style jsx>{`

                main {
                    padding: 3em 3em 1em;
                    display: grid;
                    gap: 2em;
                    max-width: 80em;
                    justify-self: center;
                }

                header {
                    text-align: center;
                    display: grid;
                    gap: 1.5em;
                }

                .go-back {
                    position: fixed;
                    top: .2em;
                    left: 0;
                    height: 4.5em;
                    padding: 1em;
                    background: red;
                    z-index: 111111111;
                    border-radius: 0 2em 2em 0;
                    background: var(--yellow);
                    display: grid;
                    place-items: center;
                    width: 4.5em;
                }

                .wrapper-back-icon {
                    transition: transform .3s ease;
                }

                .wrapper-back-icon:hover {
                    transform: scale(1.1);
                }

                .title-wrapper {
                    position: relative;
                    display: grid;
                    gap: .5em;
                    justify-items: center;
                }

                h1 {
                    font-size: 2.5em;
                    font-weight: bold;
                    text-transform: Capitalize;
                }

                p {
                    font-size: 1.4em;
                    color: var(--dark-gray);
                }

                .wrapper-main-icon {
                    height: 6em;
                    width: 6em;
                    display: grid;
                    place-items: center;
                    background-color: var(--yellow);
                    border-radius: 1em;
                    margin: auto;
                }

                .wrapper-main-info {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: center;
                    gap: 2em;
                }

                .wrapper-item {
                    display: flex;
                    align-items: center;
                    gap: .5em;
                }

                .wrapper-item-icon {
                    display: grid;
                    place-items: center;
                }

                .sessions {
                    font-size: 1.2em;
                    font-weight: 600;
                }

                .duration {
                    font-size: 1.2em;
                }

                .price {
                    font-size: 1.9em;
                    font-weight: 700;
                    color: var(--dark-blue);
                }

                .currency {
                    font-size: 1.2em;
                    font-weight: 700;
                    color: var(--dark-gray);
                }

                .btn-schedule {
                    color: var(--dark-blue);
                    transition: background .3s, color .3s;
                    padding: .5em;
                    border-radius: .5em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: .4em;
                    transition: padding .3s, background .2s, color .2s, border .2s;
                    border: .2em solid var(--yellow);
                    position: relative;
                    overflow: hidden;
                    z-index: 1;
                    font-weight: 600;
                    font-size: 1.1em;
                }

                .btn-schedule::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 0;
                    aspect-ratio: 1/1;
                    border-radius: 50%;
                    z-index: -1;
                    transition: width .5s;
                    background: var(--yellow);
                }
                

                .btn-schedule:hover::before {
                    width: 120%;
                }

                .btn-schedule:hover {
                    color: var(--dark-blue);
                }
            `}</style>
        </main>
    )
}

export default PlanPageHeader
