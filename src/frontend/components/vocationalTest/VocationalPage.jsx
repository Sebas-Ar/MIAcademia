'use client'

// react
// next
// backend
// import { getVocationalTestListByUserEmailDB } from '@/backend/db/vocationalTests.db'
// import { getServerSession } from 'next-auth'
// components
// test status
// auth
import AsideMenu from '@/frontend/components/navigation/AsideMenu'
import VocationalIntroduction from '@/frontend/components/vocationalTest/VocationalIntroduction'
import SecondaryLayout from '@/frontend/layouts/secondary/SecondaryLayout'

const VocationalPage = ({ testsList = null }) => {
    return <SecondaryLayout>
        <VocationalIntroduction
            testsList={testsList}
        />

        <AsideMenu
            hideTestVocacional
        />
    </SecondaryLayout>
}

export default VocationalPage
