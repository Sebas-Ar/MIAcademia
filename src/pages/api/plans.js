import { createPlan, deletePlan, getAllPlans, getPlanByTitle, updatePlan } from '@/backend/controllers/plans.controller'

const handler = async (req, res) => {
    const { method } = req

    switch (method) {
        case 'GET':
            if (req.query.title) {
                return await getPlanByTitle(req, res)
            }
            return await getAllPlans(req, res)
        case 'POST':
            return await createPlan(req, res)
        case 'PUT':
            return await updatePlan(req, res)
        case 'DELETE':
            return await deletePlan(req, res)
        default:
            res.status(405).json({ error: 'Method not allowed' })
    }
}

export default handler
