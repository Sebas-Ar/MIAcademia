'use client'

import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { ArrowRight, Compass, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

const VocationalBanner = () => {
    const router = useRouter()
    const onClick = (e) => {
        e.preventDefault()
        triggerEvent(eventCategories.GENERAL_INTERACTIONS, eventNames.NAVIGATION, { to: '/test-vocacional', from: '/', type: 'banner' })
        router.push('/test-vocacional')
    }
    return (
        <li>
            <a href="/test-vocacional" onClick={onClick}>
                <div className="container">

                    <div className="wrapper-content">
                        <div className="icon-compass">
                            <Compass size="2em" />
                        </div>

                        <div className="content">
                            <h3>
                                ¡Descubre tu camino <br /> académico!
                            </h3>
                        </div>
                        <div className="button-wrapper">
                                    Comenzar Test
                            <span className='arrow-right'>
                                <ArrowRight strokeWidth=".25em" />
                            </span>
                        </div>
                        <div className="icon-sparkles">
                            <Sparkles size="6em" />
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
                    box-sizing: border-box;
                    cursor: pointer;
                    position: relative;
                    color: var(--white);
                    padding: 1.5em;
                    padding-right: .5em;
                    border-radius: .5em;
                    transition: transform .3s;
                    max-width: 26em;
                }

                .icon-sparkles {
                    color: var(--medium-gray);
                    transform-origin: center center;
                    transform: rotate(-105deg);
                    grid-row: 1/3;
                    grid-column: 3/4;
                    align-self: center;
                    padding-top: .3em;
                }

                .container:hover .icon-sparkles {
                    animation: rotate-right-vocational 3s linear infinite;
                }

                .wrapper-content {
                    display: grid;
                    grid-template-columns: auto auto auto;
                    gap: 1.5em 1em;
                }

                .icon-compass {
                    background: var(--medium-gray);
                    padding: .5em;
                    display: grid;
                    place-items: center;
                    border-radius: .3em;
                }

                .content {
                    display: grid;
                    gap: 1em;
                    padding-left: .5em;
                }
                
                h3 {
                    font-weight: 600;
                    font-size: 1em;
                }

                p {
                    font-weight: 200;
                    margin-bottom: .5em;
                    font-size: .85em;
                    padding-right: .5em;
                }

                .bold {
                    font-weight: 600;
                }

                .button-wrapper {
                    width: 100%;
                    background: var(--white);
                    color: var(--dark-blue);
                    justify-self: start;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: .5em .5em;
                    border-radius: .5em;
                    gap: .5em;
                    transition: transform .3s;
                    font-size: .9em;
                    font-weight: 600;
                    grid-column: 1/3;
                }

                .container:hover .button-wrapper .arrow-right {
                    animation: move-arrow-right .6s linear infinite alternate;
                }

                .container:hover .button-wrapper {
                    transform: scale(1.03);
                }

                .arrow-right {
                    display: grid;
                }

                @keyframes move-arrow-right {
                    0% {
                        transform: translateX(0em);
                    }

                    100% {
                        transform: translateX(.4em);
                    }
                }

                @keyframes rotate-right-vocational {
                    0% {
                        color: var(--medium-gray);
                        transform: rotate(-105deg) scale(1);
                    }
                    25% {
                        color: var(--white);
                        transform: rotate(-110deg) scale(1.1);
                    }
                    50% {
                        color: var(--medium-gray);
                        transform: rotate(-105deg) scale(1);
                    }
                    75% {
                        color: var(--white);
                        transform: rotate(-100deg) scale(1.1);
                    }
                    100% {
                        color: var(--medium-gray);
                        transform: rotate(-105deg) scale(1);
                    }
                }
            `}</style>
        </li>
    )
}

export default VocationalBanner
