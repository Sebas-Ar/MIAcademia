import { notifyUserLater } from '@/backend/controllers/users.controller'

export default async function handler (req, res) {
    const { method } = req

    switch (method) {
        case 'POST':
            return await notifyUserLater(req, res)
        default:
            res.status(429).json({
                messge: 'no http method enable'
            })
    }
}
