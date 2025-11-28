import { connectToDatabase } from '../clients/miaDB'

const chatLogsCollectionName = 'chatLogs'

export const getLogsDB = async ({ rangeStart, rangeEnd }) => {
    try {
        const mongoClient = await connectToDatabase()
        const chatLogsCollection = mongoClient.db.collection(chatLogsCollectionName)

        const logsList = await chatLogsCollection.find(
            {
                $and: [
                    { date: { $gte: rangeStart } },
                    { date: { $lte: rangeEnd } }
                ]
            },
            {
                projection: {
                    _id: true,
                    navigator: true,
                    date: true,
                    userQuery: true,
                    suggestionID: true,
                    getProgramsListDB: true,
                    rating: true,
                    querySQL: true,
                    programsList: true,
                    retryQuerySql: true,
                    sqlError: true,
                    response: true,
                    responseError: true,
                    anonimousUserID: true,
                    userEmail: true,
                    times: true,
                    testID: true,
                    attemptsListSQL: true
                }
            }
        ).toArray()

        return { logsList }
    } catch (error) {
        return { errGetLogs: error.message }
    }
}
