'use client'

import Circles from '@/frontend/components/decoration/Circles'
import Footer from '@/frontend/components/footer/Footer'
import Header from '@/frontend/components/header/Header'
import CloseTest from '@/frontend/components/modals/CloseTest'
import MenuMain from '@/frontend/components/navigation/MainMenu'

const SecondaryLayout = ({
    children = null,
    isLogging = false,
    isConfirmModalEnable = false,
    setIsConfirmModalEnable = () => {},
    confirmExit = () => {},
    backgroundColor = 'var(--transparent-dark-blue)',
    ciclesColor = 'var(--transparent-dark-blue)',
    backgroundPage = 'var(--blue)',
    showLine = true,
    paddingInline = '2em'
}) => {
    return (
        <div className="page">

            <Circles
                hideCircles={false}
                ciclesColor={ciclesColor}
            />

            <MenuMain />

            <Header
                hideCircles={false}
                backgroundColor={backgroundColor}
                showNav={false}
                isChatEnabled={true}
                ciclesColor={ciclesColor}
                hideProperties={true}
                showLine={showLine}
                showBorder={false}
            />

            <CloseTest
                isConfirmModalEnable={isConfirmModalEnable}
                setIsConfirmModalEnable={setIsConfirmModalEnable}
                secondaryBtnAction={confirmExit}
                enableCloseBtn
                title="¿Estás seguro que quieres salir del test?"
                text={isLogging ? 'Puedes retomar el test en cualquier momento, guardaremos tu progreso' : 'Tu progreso y resultado no se guardará, a menos que crees una cuenta:'}
                secondaryBtnText="Salir"
                enableLoggingBtn={!isLogging}
                enablePrimaryBtn
                primaryBtnText="Continuar en el Test"
                primaryBtnAction={setIsConfirmModalEnable}
            />

            <main className="container-page">
                {children}
            </main>

            <Footer />

            <style jsx>{`
                .page {
                    min-height: 100dvh;
                    display: grid;
                    grid-template-rows: auto 1fr auto;
                    background-color: ${backgroundPage};
                }

                .container-page {
                    height: calc(100dvh - 8.6em);
                    overflow-y: auto;
                    color: var(--white);
                    position: relative;
                    justify-self: center;
                    width: 100%;
                    padding: 1.5em ${paddingInline} 0;
                    display: grid;
                    place-items: center;
                    position: relative;
                    z-index: 111111111;
                }

                .container-page::-webkit-scrollbar {
                    width: .5em;
                }

                .container-page::-webkit-scrollbar-track {
                    background-color: var(--transparent-dark-blue);
                }

                .container-page::-webkit-scrollbar-thumb {
                    background-color: var(--dark-blue);
                    border-radius: 5px;
                }

                @supports not selector(::-webkit-scrollbar) {
                    .container-page {
                        scrollbar-color: var(--dark-blue)
                                        var(--transparent-dark-blue);
                    }
                }
            `}</style>
        </div>
    )
}

export default SecondaryLayout
