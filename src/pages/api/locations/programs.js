import { getLocationsList } from '@/backend/controllers/locations.controller'

const handler = async (req, res) => {
    const { method } = req

    if (method === 'GET') {
        await getLocationsList(req, res)
    } else {
        res.status(405).json({ error: 'Method not allowed' })
    }
}

export default handler
