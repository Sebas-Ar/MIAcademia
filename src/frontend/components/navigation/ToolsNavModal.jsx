import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { useNavigationStore } from '@/frontend/hooks/globalState/useNavigationStore'
import { X } from 'lucide-react'
import { useTransitionRouter } from 'next-view-transitions'
import ToolSuggestion from '../counseling/ToolSuggestion'
import CouselingBtnLink from './CouselingBtnLink'
import VocationalBtnLink from './VocationalBtnLink'

const ToolsNavModal = ({
    title = ''
}) => {
    const router = useTransitionRouter()

    const isNavigationModalEnable = useNavigationStore(state => state.isNavigationModalEnable)
    const toogleNavigationModal = useNavigationStore(state => state.toogleNavigationModal)

    const onClickLink = (e, { target }) => {
        e.preventDefault()
        triggerEvent(eventCategories.GENERAL_INTERACTIONS, eventNames.NAVIGATION, {
            to: target,
            from: '/asesoria-vocacional',
            type: 'suggestion-asesoria-vocacional'
        })
        router.push(target)
    }

    return (
        <div className="wrapper">
            <div className="background" onClick={toogleNavigationModal}></div>
            <div className="wrapper-content">
                <button className="close-btn" type="button" onClick={toogleNavigationModal}>
                    <X size="1.4em" strokeWidth=".2em" />
                </button>
                <h3>¡Encuentra tu carrera ideal!</h3>
                <p>Identifica tu camino ideal con nuestras herramientas de orientación profesional</p>
                <nav>
                    <a onClick={(e) => onClickLink(e, { target: '/test-vocacional' })}>
                        <ToolSuggestion
                            icon={<VocationalBtnLink />}
                            title="Test Vocacional"
                            description="Descubre tus fortalezas y carreras recomendadas por IA"
                        />
                    </a>
                    <a onClick={(e) => onClickLink(e, { target: '/asesoria-vocacional' })}>
                        <ToolSuggestion
                            icon={<CouselingBtnLink />}
                            title="Asesoría  Personalizada"
                            description="Habla con un experto que te guiará paso a paso para descubrir tu vocación"
                            color='gray'
                        />
                    </a>
                </nav>
            </div>
            <style jsx>{`
                .wrapper {
                    height: 100dvh;
                    width: 100vw;
                    position: fixed;
                    top: 0;
                    left: ${isNavigationModalEnable ? '0' : '-100%'};
                    display: grid;
                    place-items: center;
                    padding: 2em;
                    z-index: 11111111111;
                    view-transition-name: modal-tools-nav;
                    opacity: ${isNavigationModalEnable ? '1' : '0'};
                    transition: 0s left ${isNavigationModalEnable ? '0s' : '.3s'},
                                opacity .3s;
                }

                .background {
                    height: 100%;
                    width: 100%;
                    background: var(--transparent-dark-gray);
                    position: absolute;
                    z-index: -1;
                }

                .wrapper-content {
                    background-color: var(--dark-blue);
                    padding: 2.4em;
                    width: 100%;
                    max-width: 40em;
                    border-radius: 1em;
                    overflow: hidden;
                    border: .125em solid var(--yellow);
                    display: grid;
                    justify-items: center;
                    gap: 1em;
                    position: relative;
                }

                .wrapper-content::-webkit-scrollbar {
                    width: 2em;
                }


                .gap {
                    gap: .8em;
                }

                .close-btn {
                    position: absolute;
                    top: 1em;
                    right: 1em;
                    color: var(--yellow);
                    transition: transform .3s;
                    display: grid;
                    place-items: center;
                }

                h3 {
                    font-size: 1.1em;
                    color: var(--yellow);
                    text-align: center;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                p {
                    color: var(--yellow);
                    font-size: 1em;
                    text-align: center;
                    font-weight: 300;
                    margin-bottom: .7em;
                }

                nav {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2em;
                    color: var(--white);
                }

                .call-action-text {
                    color: var(--dark-gray);
                    font-size: 1em;
                }

                .close-btn:hover {
                    transform: scale(1.1);
                }

                @media (width < 500px) {
                    nav {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>

    )
}

export default ToolsNavModal
