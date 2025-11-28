import { createSchedule, getSchedules } from '@/backend/controllers/schedules.controller'

const handlerSchedules = async (req, res) => {
    switch (req.method) {
        case 'GET':
            return await getSchedules(req, res)
        case 'POST':
            return await createSchedule(req, res)
        default:
            res.status(405).json({ message: 'Method not allowed' })
    }
}

export default handlerSchedules
