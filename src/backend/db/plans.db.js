import { connectToMongoose } from '../clients/miaDBMongoose.js'
import { Plan } from './models/models.js'

export const getPlanByRouteDB = async ({ route }) => {
    console.log({ route })
    try {
        await connectToMongoose()
        const plan = await Plan.findOne({ route }).lean() // Use .lean() to get a plain JavaScript object

        if (!plan) {
            return { errorGetPlan: 'Plan not found', plan: null }
        }
        return { plan: JSON.parse(JSON.stringify(plan)), errorGetPlan: null }
    } catch (error) {
        console.log(error.message)
        return { errorGetPlan: error.message, plan: null }
    }
}
