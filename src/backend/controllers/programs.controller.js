import { getProgramDB } from '../db/progams.db'

export const getProgram = async (req, res) => {
    try {
        const { programID, filters } = req.query
        const filtersList = JSON.parse(filters)
        console.log({ filtersList })

        const { program, errorGetProgram } = await getProgramDB({ programID, filtersList })
        if (errorGetProgram) throw new Error(errorGetProgram)
        res.json({
            message: 'hola',
            data: program
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: 'error',
            error: error.message
        })
    }
}
