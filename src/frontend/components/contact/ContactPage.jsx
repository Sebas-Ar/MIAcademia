'use client'

import { useIdentifyUser } from '@/frontend/hooks/useIdentifyUser'
import Footer from '../footer/Footer'
import Header from '../header/Header'
import AsideMenu from '../navigation/AsideMenu'
import MenuMain from '../navigation/MainMenu'
import ContactContent from './ContactContent'

const ContactPage = () => {
    // auth
    useIdentifyUser()

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

        <ContactContent />

        <AsideMenu />

        <Footer />

        <style jsx>{`
            .page {
                min-height: 100dvh;
                display: grid;
                grid-template-rows: auto 1fr auto;
            }
        `}</style>
    </div>
}

export default ContactPage
