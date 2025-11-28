import { useMenuStore } from '@/frontend/hooks/globalState/useMenuStore'
import { History, Star } from 'lucide-react'

const AsideMenuNav = ({
    optionSelected = 0,
    selectOpion = () => { }
}) => {
    const isMenuActive = useMenuStore((state) => state.isMenuActive)
    const toogleMenu = useMenuStore((state) => state.toogleMenu)

    const selectNav = (option) => {
        if (option !== optionSelected) {
            selectOpion(option)
        }

        if (!isMenuActive) toogleMenu()
    }

    return (
        <nav>
            <button className={`${isMenuActive && optionSelected === 0 ? 'selected' : ''}`} onClick={() => selectNav(0)}>
                <Star height={isMenuActive ? '1em' : '0'} strokeWidth=".19em" />
                <span>Favoritos</span>
            </button>
            <button className={`${isMenuActive && optionSelected === 1 ? 'selected' : ''}`} onClick={() => selectNav(1)}>
                <History height={isMenuActive ? '1em' : '0'} strokeWidth=".19em" />
                <span>Historial</span>
            </button>
            <style jsx>{`
                nav {
                    display: grid;
                    gap: ${isMenuActive ? '1em' : '0em'};
                    grid-template-columns: repeat(auto-fit, minmax(2em, 1fr));
                    justify-content: center;
                    padding: ${isMenuActive ? '1em .2em' : '0em'};
                    border-top: .15em solid var(--yellow);
                    border-bottom: .15em solid var(--yellow);
                    ${isMenuActive ? '' : 'border: none;'}
                    transition: grid-template-columns 0.3s;
                    transition: gap 0.3s, padding 0.3s;
                }

                button {
                    color: var(--yellow);
                    transition: background .3s, color .3s;
                    padding: ${isMenuActive ? '.5em' : '0'};
                    border-radius: .5em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: .1em;
                    transition: padding .3s, background .2s, color .2s, border .2s;
                    border: ${isMenuActive ? '.1em' : '0'} solid var(--yellow);
                    position: relative;
                    overflow: hidden;
                }

                button::before {
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
                

                button:hover::before {
                    width: 120%;
                }

                button:hover {
                    color: var(--dark-blue);
                }

                .selected {
                    background: var(--yellow);
                    color: var(--dark-blue);
                }

                button span {
                    font-size: ${isMenuActive ? '1em' : '0'};
                    transition: font-size .3s;
                }
            `}</style>
        </nav>
    )
}

export default AsideMenuNav
