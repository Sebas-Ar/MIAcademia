'use client'

import { Award, CalendarCheck } from 'lucide-react'
import Link from 'next/link'

const PlanCallToAction = ({ route = '' }) => {
    return (
        <article className="plan-call-to-action">
            <header>
                <div className="wrapper-icon">
                    <Award size="5em" strokeWidth=".15em" />
                </div>
                <h2>!Transforma tu Futuro!</h2>
            </header>
            <p>Únete a cientos de jovenes que han descubierto su vocación</p>
            <Link href={`/asesoria-vocacional/agenda/${route}`}>
                <div className="btn-schedule">
                    <CalendarCheck height="1.4em" strokeWidth=".15em" />
                    <span>
                        Reservar Ahora
                    </span>
                </div>
            </Link>
            <style jsx>{`
                .plan-call-to-action {
                    text-align: center;
                    padding: 2em;
                    background-color: var(--yellow);
                    border-radius: 8px;
                    color: var(--white);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .plan-call-to-action:hover {
                    box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);
                    transform: translateY(-0.2em);
                }

                header {
                    display: grid;
                    gap: .5em;
                }

                h2 {
                    font-size: 2em;
                    font-weight: bold;
                }

                p {
                    font-size: 1.3em;
                    font-weight: 500;
                }

                .btn-schedule {
                    margin-top: 1.5em;
                    width: 100%;
                    color: var(--dark-blue);
                    padding: .5em;
                    border-radius: .5em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: .4em;
                    transition: padding .3s, background .2s, color .3s, border .3s;
                    border: .2em solid var(--white);
                    position: relative;
                    overflow: hidden;
                    z-index: 1;
                    font-weight: 700;
                    font-size: 1.15em;
                    background: var(--white);
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
        </article>
    )
}

export default PlanCallToAction
