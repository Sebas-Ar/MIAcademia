import { authOptions } from '@/auth/auth'
import { getVocationalTestListByUserEmailDB } from '@/backend/db/vocationalTests.db'
import VocationalPage from '@/frontend/components/vocationalTest/VocationalPage'
import { getServerSession } from 'next-auth'

export const metadata = {
    title: 'Test Vocacional de Holland | MIAcademia',
    description: 'Realiza gratis el test vocacional de Holland y descubre qué tipo de carreras van con tu personalidad. Al finalizar, recibirás recomendaciones de programas académicos disponibles en Colombia',
    alternates: {
        canonical: 'https://www.miacademia.ai/test-vocacional'
    }
}

const indexPage = async () => {
    const getTestsList = async () => {
        const session = await getServerSession(authOptions)
        if (session?.user?.email) {
            const { testsList, errorGetTestsList } = await getVocationalTestListByUserEmailDB({ userEmail: session.user.email })
            if (errorGetTestsList) throw new Error(errorGetTestsList)

            return JSON.parse(JSON.stringify(testsList))
        }
    }

    const testsList = await getTestsList()

    return <VocationalPage testsList={testsList} />
}

export default indexPage
