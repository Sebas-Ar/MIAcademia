import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../clients/miaDB'

export const createVocationalTestDB = async ({ userID = null, startedAt = '', userEmail = '', questionsListAleatory = [], anonimousUserID = '', questionsNumber = 0 }) => {
    try {
        const mongoClient = await connectToDatabase()
        const vocationalTestsCollection = mongoClient.db.collection('vocationalTests')

        const testSaved = await vocationalTestsCollection.insertOne({
            userEmail,
            anonimousUserID,
            userID,
            startedAt: new Date(startedAt.replace('Z', '+05:00')),
            completedAt: null,
            duration: null,
            result: null,
            questionary: null,
            questionsListAleatory,
            questionsNumber
        })

        return { testSaved }
    } catch (error) {
        return { error: error.message }
    }
}

export const updateVocationalTestDB = async ({ testID = '', testData = {} }) => {
    try {
        const mongoClient = await connectToDatabase()
        const vocationalTestsCollection = mongoClient.db.collection('vocationalTests')

        const id = new ObjectId(testID)

        await vocationalTestsCollection.updateOne(
            { _id: id },
            {
                $set: {
                    ...testData
                }
            }
        )
        return { }
    } catch (error) {
        return { errorUpdateTest: error.message }
    }
}

export const addProgramSelectedToVocationalTestDB = async ({ testID = '', programName = '' }) => {
    try {
        const mongoClient = await connectToDatabase()
        const vocationalTestsCollection = mongoClient.db.collection('vocationalTests')

        await vocationalTestsCollection.updateOne(
            { _id: new ObjectId(testID) },
            {
                $push: {
                    selectedProgramsList: programName
                }
            }
        )
        return { }
    } catch (error) {
        return { errorAddProgram: error.message }
    }
}

export const getVocationalTestListDB = async ({ rangeStart, rangeEnd }) => {
    try {
        const mongoClient = await connectToDatabase()
        const vocationalTestsCollection = mongoClient.db.collection('vocationalTests')

        const testsList = await vocationalTestsCollection.find(
            {
                $and: [
                    { startedAt: { $gte: rangeStart } },
                    { startedAt: { $lte: rangeEnd } }
                ]
            }
        ).toArray()

        return { testList: testsList }
    } catch (error) {
        return { error: error.message }
    }
}

export const getVocationalTestListByUserEmailDB = async ({ userEmail = '' }) => {
    try {
        const mongoClient = await connectToDatabase()
        const vocationalTestsCollection = mongoClient.db.collection('vocationalTests')

        const testsList = await vocationalTestsCollection.find({ userEmail }, {
            projection: {
                _id: true,
                completedAt: true,
                startedAt: true
            }
        }).toArray()

        return { testsList }
    } catch (error) {
        return { errorGetTestsList: error.message }
    }
}

export const getVocationalTestByIDDB = async ({ testID = '' }) => {
    try {
        const mongoClient = await connectToDatabase()
        const vocationalTestsCollection = mongoClient.db.collection('vocationalTests')

        const _id = new ObjectId(testID)

        const test = await vocationalTestsCollection.findOne({ _id })
        if (!test) throw new Error('test not found')

        return { test }
    } catch (error) {
        return { errorGetTest: error.message }
    }
}

export const asignEmailToVocationalTestDB = async ({ userID = '', email = '' }) => {
    try {
        const mongoClient = await connectToDatabase()
        const vocationalTestsCollection = mongoClient.db.collection('vocationalTests')

        await vocationalTestsCollection.updateMany(
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

export const deleteAllVocationalTestWithAnonimousUserID = async ({ anonimousUserID = '' }) => {
    try {
        const mongoClient = await connectToDatabase()
        const vocationalTestsCollection = mongoClient.db.collection('vocationalTests')

        await vocationalTestsCollection.deleteOne({ anonimousUserID })
        return { }
    } catch (error) {
        console.log(error)
        return { error: error.message }
    }
}
