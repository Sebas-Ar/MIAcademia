import { addInterestedUserData } from '@/backend/controllers/counselings.controller'

const handler = async (req, res) => {
    switch (req.method) {
        case 'POST':
            return await addInterestedUserData(req, res)
        default:
            res.status(429).json({
                messge: 'no http method enable'
            })
    }
}

export default handler
