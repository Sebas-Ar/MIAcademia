import { connectToDatabase } from '@/backend/clients/miaDB'
import { getChatByIDDB } from '@/backend/db/chat.db.js'
import { getAleatorySuggestions } from '@/backend/db/suggetions.db'
import ChatPage from '@/frontend/components/chat/ChatPage'

export async function generateMetadata ({ params }) {
    const canonicalUrl = `https://www.miacademia.ai/chats/${params.chatID}`

    return {
        title: 'Chat | MIAcademia',
        alternates: {
            canonical: canonicalUrl
        }
    }
}

const ChatIDPage = async ({ params }) => {
    const { chatID } = await params

    const getChat = async () => {
        const { chat, errorGetChat } = await getChatByIDDB({ chatID })
        if (errorGetChat) throw new Error(errorGetChat)

        return JSON.parse(JSON.stringify(chat))
    }

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

    const chat = await getChat()

    return <ChatPage
        suggestions={suggestions}
        chatID={chatID}
        responseStored={chat?.response}
        userQuery={chat?.userQuery}
        model={chat?.model}
        location='chat'
        isChatEnabled
        chatRate={chat?.rating}
    />
}

export default ChatIDPage
