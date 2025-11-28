'use client'

// react
import { useState } from 'react'
// next
// backend
// import { getVocationalTestByIDDB } from '@/backend/db/vocationalTests.db'
// components
// test status
// auth
import VocationalResult from '@/frontend/components/vocationalTest/VocationalResult'
import { useIdentifyUser } from '@/frontend/hooks/useIdentifyUser'
import SecondaryLayout from '@/frontend/layouts/secondary/SecondaryLayout'
import { useRouter } from 'next/navigation'

const VocationalHollandResult = ({ test, isAuthenticated = false }) => {
    // auth
    const { isLogging } = useIdentifyUser()

    // states
    const [isConfirmModalEnable, setIsConfirmModalEnable] = useState(false)

    // router
    const router = useRouter()

    const confirmExit = () => {
        router.push('/test-vocacional')
    }

    return <SecondaryLayout
        isLogging={isLogging}
        isConfirmModalEnable={isConfirmModalEnable}
        setIsConfirmModalEnable={setIsConfirmModalEnable}
        confirmExit={confirmExit}
    >
        <VocationalResult
            isAuthenticated={isAuthenticated}
            testID={test?._id}
            isLogging={isLogging}
            questionaryResult={test?.result}
            confirmExit={confirmExit}

        />
    </SecondaryLayout>
}

export default VocationalHollandResult
