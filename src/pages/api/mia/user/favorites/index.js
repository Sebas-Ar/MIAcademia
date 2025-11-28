import { addFavoriteToUser, deleteFavoriteToUser, getFavoritesByUserID } from '@/backend/controllers/users.controller'

const handler = async (req, res) => {
    switch (req.method) {
        case 'GET':
            return await getFavoritesByUserID(req, res)
        case 'POST':
            return await addFavoriteToUser(req, res)
        case 'DELETE':
            return await deleteFavoriteToUser(req, res)
        default:
            res.status(429).json({
                messge: 'no http method enable'
            })
    }
}

export default handler
