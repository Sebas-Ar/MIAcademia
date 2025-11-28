// react
import { Suspense } from 'react'

import { connectToDatabase } from '@/backend/clients/miaDB'
import { getProgramDB } from '@/backend/db/progams.db'
import { getAleatorySuggestions } from '@/backend/db/suggetions.db'
import ChatPage from '@/frontend/components/chat/ChatPage'
import Program from '@/frontend/components/programs/Program'
import SkeletonProgram from '@/frontend/components/programs/SkeletonProgram'

export async function generateMetadata ({ params, searchParams }) {
    const resolvedParams = await params
    const resolvedSearchParams = await searchParams
    const { institute, slug } = resolvedParams

    // Flujo único: si hay ?id= lo usamos, sino buscamos por instituteSlug + programSlug
    const programID = resolvedSearchParams?.id
    const programSlug = !programID ? slug : undefined
    const instituteSlug = !programID ? institute : undefined

    const canonicalUrl = `https://www.miacademia.ai/${institute}/programas/${slug}`
    const { program, errorGetProgram } = await getProgramDB({ programID, programSlug, instituteSlug })

    if (errorGetProgram || !program) {
        return {
            title: 'Programa | MIAcademia',
            description: 'Tu asistente experto para explorar los programas académicos de educación superior',
            alternates: {
                canonical: canonicalUrl
            }
        }
    }

    return {
        title: program.programName,
        description: program.programDescription.replace(/\*/g, ''),
        alternates: {
            canonical: canonicalUrl
        }
    }
}

const Page = async ({ params, searchParams }) => {
    const getSuggestions = async () => {
        const mongoClient = await connectToDatabase()
        const { suggestionsList, errorGetAleatory } = await getAleatorySuggestions(mongoClient)
        if (errorGetAleatory) throw new Error(errorGetAleatory)
        // assign suggestions to input and chatResponse components
        const suggestions = {
            input: suggestionsList.slice(0, 3),
            chatResponse: suggestionsList.slice(3, 6)
        }

        return JSON.parse(JSON.stringify(suggestions))
    }

    const suggestions = await getSuggestions()

    return <ChatPage
        suggestions={suggestions}
        // chatID={chatID}
        // responseStored={chat?.response}
        // userQuery={chat?.userQuery}
        // model={chat?.model}
        location='program'
        isChatEnabled
        // chatRate={chat?.rating}
    >

        <Suspense fallback={<SkeletonProgram />}>
            <Program params={params} searchParams={searchParams} />
        </Suspense>
    </ChatPage>
}

export default Page
