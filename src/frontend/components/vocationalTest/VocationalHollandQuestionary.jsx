'use client'
// react
import { useState } from 'react'
// next
// backend
// import { getVocationalTestByIDDB } from '@/backend/db/vocationalTests.db'
// components
// test status
// auth
import VocationalQuestionary from '@/frontend/components/vocationalTest/VocationalQuestionary'
import { useIdentifyUser } from '@/frontend/hooks/useIdentifyUser'
import SecondaryLayout from '@/frontend/layouts/secondary/SecondaryLayout'
import { useRouter } from 'next/navigation'

const VocationalHollandQuestionary = ({ test, isBetaActive = true }) => {
    // auth
    const { isLogging } = useIdentifyUser()

    // states
    const [isConfirmModalEnable, setIsConfirmModalEnable] = useState(false)

    // router
    const router = useRouter()

    // if (isBetaActive) {
    //         return <CodePage />
    //     }

    const enableExitModal = () => {
        setIsConfirmModalEnable(true)
    }

    const confirmExit = () => {
        router.push('/test-vocacional')
    }

    return <SecondaryLayout
        isLogging={isLogging}
        isConfirmModalEnable={isConfirmModalEnable}
        setIsConfirmModalEnable={setIsConfirmModalEnable}
        confirmExit={confirmExit}
        showLine={false}
    >
        <VocationalQuestionary
            test={test}
            router={router}
            enableExitModal={enableExitModal}
        />
    </SecondaryLayout>
}

export default VocationalHollandQuestionary
