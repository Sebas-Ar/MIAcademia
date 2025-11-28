import { addUserSession } from '@/backend/controllers/userSessions.controller'

const handlerAddUserSession = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    return await addUserSession(req, res)
}

export default handlerAddUserSession
