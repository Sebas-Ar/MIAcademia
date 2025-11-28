import { removeUserSession } from '@/backend/controllers/userSessions.controller'

const handlerRemoveUserSession = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    return await removeUserSession(req, res)
}

export default handlerRemoveUserSession
