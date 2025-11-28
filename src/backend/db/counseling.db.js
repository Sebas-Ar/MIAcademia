import { connectToDatabase } from '../clients/miaDB'

export const addCounselingUserDataDB = async ({ name = '', email = '', phone = '' }) => {
    try {
        const mongoClient = await connectToDatabase()
        const counselingUsersCollection = mongoClient.db.collection('counseling')

        await counselingUsersCollection.insertOne({
            name,
            email,
            phone
        })

        return { }
    } catch (error) {
        return {
            addError: error.message
        }
    }
}
