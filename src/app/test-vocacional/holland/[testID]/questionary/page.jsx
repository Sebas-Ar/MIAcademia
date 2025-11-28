import { redirect } from 'next/navigation'

import { getVocationalTestByIDDB } from '@/backend/db/vocationalTests.db'
import VocationalHollandQuestionary from '@/frontend/components/vocationalTest/VocationalHollandQuestionary'

export async function generateMetadata ({ params }) {
    const canonicalUrl = `https://www.miacademia.ai/test-vocacional/holland/${params.testID}/questionary`

    return {
        title: 'Test de Holland - Questionario',
        description: 'Tu asistente experto para explorar los programas académicos de educación superior',
        alternates: {
            canonical: canonicalUrl
        }
    }
}

const hollandQuestionaryPage = async ({ params }) => {
    const { testID } = await params

    const getVocationalTest = async () => {
        const { test, errorGetTest } = await getVocationalTestByIDDB({ testID })
        if (errorGetTest) throw new Error(errorGetTest)

        if (test.completedAt) {
            redirect('/test-vocacional/')
        }

        return JSON.parse(JSON.stringify(test))
    }

    const vocationalTest = await getVocationalTest()

    return <VocationalHollandQuestionary test={vocationalTest} />
}

export default hollandQuestionaryPage
