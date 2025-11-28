import { useMenuStore } from '@/frontend/hooks/globalState/useMenuStore'
import { useIdentifyUser } from '@/frontend/hooks/useIdentifyUser'
import { X } from 'lucide-react'
import AsideMenuNav from './AsideMenuNav'
import FavoriteList from './FavoriteList'
import HistoryList from './HistoryList'
import ResizeBar from './ResizeBar'

const AsideMainMenu = ({
    backgroundColor = 'transparent'
}) => {
    const { anonimousUserID, userEmail } = useIdentifyUser()

    const optionSelected = useMenuStore((state) => state.optionSelected)
    const selectOpion = useMenuStore((state) => state.selectOpion)

    const isMenuActive = useMenuStore((state) => state.isMenuActive)
    const toogleMenu = useMenuStore((state) => state.toogleMenu)

    return <div className="container">

        <div className="close-background" onClick={toogleMenu}></div>

        <aside>
            <header>
                <button className="btn-close">
                    <X size="1.7em" strokeWidth=".2em" onClick={toogleMenu} />
                </button>
            </header>
            <AsideMenuNav
                optionSelected={optionSelected}
                selectOpion={selectOpion}
            />
            <p>
                {
                    optionSelected === 0 &&
                    'Tus programas favoritos, siempre a la mano'
                }
                {
                    optionSelected === 1 &&
                    'Todas tus búsquedas pasadas en un mismo lugar'
                }
            </p>
            <FavoriteList
                isMenuActive={isMenuActive}
                optionNumber={0}
                optionSelected={optionSelected}
                userEmail={userEmail}
            />
            <HistoryList
                isMenuActive={isMenuActive}
                optionNumber={1}
                optionSelected={optionSelected}
                anonimousUserID={anonimousUserID}
                userEmail={userEmail}
            />
            <ResizeBar isMenuActive={isMenuActive} />
        </aside>
        <style jsx>{`
            .container {
                position: fixed;
                top: ${isMenuActive ? '0' : '.2em'};
                z-index: 11111111111;
                border-radius: 0 2em 2em 0;
                padding-bottom: .15em;
                transition: top ${isMenuActive ? '0s 0s' : '.3s .3s'};
            }

            .close-background {
                position: absolute;
                background: var(--transparent-dark-gray);
                height: 100dvh;
                width: 100vw;
                left: ${isMenuActive ? '0' : '100vw'};
                opacity: ${isMenuActive ? '1' : '0'};
                transition: opacity .3s, left 0s ${isMenuActive ? '0s' : '.3s'};
            }

            aside {
                position: relative;
                display: grid;
                background: ${isMenuActive ? 'var(--dark-blue)' : 'unset'};
                height: ${isMenuActive ? '100dvh' : '0'};
                width: ${isMenuActive ? '25em' : '0'};
                padding: ${isMenuActive ? '1em' : '0'};
                padding-top: 1.3em;
                grid-template-rows: auto auto auto ${optionSelected === 0 ? '1fr' : '0'} ${optionSelected === 1 ? '1fr' : '0'};
                transition: width .3s, height .3s, background .3s, padding .3s;
                z-index: 1;
            }

            header {
                padding-bottom: ${isMenuActive ? '1.2em' : '0em'};
                transition: padding .3s;
            }

            .btn-close {
                color: var(--white);
                display: grid;
                place-items: center;
                font-size: ${isMenuActive ? '1em' : '0'};
                transition: font-size .3s, transform .3s;
            }

            .btn-close:hover {
                transform: scale(1.15);
            }

            p {
                color: var(--gray);
                font-size: ${isMenuActive ? '.8em' : '0'};
                margin: 1.5em 1em;
                text-align: center;
                transition: font-size .3s;
            }
        `}</style>
    </div>
}

export default AsideMainMenu
