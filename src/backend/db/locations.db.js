import { connectToDatabase } from '../clients/miaDB'

const locationsCollectionName = 'institutesLocation'

export const getLocationsListDB = async ({ instituteName, dep, mun }) => {
    try {
        const mongoClient = await connectToDatabase()
        const locationsCollection = mongoClient.db.collection(locationsCollectionName)

        const projection = {
            location: true
        }

        const result = await locationsCollection.findOne({ instituteName, dep, mun }, { projection })

        if (!result) {
            return { locationsList: [] }
        }

        if (!result.location || !result.location.places) {
            return { locationsList: [] }
        }

        // Normalizar después de obtener el documento
        let normalizedDep = dep
        let normalizedMun = mun

        if (dep === 'bogotá, d.c.') normalizedDep = 'bogotá'
        if (mun === 'bogotá, d.c.') normalizedMun = 'bogotá'

        const locationsFilteredList = result.location.places.filter((place) => (
            place.formattedAddress.toLowerCase().includes(normalizedDep) ||
            place.formattedAddress.toLowerCase().includes(normalizedMun)
        ))

        return { locationsList: locationsFilteredList }
    } catch (error) {
        console.log(error.message)
        return { errorGetLocationsList: error.message }
    }
}
