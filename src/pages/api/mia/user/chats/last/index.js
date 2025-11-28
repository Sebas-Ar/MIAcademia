import { getLastChatsByUserID } from '@/backend/controllers/chat.controller'

const handler = async (req, res) => {
    switch (req.method) {
        case 'GET':
            return await getLastChatsByUserID(req, res)
        default:
            res.status(429).json({
                messge: 'no http method enable'
            })
    }
}

export default handler
