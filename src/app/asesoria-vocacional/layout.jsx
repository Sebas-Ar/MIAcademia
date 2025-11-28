'use client'

import Footer from '@/frontend/components/footer/Footer'
import Header from '@/frontend/components/header/Header'
import AsideMenu from '@/frontend/components/navigation/AsideMenu'
import MenuMain from '@/frontend/components/navigation/MainMenu'

const CounselingLayout = ({ children }) => {
    return <div className="page">
        <MenuMain
            backgroundColor="var(--yellow)"
        />

        <Header
            hideCircles={false}
            isChatEnabled={true}
            setIsModalEnable={false}
            showSubtitle={false}
            showDescription={false}
            disableBackground={false}
            showNav={false}
            hideCountry={true}
        />

        <AsideMenu
            hideCouseling
        />

        {
            children
        }

        <Footer />

        <style jsx>{`
            .page {
                min-height: 100dvh;
                display: grid;
                grid-template-rows: auto 1fr auto;
                background: var(--light-blue);
            }
        `}</style>
    </div>
}

export default CounselingLayout
