import {
    clearUserSessions,
    getUserSessions,
    syncUserSessions,
    updateUserSessionsStatus
} from '@/backend/controllers/userSessions.controller'

const handlerUserSessions = async (req, res) => {
    switch (req.method) {
        case 'GET':
            return await getUserSessions(req, res)
        case 'POST':
            return await syncUserSessions(req, res)
        case 'PUT':
            return await updateUserSessionsStatus(req, res)
        case 'DELETE':
            return await clearUserSessions(req, res)
        default:
            res.status(405).json({ message: 'Method not allowed' })
    }
}

export default handlerUserSessions
