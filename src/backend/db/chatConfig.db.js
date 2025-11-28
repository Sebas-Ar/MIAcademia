import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../clients/miaDB'

const miaConfigCollectionName = 'mia-config'

export const getMIAConfigDB = async () => {
    try {
        const mongoClient = await connectToDatabase()
        const miaConfigCollection = mongoClient.db.collection(miaConfigCollectionName)

        const id = new ObjectId('66d91d2b1651ab3a7a375a64')

        const miaConfig = await miaConfigCollection.findOne({ _id: id })
        return miaConfig
    } catch (error) {
        return { error }
    }
}

export const saveMIAConfigDB = async ({ SQLGenerator, responseGenerator }) => {
    try {
        const mongoClient = await connectToDatabase()
        const miaConfigCollection = mongoClient.db.collection(miaConfigCollectionName)

        const id = new ObjectId('66d91d2b1651ab3a7a375a64')

        await miaConfigCollection.updateOne(
            { _id: id },
            {
                $set: {
                    SQLGenerator,
                    responseGenerator
                }
            }
        )
        return {}
    } catch (error) {
        return { error }
    }
}
