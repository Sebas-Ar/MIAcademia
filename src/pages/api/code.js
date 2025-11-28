import { deleteCode } from '@/backend/controllers/codes.controller'

const handlerCode = async (req, res) => {
    switch (req.method) {
        case 'DELETE':
            return await deleteCode(req, res)
        default:
            res.status(429).json({
                messge: 'no http method enable'
            })
    }
}

export default handlerCode
