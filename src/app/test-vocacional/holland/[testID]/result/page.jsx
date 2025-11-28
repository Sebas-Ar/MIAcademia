import { authOptions } from '@/auth/auth'
import { getVocationalTestByIDDB } from '@/backend/db/vocationalTests.db'
import VocationalHollandResult from '@/frontend/components/vocationalTest/VocationalHollandResult'
import { getServerSession } from 'next-auth'

export async function generateMetadata ({ params }) {
    const canonicalUrl = `https://www.miacademia.ai/test-vocacional/holland/${params.testID}/result`

    return {
        title: 'Test de Holland - Resultado',
        description: 'Tu asistente experto para explorar los programas académicos de educación superior',
        alternates: {
            canonical: canonicalUrl
        }
    }
}

const hollandResultPage = async ({ params }) => {
    const { testID } = await params

    const getVocationalTest = async () => {
        const { test, errorGetTest } = await getVocationalTestByIDDB({ testID })
        if (errorGetTest) throw new Error(errorGetTest)

        return JSON.parse(JSON.stringify(test))
    }

    const getSession = async () => {
        const session = await getServerSession(authOptions)
        if (session?.user?.email) {
            return true
        }
        return false
    }

    const isAuthenticated = await getSession()

    const vocationalTest = await getVocationalTest()

    return <VocationalHollandResult test={vocationalTest} isAuthenticated={isAuthenticated} />
}

export default hollandResultPage
