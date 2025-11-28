import { connectToDatabase } from '../clients/miaDB'

export const deleteCodeDB = async ({ code }) => {
    try {
        const mongoClient = await connectToDatabase()
        const miaCodeCollection = mongoClient.db.collection('codesBeta')
        const responseDelete = await miaCodeCollection.deleteOne({ code })
        if (!responseDelete.deletedCount) throw new Error('code not found')

        return {}
    } catch (error) {
        return { errorDeleteCode: error.message }
    }
}
