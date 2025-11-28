import { getChatByID, rateChat, startChat } from '@/backend/controllers/chat.controller'

const handler = async (req, res) => {
    switch (req.method) {
        case 'GET':
            return await getChatByID(req, res)
        case 'PUT':
            return await startChat(req, res)
        case 'PATCH':
            return await rateChat(req, res)
        default:
            res.status(429).json({
                messge: 'no http method enable'
            })
    }
}

export default handler
