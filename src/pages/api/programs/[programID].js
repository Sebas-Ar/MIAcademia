import { getProgram } from '@/backend/controllers/programs.controller'

const handler = async (req, res) => {
    switch (req.method) {
        case 'GET':
            return await getProgram(req, res)
        default:
            res.status(429).json({
                messge: 'no http method enable'
            })
    }
}

export default handler
