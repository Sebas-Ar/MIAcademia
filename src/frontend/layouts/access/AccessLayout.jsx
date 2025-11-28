import Footer from '@/frontend/components/footer/Footer'
import Header from '@/frontend/components/header/Header'

import MenuMain from '@/frontend/components/navigation/MainMenu'

const Login = ({ children, title }) => {
    return (
        <div className="page">
            <MenuMain />

            <main>

                <Header
                    hideCircles={false}
                    isChatEnabled={false}
                    showSubtitle={false}
                    showDescription={false}
                    disableBackground={true}
                    showNav={false}
                    showLine={false}
                    hideCountry={true}
                    hideMainMenu={true}
                />
                <br />
                <div className="form">
                    { children }
                </div>

            </main>

            <Footer />

            <style jsx>{`
                .page {
                    background-color: var(--yellow);
                    display: grid;
                    grid-template-rows: 1fr auto;
                    min-height: 100dvh;
                }          

                .form {
                    position: relative;
                }
            `}</style>
        </div>
    )
}

export default Login
