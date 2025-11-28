'use client'

import { useRef } from 'react'
import ContactContent from '../contact/ContactContent'
import AddOns from './addOns/AddOns'
import CallToAction from './callToAction/CallToAction'
import CounselingHero from './CounselingHero'
import PlansList from './plans/PlansList'
import SocialBenefits from './socialBenefits/SocialBenefits'

const CounselingPage = ({ plans = [] }) => {
    const servicesTitleRef = useRef(null)
    // router

    const scrollToServices = () => {
        servicesTitleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return <>
        <CounselingHero scrollToServices={scrollToServices} />

        <PlansList
            plans={plans}
            servicesTitleRef={servicesTitleRef}
        />

        <SocialBenefits />

        <AddOns />

        <CallToAction />

        <ContactContent />
    </>
}

export default CounselingPage
