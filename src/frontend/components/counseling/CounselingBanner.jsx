import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { ArrowLeft, BrainCog, Rocket } from 'lucide-react'
import { useRouter } from 'next/navigation'

const CounselingBanner = () => {
    const router = useRouter()

    const onClick = (e) => {
        e.preventDefault()
        triggerEvent(eventCategories.GENERAL_INTERACTIONS, eventNames.NAVIGATION, { to: '/asesoria-vocacional', from: '/', type: 'banner' })
        router.push('/asesoria-vocacional')
    }
    return (
        <li className="wrapper-slide">
            <a href="/asesoria-vocacional" onClick={onClick}>
                <div className="container">

                    <div className="wrapper-content">

                        <div className="icon-sparkles">
                            <Rocket size="7em" />
                        </div>
                        <div className="content">
                            <h3>
                                ¡Decide tu futuro con <br /> nuestra asesoría!
                            </h3>
                        </div>
                        <div className="button-wrapper">
                            <span className='arrow-left'>
                                <ArrowLeft strokeWidth=".25em" />
                            </span>
                                Agendar Asesoría
                        </div>
                        <div className="icon-compass">
                            <BrainCog size="2em" />
                        </div>
                    </div>
                </div>
            </a>

            <style jsx>{`
                li {
                    display: grid;
                    align-items: end;
                    justify-content: center;
                    padding: 0 1em;
                    width: 100vw;
                }

                .container {
                    background: var(--dark-blue);
                    overflow: hidden;
                    margin: auto;
                    cursor: pointer;
                    position: relative;
                    color: var(--yellow);
                    padding: 1.5em;
                    padding-left: .7em;
                    border-radius: .5em;
                    transition: transform .3s;
                    max-width: 26em;
                }

                .icon-sparkles {
                    color: var(--transparent-dark-yellow);
                    transform-origin: center center;
                    transform: rotate(0deg);
                    grid-row: 1/3;
                    grid-column: 1/2;
                }

                .container:hover .icon-sparkles {
                    animation: rotate-left-counseling 3s linear infinite;
                }

                .wrapper-content {
                    display: grid;
                    grid-template-columns: auto auto auto;
                    gap: 1.5em 1em;
                }

                .icon-compass {
                    background: var(--transparent-dark-yellow);
                    padding: .5em;
                    display: grid;
                    place-items: center;
                    border-radius: .3em;
                }

                .content {
                    display: grid;
                    gap: 1em;
                    padding-right: .5em;
                }

                h3 {
                    font-weight: 600;
                    font-size: 1em;
                    text-align: right;
                }

                p {
                    font-weight: 200;
                    margin-bottom: .5em;
                    font-size: .85em;
                    padding-left: .5em;
                    text-align: right;
                }

                .bold {
                    font-weight: 600;
                }

                .button-wrapper {
                    width: 100%;
                    background: var(--yellow);
                    color: var(--dark-blue);
                    justify-self: end;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: .5em 1em;
                    border-radius: .5em;
                    gap: .5em;
                    transition: transform .3s;
                    font-size: .9em;
                    font-weight: 600;
                    grid-column: 2/4;
                    grid-row: 2/3;
                }

                .container:hover .button-wrapper .arrow-left {
                    animation: move-arrow-left .6s linear infinite alternate;
                }

                .container:hover .button-wrapper {
                    transform: scale(1.03);
                }

                .arrow-left {
                    display: grid;
                }

                @keyframes move-arrow-left {
                    0% {
                        transform: translateX(0em);
                    }

                    100% {
                        transform: translateX(-.4em);
                    }
                }

                @keyframes rotate-left-counseling {
                    0% {
                        color: var(--transparent-dark-yellow);
                        transform: rotate(0deg) scale(1);
                    }
                    25% {
                        color: var(--yellow);
                        transform: rotate(-5deg) scale(1.1);
                    }
                    50% {
                        color: var(--transparent-dark-yellow);
                        transform: rotate(0deg) scale(1);
                    }
                    75% {
                        color: var(--yellow);
                        transform: rotate(5deg) scale(1.1);
                    }
                    100% {
                        color: var(--transparent-dark-yellow);
                        transform: rotate(0deg) scale(1);
                    }
                }
            `}</style>

        </li>
    )
}

export default CounselingBanner
