import { deleteCodeDB } from '../db/code.db'

export const deleteCode = async (req, res) => {
    try {
        const { code } = req.body

        const { errorDeleteCode } = await deleteCodeDB({ code })
        if (errorDeleteCode) throw new Error(errorDeleteCode)

        res.json({
            message: 'success',
            code: code
        })
    } catch (error) {
        res.json({
            message: 'error',
            error: error.message
        })
    }
}
