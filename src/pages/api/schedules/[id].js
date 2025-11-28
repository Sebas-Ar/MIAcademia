import { deleteSchedule, updateSchedule } from '@/backend/controllers/schedules.controller'

const handlerScheduleById = async (req, res) => {
    switch (req.method) {
        case 'PUT':
            return await updateSchedule(req, res)
        case 'DELETE':
            return await deleteSchedule(req, res)
        default:
            res.status(405).json({ message: 'Method not allowed' })
    }
}

export default handlerScheduleById
