import { getLogs } from '@/backend/controllers/logs.controller'

const handler = async (req, res) => {
    const { method } = req

    switch (method) {
        case 'GET':
            return await getLogs(req, res)
        default:
            res.status(429).json({
                messge: 'no http method enable'
            })
    }
}

export default handler
