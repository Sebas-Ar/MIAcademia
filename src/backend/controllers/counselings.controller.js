import { addCounselingUserDataDB } from '../db/counseling.db'

export const addInterestedUserData = async (req, res) => {
    try {
        const { name, email, phone } = req.body
        const { addError } = await addCounselingUserDataDB({ name, email, phone })
        if (addError) throw new Error(addError)

        res.status(200).json({
            message: 'success'
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: error.message
        })
    }
}
