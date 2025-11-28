import { ArrowRight } from 'lucide-react'

const CounselingHero = ({
    scrollToServices = () => { }
}) => {
    return (
        <main className="hero-wrapper">
            <div className="wrapper-title">
                <div className="line-left"></div>
                <h1>
                        Descubre Tu Futuro
                    <br />
                        Profesional
                </h1>
                <div className="line-right"></div>
            </div>
            <p>Servicios especializados de <span className='bold'>orientación vocacional</span> y <span className='bold'>desarrollo profesional</span>. Te guiamos en el camino hacia <span className='bold'>el futuro que quieres construir</span></p>
            <button onClick={scrollToServices}>
                <span>
                        Explora nuestro planes
                </span>
                <div className="wrapper-icon">
                    <ArrowRight strokeWidth=".17em" />
                </div>
            </button>

            <div className="line"></div>

            <style jsx>{`
                .hero-wrapper {
                    padding: 5.5em 2em 0;
                    display: grid;
                    gap: 4em;
                }

                .wrapper-title {
                    margin: auto;
                    display: grid;
                    grid-template-columns: auto 1fr auto;
                    border-radius: .5em;
                }

                .line-left, .line-right {
                    height: 100%;
                    width: .5em;
                    border-radius: 1em;
                    background: var(--yellow);
                    position: relative;
                }

                .line-left::before, .line-left::after, .line-right::before, .line-right::after {
                    content: '';
                    position: absolute;
                    height: .5em;
                    width: 5em;
                    background: var(--yellow);
                    border-radius: .3em;
                }

                .line-left::before {
                    top: 0;
                    left: 0;
                }

                .line-left::after {
                    bottom: 0;
                    left: 0;
                }

                .line-right::before {
                    top: 0;
                    right: 0;
                }

                
                .line-right::after {
                    bottom: 0;
                    right: 0;
                }
                

                h1 {
                    text-align: center;
                    font-size: 3em;
                    font-weight: 600;
                    line-height: 1.4em;

                    margin: auto;
                    padding: .5em 1.2em;
                    border-radius: .5em;
                    justify-self: center;
                }

                p {
                    text-align: center;
                    line-height: 1.5lh;
                    font-size: 1.4em;
                    padding: 1em;
                    max-width: 41em;
                    margin: auto;
                }

                .bold {
                    font-weight: 700;
                }

                button {
                    margin: auto;
                    display: flex;
                    gap: 1em;
                    align-items: center;
                    background: var(--yellow);
                    padding: .5em 1.5em .5em 2em;
                    border-radius: 5em;
                    font-weight: 600;
                    font-size: 1.2em;
                    transition: transform .3s, box-shadow .3s;
                    
                    .wrapper-icon {
                        display: grid;
                        place-items: center;
                        animation: move-side 1s infinite linear;
                    }

                    &:hover {
                        transform: scale(1.05);
                        box-shadow: 0 .2em .5em #0004;
                    }
                
                }

                @keyframes move-side {
                    0% {
                        transform: translateX(0);
                    }
                    25% {
                        transform: translateX(.3em);
                    }
                    50% {
                        transform: translateX(0);
                    }
                    75% {
                        transform: translateX(-.3em);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }

                .line {
                    height: .25em;
                    width: 30%;
                    background: var(--transparent-dark-blue);
                    margin: auto;
                    border-radius: .5em;
                    margin-top: 3em;
                }
            `}</style>
        </main>
    )
}

export default CounselingHero
