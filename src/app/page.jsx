import { connectToDatabase } from '@/backend/clients/miaDB'
import { getAleatorySuggestions } from '@/backend/db/suggetions.db'
import ChatPage from '@/frontend/components/chat/ChatPage'

export const metadata = {
    title: 'MIAcademia',
    description: 'Tu asistente experto para explorar los programas académicos de educación superior',
    alternates: {
        canonical: 'https://www.miacademia.ai'
    }
}

const indexPage = async () => {
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

    return <ChatPage suggestions={suggestions} location='index' />
}

export default indexPage
