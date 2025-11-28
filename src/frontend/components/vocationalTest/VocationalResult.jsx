import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { CircleAlert, LogOut, Sparkles, Sprout } from 'lucide-react'
import { useRef, useState } from 'react'
import Cat from '../decoration/Cat'
import CloseTest from '../modals/CloseTest'
import ResultPercentualScore from './ResultPercentualScore'

const VocationalResult = ({
    isAuthenticated = false,
    testID = '',
    isLogging = false,
    questionaryResult = null,
    confirmExit = () => { }
}) => {
    const [isAcceptWithoutLogin, setIsAcceptWithoutLogin] = useState(false)
    const [isConfirmModalEnable, setIsConfirmModalEnable] = useState(false)

    const getMaxPercentage = () => {
        return Math.max(...questionaryResult.testResult.map(r => r.percentualScore))
    }

    const getMinPercentage = () => {
        return Math.min(...questionaryResult.testResult.map(r => r.percentualScore))
    }

    const maxPercentage = useRef(getMaxPercentage())
    const minPercentage = useRef(getMinPercentage())

    const continueWithoutLogin = () => setIsAcceptWithoutLogin(true)

    const enableModal = () => {
        triggerEvent(eventCategories.TEST_VOCACIONAL, eventNames.EXIT_TEST)
        setIsConfirmModalEnable(true)
    }

    const exitTest = () => {
        confirmExit()
    }

    const getSortedResultsDesc = (questionaryResult) => {
        return [...questionaryResult.testResult].sort(
            (a, b) => b.percentualScore - a.percentualScore
        )
    }

    if (!isAuthenticated && !isLogging && !isAcceptWithoutLogin) {
        return <CloseTest
            isConfirmModalEnable
            title="Inicia sesión para ver el resultado"
            secondaryBtnAction={continueWithoutLogin}
            secondaryBtnText="Continuar sin iniciar sesión"
            text="Tu resultado no se guardará, a menos que crees una cuenta:"
            enableLoggingBtn
        />
    }

    if (!questionaryResult) return <p>No hay resultado guardado para este test</p>

    return (
        <>
            <CloseTest
                isConfirmModalEnable={isConfirmModalEnable}
                setIsConfirmModalEnable={setIsConfirmModalEnable}
                secondaryBtnAction={exitTest}
                enableCloseBtn
                title="¿Estás seguro que quieres salir del test?"
                text={isLogging ? 'Puedes retomar el test en cualquier momento, guardaremos tu progreso' : 'Tu progreso y resultado no se guardará, a menos que crees una cuenta:'}
                secondaryBtnText="Salir"
                enableLoggingBtn={!isLogging}
            />
            <div className="container">
                <button onClick={enableModal} className="exit-btn">
                    Salir
                    <LogOut size="1.2em" strokeWidth={2.5} />
                </button>

                <WrapperArticleResult
                    titleFirstLine="¡Test completado!"
                    titleSecondLine="Tu perfil, tus fortalezas, tus oportunidades"
                    description='Descubre las áreas que mejor se alinean con tu perfil, intereses y fortalezas. Este es el primer paso para tomar decisiones informadas sobre tu futuro académico y profesional'
                >
                    <div className="dominant-profile">
                        <h2 className="dominant-title">
                            Tu perfil dominante es
                        </h2>
                        <span className="dominant-profile-acronym-wrapper">
                            <h3>
                                {
                                    getSortedResultsDesc(questionaryResult)
                                        ?.filter((res, index) => {
                                            return index < 3
                                        })
                                        ?.map((res, index) => {
                                            return res.name[0]
                                        })
                                }
                            </h3>
                            <span className="tooltip-wapper">
                                <CircleAlert size="1.4em" />
                                <span className="tooltip-text">
                                    Es el acrónimo de tus 3 perfiles con mayor puntuación
                                </span>
                            </span>
                        </span>
                        <p className="dominant-profile-description">
                            {questionaryResult?.dominantProfile?.descriptionAcronym}
                        </p>
                    </div>
                    <div className="wrapper-icon">
                        <div className="icon">
                            <Sprout strokeWidth=".1em" size="2em" />
                        </div>
                    </div>
                    <h2 className="profiles-title">
                        Tu porcentaje de afinidad
                        <br />
                        con cada perfil vocacional
                    </h2>
                    <ul>
                        {
                            getSortedResultsDesc(questionaryResult)?.map((res, index) => {
                                return (
                                    <ResultPercentualScore
                                        key={index}
                                        index={index}
                                        category={res.name}
                                        percentualScore={res.percentualScore}
                                        minPercentage={minPercentage.current}
                                        maxPercentage={maxPercentage.current}
                                        interpretationProfile={res.interpretationProfile}
                                        strengthsDescription={res.strengthsDescription}
                                        testID={testID}
                                        recommendedProgramList={res.recommendedProgramList}
                                    />
                                )
                            }
                            )
                        }
                    </ul>
                </WrapperArticleResult>

                <Cat />

                <style jsx>{`
                    .container {
                        display: grid;
                        gap: 2em;
                        max-width: 80em;
                        position: relative;
                        padding-bottom: 3.5em;
                    }

                    ul {
                        display: grid;
                        gap: 1em;
                    }

                    .profiles-title {
                        margin-bottom: 1.5em;
                        text-align: center;
                        font-weight: 600;
                        font-size: 1.4em;
                        color: var(--yellow);
                    }

                    .profiles-description {
                        text-align: center;
                        margin-bottom: 1.5em;
                    }

                    .wrapper-icon {
                        margin-top: 3em;
                        display: grid;
                        place-items: center;
                        color: var(--yellow);
                        margin-bottom: 1em;
                        
                        .icon {
                            background: var(--transparent-dark-blue);
                            display: grid;
                            place-items: center;
                            padding: .5em;
                            border-radius: 50%;
                            border: .15em solid var(--yellow);
                        }
                    }

                    .exit-btn {
                        position: fixed;
                        top: 1.2em;
                        left: 1em;
                        background: var(--transparent-white);
                        border-radius: .5em;
                        color: var(--white);
                        border: .1em solid var(--white);
                        font-weight: 500;
                        padding: .3em .7em;
                        display: flex;
                        align-items: center;
                        gap: .5em;
                        transition: transform .3s;
                        z-index: 11111111;
                    }

                    .exit-btn:hover {
                        transform: scale(1.05);
                    }

                    .dominant-title {
                    }

                    .dominant-profile-acronym-wrapper {
                        position: relative;
                        background: var(--transparent-dark-blue);
                        border-radius: .5em;

                    }

                    .dominant-profile-acronym-wrapper h3 {
                        padding: .1em .5em .1em .6em;
                        font-weight: 600;
                        font-size: 1.7em;
                        letter-spacing: .05em;
                        color: var(--yellow);
                    }

                    .dominant-profile {
                        font-size: 1.2em;
                        font-weight: 600;
                        display: grid;
                        justify-items: center;
                        gap: 1em;
                        align-items: center;
                        margin-bottom: 1em;
                        background: var(--transparent-dark-blue);
                        justify-self: center;
                        padding: 1.5em;
                        border-radius: .5em;
                    }

                    .tooltip-wapper {
                        position: absolute;
                        left: calc(100% + .5em);
                        top: 50%;
                        transform: translateY(-50%);
                        display: grid;
                        color: var(--yellow);
                        cursor: pointer;
                    }

                    .tooltip-wapper:hover .tooltip-text {
                        opacity: 1;
                        font-size: .8em;
                    }

                    .tooltip-text::before {
                        content: "";
                        position: absolute;
                        width: 0px;
                        height: 0px;
                        border-style: solid;
                        border-width: .7em .7em .7em 0;
                        transform: translate(-.5em, -50%) rotate(90deg);
                        border-color: transparent var(--dark-blue) transparent transparent;
                        right: .5em;
                        top: 0;
                        filter: drop-shadow(-.15em 0 0 var(--dark-blue));
                    }

                    .tooltip-text {
                        position: absolute;
                        font-size: 0;
                        opacity: 0;
                        background: var(--dark-blue);
                        padding: .8em;
                        border-radius: .5em;
                        min-width: 15em;
                        text-align: center;
                        top: calc(100% + .5em);
                        right: -.4em;
                        transition: font-size .3s, opacity .3s;
                    }

                    .dominant-profile-description {
                        font-size: .9em;
                        font-weight: 400;
                        font-style: italic;
                        text-align: center;
                        max-width: 40em;
                    }


                `}</style>
            </div>
        </>
    )
}

