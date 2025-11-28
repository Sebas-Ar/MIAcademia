import { connectToMongoose } from '../clients/mongooseDB.js'
import { Plan } from '../db/models/models.js'

// Función para obtener planes desde Server Components (sin req/res)
export const getPlansData = async () => {
    try {
        await connectToMongoose()
        const plans = await Plan.find().lean()
        return { plans: JSON.parse(JSON.stringify(plans)), error: null }
    } catch (error) {
        console.log(error)
        return { plans: [], error: error.message }
    }
}

// Obtener todos los planes (para rutas API)
export const getAllPlans = async (req, res) => {
    try {
        await connectToMongoose()
        const plans = await Plan.find()
        console.log({ plans })
        res.status(200).json(plans)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

// Obtener un plan por título
export const getPlanByTitle = async (req, res) => {
    try {
        await connectToMongoose()
        const { title } = req.params
        const plan = await Plan.findOne({ title })
        if (!plan) return res.status(404).json({ error: 'Plan not found' })
        res.status(200).json(plan)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Crear un nuevo plan
export const createPlan = async (req, res) => {
    try {
        await connectToMongoose()
        const planData = { ...req.body }

        // Asegurar que sessionInterval tenga valores por defecto si no se proporcionan
        if (planData.sessionInterval) {
            planData.sessionInterval = {
                minDays: planData.sessionInterval.minDays || 2,
                maxDays: planData.sessionInterval.maxDays || 7
            }
        }

        const newPlan = new Plan(planData)
        await newPlan.save()
        res.status(201).json(newPlan)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Actualizar un plan existente
export const updatePlan = async (req, res) => {
    try {
        await connectToMongoose()
        const { _id, ...updates } = req.body

        // Asegurar que sessionInterval tenga valores por defecto si no se proporcionan
        if (updates.sessionInterval) {
            updates.sessionInterval = {
                minDays: updates.sessionInterval.minDays || 2,
                maxDays: updates.sessionInterval.maxDays || 7
            }
        }

        const updatedPlan = await Plan.findByIdAndUpdate(_id, updates, { new: true, runValidators: true })
        if (!updatedPlan) return res.status(404).json({ error: 'Plan not found' })
        res.status(200).json(updatedPlan)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Eliminar un plan
export const deletePlan = async (req, res) => {
    try {
        await connectToMongoose()
        const { _id } = req.body
        const deletedPlan = await Plan.findByIdAndDelete(_id)
        if (!deletedPlan) return res.status(404).json({ error: 'Plan not found' })
        res.status(200).json({ message: 'Plan deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
