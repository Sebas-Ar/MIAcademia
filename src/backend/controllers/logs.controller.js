import { getLogsDB } from '../db/logs.db'

export const getLogs = async (req, res) => {
    const { start, end, day, month, year } = req.query

    const rangeStart = new Date(`${year}-${month}-${day}T${start}:00.000Z`)
    const rangeEnd = new Date(`${year}-${month}-${day}T${end}:59.999Z`)

    try {
        const { logsList, errGetLogs } = await getLogsDB({ rangeStart, rangeEnd })
        if (errGetLogs) throw new Error(errGetLogs)

        res.json({
            message: 'logs',
            logs: logsList
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: 'error',
            err: error.message
        })
    }
}