export default VocationalResult

const WrapperArticleResult = ({
    titleFirstLine = '',
    titleSecondLine = '',
    description = '',
    children = <></>
}) => {
    return (
        <article>
            <h1>
                <span className="tittle-first-line">
                    <div className="star-icon">
                        <Sparkles size="1.2em" color="var(--yellow)" />
                    </div>
                    {titleFirstLine}
                    <div className="star-icon">
                        <Sparkles size="1.2em" color="var(--yellow)" />
                    </div>
                </span>
                <span className="tittle-second-line">
                    {titleSecondLine}
                </span>
            </h1>

            {/* {
                description &&
                <p>{description}</p>
                } */}

            {children}

            <style jsx>{`
                article {
                    background-color: var(--transparent-dark-blue);
                    padding: 2em;
                    border-radius: .5em;
                    transition: width .3s;
                }

                h1 {
                    text-align: center;
                    font-weight: 600;
                    margin-bottom: 2.1em;
                    color: var(--yellow);
                    display: grid;
                    gap: .5em;
                }

                .tittle-first-line {
                    text-transform: uppercase;
                    font-size: 1.55em;
                    justify-self: center;
                    display: flex;
                    align-items: center;
                    gap: .5em;
                    color: var(--white);
                }

                .tittle-second-line {
                    font-size: 1.3em;

                }

                .star-icon {
                    transform: rotate(25deg) translateY(.2em);
                }

                .star-icon:nth-child(1) {
                    transform: rotate(-120deg) translateY(.2em);
                }

                p {
                    font-weight: 400;
                    text-align: center;
                }
            `}</style>
        </article>
    )
}
