import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../clients/miaDB'

const chatLogsCollectionName = 'chatLogs'

export const createChatDB = async ({ initialChat }) => {
    try {
        const mongoClient = await connectToDatabase()
        const chatLogsCollection = mongoClient.db.collection(chatLogsCollectionName)

        const chatCreated = await chatLogsCollection.insertOne({ ...initialChat })

        return { chatCreated }
    } catch (err) {
        return { chatCreatedError: err.message }
    }
}

export const getChatByIDDB = async ({ chatID }) => {
    try {
        const mongoClient = await connectToDatabase()
        const chatLogsCollection = mongoClient.db.collection(chatLogsCollectionName)

        const chat = await chatLogsCollection.findOne({ _id: new ObjectId(chatID) })

        return { chat }
    } catch (error) {
        return { errorGetChat: error.message }
    }
}

export const updateChatDB = async ({ chatActive, chatID }) => {
    try {
        const mongoClient = await connectToDatabase()
        const chatLogsCollection = mongoClient.db.collection(chatLogsCollectionName)

        const _id = new ObjectId(chatID)

        await chatLogsCollection.updateOne(
            { _id },
            {
                $set: {
                    ...chatActive
                }
            }
        )
        return { }
    } catch (error) {
        return { error: error.message }
    }
}

export const ratingChatDB = async ({ chatID, rating }) => {
    try {
        const mongoClient = await connectToDatabase()
        const chatLogsCollection = mongoClient.db.collection(chatLogsCollectionName)

        const _id = new ObjectId(chatID)

        await chatLogsCollection.updateOne(
            { _id },
            {
                $set: {
                    rating
                }
            }
        )

        return { }
    } catch (error) {
        return { errRating: error.message }
    }
}

export const addProgramSelectedToChatsDB = async ({ chatID = '', programID = '' }) => {
    try {
        const mongoClient = await connectToDatabase()
        const chatLogsCollection = mongoClient.db.collection(chatLogsCollectionName)

        await chatLogsCollection.updateOne(
            { _id: new ObjectId(chatID) },
            {
                $push: {
                    selectedProgramsList: programID
                }
            }
        )
        return { }
    } catch (error) {
        return { errorAddProgram: error.message }
    }
}

export const asignEmailToChatsDB = async ({ userID = '', email = '' }) => {
    try {
        const mongoClient = await connectToDatabase()
        const miaConfigCollection = mongoClient.db.collection(chatLogsCollectionName)

        await miaConfigCollection.updateMany(
            { anonimousUserID: userID },
            {
                $set: {
                    userEmail: email,
                    anonimousUserID: null
                }
            }
        )
        return { }
    } catch (error) {
        console.log(error)
        return { error: error.message }
    }
}

export const getChatsByUserIDDB = async ({ userEmail, anonimousUserID }) => {
    try {
        const mongoClient = await connectToDatabase()
        const miaConfigCollection = mongoClient.db.collection(chatLogsCollectionName)

        const projection = {
            _id: true,
            date: true,
            userQuery: true
        }

        let userChatsList = []
        if (userEmail) userChatsList = await miaConfigCollection.find({ userEmail }, { projection }).toArray()
        if (anonimousUserID) userChatsList = await miaConfigCollection.find({ anonimousUserID }, { projection }).toArray()
        if (!userChatsList || userChatsList.length === 0) throw new Error('no chats found')

        return { userChatsList }
    } catch (error) {
        return { errorGetUserChatsList: error.message }
    }
}

export const getLastChatsByUserIDDB = async ({ userEmail, anonimousUserID }) => {
    try {
        const mongoClient = await connectToDatabase()
        const miaConfigCollection = mongoClient.db.collection(chatLogsCollectionName)

        const projection = {
            _id: true
        }

        let userChatsList = []
        if (userEmail) userChatsList = await miaConfigCollection.find({ userEmail }, { projection }).sort({ date: -1 }).toArray()
        if (anonimousUserID) userChatsList = await miaConfigCollection.find({ anonimousUserID }, { projection }).sort({ date: -1 }).toArray()
        if (!userChatsList || userChatsList.length === 0) throw new Error('no chats found')

        return { userChatsList }
    } catch (error) {
        return { errorGetUserChatsList: error.message }
    }
}

/**
 * Obtiene programas paginados de un chat específico
 * @param {string} chatID - ID del chat
 * @param {number} page - Número de página (empezando en 1)
 * @param {number} limit - Cantidad de programas por página
 * @returns {Object} - Lista de programas paginados y total
 */
export const getChatProgramsDB = async ({ chatID, page = 1, limit = 8 }) => {
    try {
        const mongoClient = await connectToDatabase()
        const chatLogsCollection = mongoClient.db.collection(chatLogsCollectionName)

        const chat = await chatLogsCollection.findOne(
            { _id: new ObjectId(chatID) },
            { projection: { programsList: 1 } }
        )

        if (!chat || !chat.programsList || !chat.programsList.rows) {
            return { programs: [], total: 0 }
        }

        const allPrograms = chat.programsList.rows
        const total = allPrograms.length

        // Calcular índices de paginación
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit

        // Obtener programas de la página actual (arrays)
        const programsArray = allPrograms.slice(startIndex, endIndex)

        // Convertir arrays a objetos
        // Si tenemos fields, usamos esos nombres, sino usamos un mapeo manual
        const programs = programsArray.map(programArray => {
            if (chat.programsList.fields) {
                // Usar nombres de campos de la base de datos
                const programObj = {}
                chat.programsList.fields.forEach((field, index) => {
                    programObj[field.name] = programArray[index]
                })
                return programObj
            } else {
                // Mapeo manual basado en el orden conocido del SQL SELECT
                return {
                    programID: programArray[0],
                    programSlug: programArray[1],
                    instituteSlug: programArray[2],
                    programType: programArray[3],
                    programName: programArray[4],
                    modality: programArray[5],
                    duration: programArray[6],
                    location: programArray[7],
                    price: programArray[8],
                    credits: programArray[9],
                    academicLevel: programArray[10],
                    instituteName: programArray[11],
                    urlImg: programArray[12]
                }
            }
        })
        return {
            programs,
            total
        }
    } catch (error) {
        return { errorGetPrograms: error.message }
    }
}

export const initialChat = {
    date: null,
    userEmail: null,
    anonimousUserID: null,
    testID: null,
    navigator: null,
    suggestionID: null,
    rating: null,
    userQuery: null,
    model: null
}

export const chatActive = {
    programsList: null,
    attemptsListSQL: [
        {
            attempt: 0,
            querySQL: null,
            currentUserQuery: null,
            errGenerateSQL: null,
            errorGetProgramsList: null
        }
    ],
    response: null,
    responseError: null,
    times: {
        startRequest: null,
        startQuerySQL: null,
        endQuerySQL: null,
        startResponse: null,
        endResponse: null,
        endRequest: null
    }
}
