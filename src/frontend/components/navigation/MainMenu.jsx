import { useMenuStore } from '@/frontend/hooks/globalState/useMenuStore'
import { Brain, Coffee, DoorOpen, Headset, Moon, NotebookPen, PawPrint, Presentation, Scale, ShieldCheck, Sun, X } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AsideMainMenu from '../header/AsideMainMenu'
import SelectCountry from '../header/SelectCountry'
import AnonimouseUserIcon from '../login/AnonimouseUserIcon'
import LoginGoogle from '../login/LoginGoogle'
import BtnWrapper from './BtnWrapper'
import MenuService from './MenuService'
import SubmenuWrapper from './SubmenuWrapper'

const MenuMain = ({
    backgroundColor = 'transparent'
}) => {
    const isMenuActive = useMenuStore((state) => state.isMenuActive)
    const toogleMenu = useMenuStore((state) => state.toogleMenu)

    const [isNavOpen, setIsNavOpen] = useState(false)
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)

    // const pathname = usePathname()
    const session = useSession()

    useEffect(() => {
        if (session.status === 'authenticated') {
            setIsUserAuthenticated(true)
        }
    }, [session])

    const closeNav = () => {
        setIsNavOpen(false)
    }

    const openNav = () => {
        if (isMenuActive) toogleMenu()
        setIsNavOpen(true)
    }

    return <div className="container">

        <div className="close-background" onClick={closeNav}></div>
        <AsideMainMenu backgroundColor="var(--yellow)" />
        <aside>
            <button className="btn-close">
                <X size="1.7em" strokeWidth=".2em" onClick={closeNav} />
            </button>
            <header onClick={openNav} className="user-info">
                {
                    session?.data?.user?.image
                        ? <>
                            <img src={session?.data?.user?.image} alt="user" />
                            <p className="user-name-wrapper">
                                <span className="greeting">
                                    {
                                        new Date().getHours() >= 6 && new Date().getHours() < 12
                                            ? <>
                                            Buenos días <Sun strokeWidth=".2em" size="2em" />
                                            </>
                                            : new Date().getHours() >= 12 && new Date().getHours() < 18
                                                ? <>
                                                Buenas tardes <Coffee strokeWidth=".2em" size="1.8em" />
                                                </>
                                                : <>
                                                Buenas noches <Moon strokeWidth=".2em" size="1.7em" />
                                                </>
                                    }

                                </span>
                                <span className="user-name">
                                    {
                                        session?.data?.user?.name?.split(' ')[0]
                                    }
                                </span>
                            </p>
                        </>
                        : <>
                            <AnonimouseUserIcon isNavOpen={isNavOpen} />
                            <div className="btn-login">
                                <LoginGoogle
                                    locationBtn='main-menu'
                                />
                            </div>
                        </>
                }
            </header>

            <div className="line"></div>

            <div className="content">
                <BtnWrapper closeNav={closeNav} />
                <SubmenuWrapper subtitle="Menu">
                    <MenuService
                        name="Descubre MIAcademia"
                        icon={<Presentation size="100%" strokeWidth=".11em" />}
                        href="/nosotros"
                    />
                    <MenuService
                        name="Contacto"
                        icon={<Headset size="100%" strokeWidth=".11em" />}
                        href="/contacto"
                    />
                </SubmenuWrapper>

                <SubmenuWrapper
                    subtitle="Servicios"
                    number={3}
                    border={true}
                >
                    <MenuService
                        name="MIA"
                        icon={<PawPrint size="100%" strokeWidth=".11em" />}
                        href="/"
                        background
                        border
                    />
                    <MenuService
                        name="Test Vocacional"
                        icon={<NotebookPen size="100%" strokeWidth=".11em" />}
                        href="/test-vocacional"
                        background
                        border
                    />
                    <MenuService
                        name="Asesoria Vocacional"
                        icon={<Brain size="100%" strokeWidth=".11em" />}
                        href="/asesoria-vocacional"
                        background
                        border
                    />
                </SubmenuWrapper>
                <SubmenuWrapper subtitle="Terminos y Condiciones">
                    <MenuService
                        name="Políticas de Privacidad"
                        icon={<ShieldCheck size="100%" strokeWidth=".11em" />}
                        href="/terminos-condiciones/politica-de-privacidad"
                    />
                    <MenuService
                        name="Condiciones del Servicio"
                        icon={<Scale size="100%" strokeWidth=".11em" />}
                        href="/terminos-condiciones/condiciones-del-servicio"
                    />
                </SubmenuWrapper>
                {
                    isUserAuthenticated &&
                        <button className="close-btn" onClick={async () => await signOut()}>
                            <DoorOpen strokeWidth=".15em" size="1.5em" />
                            Cerrar sesión
                        </button>
                }

            </div>
            <footer>
                <div className="line"></div>
                <SelectCountry />
            </footer>

        </aside>
        <style jsx>{`
                .container {
                    position: fixed;
                    top: ${isNavOpen ? '0em' : '.2em'};
                    z-index: 11111111111;
                    background: ${backgroundColor};
                    border-radius: 0 2em 2em 0;
                    padding-bottom: .15em;
                    transition: top ${isNavOpen ? '0s 0s' : '.3s .3s'};
                    left: ${isMenuActive ? '0' : '100vw'};
                }

                .close-background {
                    position: absolute;
                    background: var(--transparent-dark-gray);
                    height: 100dvh;
                    width: 100vw;
                    left: ${isNavOpen ? '0' : '100vw'};
                    opacity: ${isNavOpen ? '1' : '0'};
                    transition: opacity .3s, left 0s ${isNavOpen ? '0s' : '.3s'};
                }

                aside {
                    padding: ${isNavOpen ? '2em' : '1em .3em 1.3em 1.5em'};
                    position: fixed;
                    right: 0; 
                    height: ${isNavOpen ? '100%' : '4.7em'};
                    width: ${isNavOpen ? '25em' : '5.1em'};
                    top: ${isNavOpen ? '0' : '.2em'};
                    view-transition-name: main-menu-test;
                    z-index: 1111111111;
                    background: ${isNavOpen ? 'var(--dark-blue)' : backgroundColor};
                    border-radius: ${isNavOpen ? '0' : '2em 0 0 2em'};
                    border-left: ${isNavOpen ? '.2em' : '0'} solid var(--yellow);
                    transition: top .3s, height .3s, width .3s, border-radius .3s, background .3s, border .1s;
                    display: grid;
                    gap: 1.5em;
                    grid-template-rows: auto auto 1fr ${isUserAuthenticated ? 'auto' : ''};
                    color: white;
                }

                .btn-close {
                    position: absolute;
                    top: 1em;
                    right: .7em;
                    color: var(--white);
                    display: grid;
                    place-items: center;
                    font-size: ${isNavOpen ? '1em' : '0'};
                    transition: font-size .3s, transform .3s;
                }

                .btn-close:hover {
                    transform: scale(1.15);
                }

                .user-info {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: .8em;

                    img {
                        height: ${isNavOpen ? '2.5em' : '2.5em'};
                        border-radius: .5em;
                        border: .15em solid var(--yellow);
                        cursor: pointer;
                    }
                }

                .user-name-wrapper {
                    font-size: .8em;
                    font-weight: 600;
                }

                .greeting {
                    display: flex;
                    align-items: center;
                    gap: .5em;
                    font-size: .9em;
                }

                .user-name {
                    color: var(--yellow);
                    font-size: 1.15em;
                }

                .line {
                    height: .14em;
                    width: 100%;
                    background: var(--yellow);
                    margin-top: .5em;
                    border-radius: 6em;
                }

                .content {
                    overflow: auto;
                    padding-right: 1em
                }

                .content::-webkit-scrollbar {
                    width: .4em;
                }

                .content::-webkit-scrollbar-track {
                    background-color: unset;
                }

                .content::-webkit-scrollbar-thumb {
                    background-color: var(--yellow);
                    border-radius: 5px;
                }

                @supports not selector(::-webkit-scrollbar) {
                    .content {
                        scrollbar-color: var(--yellow)
                                        unset;
                    }
                }

                .content, .close-btn, .user-name-wrapper, .btn-login, .line {
                    font-size: ${isNavOpen ? '1em' : '0'};
                    opacity: ${isNavOpen ? '1' : '0'};
                    transition: font-size .3s;
                }

                .close-btn {
                    background: var(--transparent-red);
                    padding: .5em 1em;
                    justify-self: end;
                    color: var(--white);
                    border-radius: .5em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: .5em;
                    margin-top: 2em;
                }

                footer {
                    display: grid;
                    gap: 1em;
                    font-size: ${isNavOpen ? '1em' : '0'};
                    
                }

            `}</style>
    </div>
}

export default MenuMain
