import { assignEmailToVocationalTest } from '@/backend/controllers/vocationalTest.controller'

const handler = async (req, res) => {
    switch (req.method) {
        case 'PATCH':
            return await assignEmailToVocationalTest(req, res)
        default:
            res.status(429).json({
                messge: 'no http method enable'
            })
    }
}

export default handler
