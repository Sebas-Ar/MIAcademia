import { useChatBarStore } from '@/frontend/hooks/globalState/useChatBarStore'
import { useMenuStore } from '@/frontend/hooks/globalState/useMenuStore'
import { useNavigationStore } from '@/frontend/hooks/globalState/useNavigationStore'
import { BotMessageSquare, History, Star, Telescope } from 'lucide-react'
import BtnOptionIcon from './BtnOptionIcon'
import UpcomingFeatures from './UpcomingFeatures'

const Nav = ({
    programMode = false,
    isChatEnabled = false
}) => {
    const isMoreOptionsFeaturesEnable = useNavigationStore((state) => state.isMoreOptionsFeaturesEnable)
    // const toogleisMoreOptionsFeaturesEnable = useNavigationStore((state) => state.toogleisMoreOptionsFeaturesEnable)

    const selectOpion = useMenuStore((state) => state.selectOpion)
    const toogleMenu = useMenuStore((state) => state.toogleMenu)
    const optionSelected = useMenuStore((state) => state.optionSelected)
    const isMenuActive = useMenuStore((state) => state.isMenuActive)

    const toogleModalModelSelectEnable = useChatBarStore((state) => state.toogleModalModelSelectEnable)
    const toogleNavigationModal = useNavigationStore((state) => state.toogleNavigationModal)

    const openHistory = () => {
        toogleMenu(true)
        selectOpion(1)
    }

    const openFavorites = () => {
        toogleMenu(true)
        selectOpion(0)
    }

    return (
        <nav>
            <ul>
                <li className="favorites">
                    <BtnOptionIcon
                        onClick={openFavorites}
                        icon={<Star size="1.4em" strokeWidth=".16em" />}
                        text="favoritos"
                        directionOpen="left"
                        isActive={isMenuActive && optionSelected === 0}
                    />
                </li>
                <li className="history">
                    <BtnOptionIcon
                        onClick={openHistory}
                        icon={<History size="1.4em" strokeWidth=".16em" />}
                        text="historial"
                        directionOpen="left"
                        isActive={isMenuActive && optionSelected === 1}
                    />
                </li>
                <li className='link link-fixed'>
                    <UpcomingFeatures
                        label="programas"
                    />
                </li>
                <li className="tools">
                    <BtnOptionIcon
                        onClick={toogleNavigationModal}
                        icon={<Telescope size="1.4em" strokeWidth=".16em" />}
                        text="herramientas"
                        directionOpen="right"
                    />
                </li>
                <li className="ai-model">
                    <BtnOptionIcon
                        onClick={() => toogleModalModelSelectEnable()}
                        icon={<BotMessageSquare size="1.4em" strokeWidth=".16em" />}
                        text="modelo IA"
                        directionOpen="right"
                    />
                </li>
                {/* <li className='link'>
                    <UpcomingFeatures
                        label="becas"
                        modal={true}
                    />
                </li>
                <li className='link'>
                    <UpcomingFeatures
                        label="financiación"
                        modal={true}
                    />
                </li>
                <li className="more-options">
                    <button onClick={toogleisMoreOptionsFeaturesEnable} type="button" className="btn-open">
                        <div className="dots-icon">
                            <div className="dot-center">
                            </div>
                        </div>

                    </button>
                </li> */}
            </ul>

            <style jsx>{`
                nav {
                    font-size: 1.15em;
                    position: relative;
                    right: ${programMode ? '4px' : '0'};
                    margin: 0 auto ${programMode ? '.5em' : isChatEnabled ? '.5em' : '.8em'};
                    view-transition-name: main-nav;
                }

                ul {
                    margin: auto;
                    display: flex;
                    gap: ${isMoreOptionsFeaturesEnable ? '.4em' : '0'};
                    justify-content: center;
                    align-items: center;
                    transition: gap .3s;
                }

                .link {
                    font-size: ${isMoreOptionsFeaturesEnable ? '1em' : '0'};
                    margin: 0 ${isMoreOptionsFeaturesEnable ? '0' : '-.38em'};
                    padding: .1em ${isMoreOptionsFeaturesEnable ? '.16em' : '0'};
                    opacity: ${isMoreOptionsFeaturesEnable ? '1' : '0'};
                    overflow: hidden;
                    transition: font-size .3s, margin .3s, padding .3s, opacity .3s;
                }

                .link-fixed {
                    font-size: 1em;
                    overflow: visible;
                    opacity: 1;
                    margin: 0;
                }

                .ai-model {
                    position: absolute;
                    left: calc(100% + .5em);
                    top: 50%;
                    transform: translateY(-50%);
                }

                .history {
                    position: absolute;
                    right: calc(100% + .5em);
                    top: 50%;
                    transform: translateY(-50%);
                }

                .favorites {
                    position: absolute;
                    right: calc(100% + 3em);
                    top: 50%;
                    transform: translateY(-50%);
                }

                .tools {
                    position: absolute;
                    left: calc(100% + 3em);
                    top: 50%;
                    transform: translateY(-50%);
                }

                .more-options {
                    position: absolute;
                    left: calc(100% + .4em);
                    top: 50%;
                    transform: translateY(-50%);
                }

                .btn-open {
                    display: grid;
                    place-items: center;
                    background: var(--white);
                    border-radius: 4em;
                    color: var(--yellow);
                    padding: .24em;
                    transform: rotate(${isMoreOptionsFeaturesEnable ? '180deg' : '0'});
                    border: .1em solid var(--yellow);
                    transition: transform .3s .2s;
                }

                .btn-open:hover {
                    transform: scale(1.1) rotate(${isMoreOptionsFeaturesEnable ? '180deg' : '0'});
                }

                .dots-icon {
                    display: grid;
                    place-items: center;
                    height: 1.4em;
                    width: 1.4em;
                }

                .dot-center {
                    background: ${isMoreOptionsFeaturesEnable ? 'transparent' : 'var(--yellow)'};
                    height: .35em;
                    width: .35em;
                    border-radius: 50%;
                    position: relative;
                }

                .dot-center::before {
                    content: '';
                    position: absolute;
                    top: ${isMoreOptionsFeaturesEnable ? '-.05em' : '50%'};
                    right: ${isMoreOptionsFeaturesEnable ? 'auto' : 'calc(100% + .1em)'}; 
                    left: ${isMoreOptionsFeaturesEnable ? '-.2em' : 'auto'};
                    height: ${isMoreOptionsFeaturesEnable ? '.25em' : '100%'};
                    width: ${isMoreOptionsFeaturesEnable ? '.9em' : '100%'};
                    border-radius: ${isMoreOptionsFeaturesEnable ? '.2em' : '50%'}; 
                    background: var(--yellow);
                    transform: translateY(-50%) rotate(45deg);
                    transition: top .3s, right .3s, left .3s, width .3s;
                }

                .dot-center::after {
                    content: '';
                    position: absolute;
                    top: ${isMoreOptionsFeaturesEnable ? '.4em' : '50%'};
                    left: ${isMoreOptionsFeaturesEnable ? '-.2em' : 'calc(100% + .1em)'};
                    height: ${isMoreOptionsFeaturesEnable ? '.25em' : '100%'};
                    width: ${isMoreOptionsFeaturesEnable ? '.9em' : '100%'};
                    border-radius: ${isMoreOptionsFeaturesEnable ? '.2em' : '50%'};
                    background: var(--yellow);
                    transform: translateY(-50%) rotate(-45deg);
                    transition: top .3s, right .3s, left .3s, width .3s;
                }
            `}</style>
        </nav>
    )
}

export default Nav
