import { getLocationsListDB } from '../db/locations.db'

export const getLocationsList = async (req, res) => {
    const { instituteName, dep, mun } = req.query
    try {
        const locationsList = await getLocationsListDB({ instituteName, dep, mun })

        res.status(200).json(locationsList)
    } catch (error) {
        res.status(500).json({ error: 'Error getting locations list' })
    }
}
