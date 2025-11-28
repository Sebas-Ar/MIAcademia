// import clientGroq from '@/backend/clients/groq'
// import anthropic from '../clients/claude'

import { addProgramSelectedToChatsDB, asignEmailToChatsDB, chatActive, createChatDB, getChatByIDDB, getChatsByUserIDDB, getLastChatsByUserIDDB, initialChat, ratingChatDB, updateChatDB } from '@/backend/db/chat.db'
import { getMIAConfigDB, saveMIAConfigDB } from '@/backend/db/chatConfig.db'

import { modelFunctions } from '../ia/chatCompletions'
import { generateSQLQuery } from '../ia/chatSQL'

export const initializeChat = async (req, res) => {
    const {
        date,
        anonimousUserID,
        userEmail,
        testID,
        navigator,
        question,
        suggestionID,
        filters,
        model
    } = req.body

    initialChat.date = new Date(date.replace('Z', '+05:00'))
    initialChat.navigator = navigator
    initialChat.suggestionID = suggestionID
    initialChat.model = model

    if (anonimousUserID) initialChat.anonimousUserID = anonimousUserID
    if (userEmail) initialChat.userEmail = userEmail
    if (testID) initialChat.testID = testID

    const userQuery = {
        consulta: question,
        filtros: filters
    }

    initialChat.userQuery = userQuery

    try {
        const { chatCreated, chatCreatedError } = await createChatDB({ initialChat })
        if (chatCreatedError) throw new Error(chatCreatedError)

        res.status(200).json({
            chatID: chatCreated.insertedId.toString()
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}

export const getChatByID = async (req, res) => {
    const { chatID } = req.query
    try {
        const { chat, errorGetChat } = await getChatByIDDB({ chatID })
        if (errorGetChat) throw new Error(errorGetChat)

        res.status(200).json(chat)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}

export const startChat = async (req, res) => {
    const { chatID } = req.query
    const { userQuery, model } = req.body

    chatActive.times.startRequest = new Date()

    try {
        const { SQLGenerator, responseGenerator, error } = await getMIAConfigDB()
        if (error) throw new Error(error)

        chatActive.times.startQuerySQL = new Date()
        const { data, errorSQL } = await generateSQLQuery({ chatActive, SQLGenerator, userQuery })
        chatActive.times.endQuerySQL = new Date()
        if (errorSQL) throw new Error(errorSQL)

        // Limitar a 8 programas para la respuesta de la IA
        // pero guardar todos los programas (hasta 30) en chatActive.programsList
        let dataForIA = data
        let totalPrograms = 0
        if (data) {
            const allPrograms = JSON.parse(data)
            totalPrograms = allPrograms?.rows?.length || 0
            console.log({ totalPrograms })

            if (allPrograms?.rows && allPrograms.rows.length > 8) {
                // Crear copia con solo los primeros 8 programas para la IA
                const limitedPrograms = {
                    ...allPrograms,
                    rows: allPrograms.rows.slice(0, 8)
                }
                dataForIA = JSON.stringify(limitedPrograms)
            }
        }

        const { generateResponse, clientIA } = modelFunctions[model]
        chatActive.times.startResponse = new Date()
        const { response, errorGenerateResponse } = await generateResponse({
            res,
            clientIA,
            responseGeneratorConfig: responseGenerator,
            userQuery: JSON.stringify(userQuery),
            data: dataForIA, // Enviar solo 8 programas a la IA
            totalPrograms // Total de programas encontrados
        })
        chatActive.times.endResponse = new Date()

        if (errorGenerateResponse) throw new Error(errorGenerateResponse)

        chatActive.response = response
        chatActive.times.endRequest = new Date()
        res.end()
    } catch (error) {
        chatActive.errorResponse = error.message
        console.log({ error: error.message })
        res.status(400).json({
            response: 'Error',
            message: 'error',
            error: error.message
        })
    } finally {
        const { err } = await updateChatDB({ chatActive, chatID })
        if (err) console.log(err)
        res.end()
    }
}

export const rateChat = async (req, res) => {
    const { chatID } = req.query
    const { rating, programID } = req.body

    console.log({ rating, programID, chatID })

    try {
        if (rating === true || rating === false) {
            const { errRating } = await ratingChatDB({ chatID, rating })
            if (errRating) throw new Error(errRating)
        }

        if (programID) {
            const { errAddProgram } = await addProgramSelectedToChatsDB({ chatID, programID })
            if (errAddProgram) throw new Error(errAddProgram)
        }

        res.json({
            message: 'chat updated'
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: 'error',
            err: error.message
        })
    }
}

export const getMIAConfig = async (req, res) => {
    try {
        const { SQLGenerator, responseGenerator, error } = await getMIAConfigDB()
        if (error) throw new Error(error)

        res.json({
            SQLGenerator,
            responseGenerator
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: 'error',
            error: error.message
        })
    }
}

export const updateMIAConfig = async (req, res) => {
    const { SQLGenerator, responseGenerator } = req.body
    try {
        if (!SQLGenerator && !responseGenerator) throw new Error('No hay datos para actualizar')
        const { error } = await saveMIAConfigDB({ SQLGenerator, responseGenerator })
        if (error) throw new Error(error)

        res.json({
            message: 'success'
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: 'error',
            error: error.message
        })
    }
}

export const assignEmailToChats = async (req, res) => {
    const { userID, email } = req.body

    try {
        if (!userID || !email) {
            throw new Error('no anonimousUserID or email')
        }
        const { error } = await asignEmailToChatsDB({ userID, email })
        if (error) throw new Error(error)

        res.status(200).json({
            message: 'success'
        })
    } catch (error) {
        console.log(error)
        res.status(200).json({
            message: 'error',
            error: error.message
        })
    }
}

export const getChatsByUserID = async (req, res) => {
    const { anonimousUserID, userEmail } = req.query
    try {
        const { userChatsList, errorGetUserChatsList } = await getChatsByUserIDDB({ userEmail, anonimousUserID })
        if (errorGetUserChatsList) throw new Error(errorGetUserChatsList)

        res.status(200).json({
            userChatsList
        })
    } catch (error) {
        console.log(error.message)
        if (error.message === 'no chats found') res.status(204).json()
        res.status(500).json({
            error: error.message
        })
    }
}

export const getLastChatsByUserID = async (req, res) => {
    const { anonimousUserID, userEmail } = req.query
    try {
        const { userChatsList, errorGetUserChatsList } = await getLastChatsByUserIDDB({ userEmail, anonimousUserID })
        if (errorGetUserChatsList) throw new Error(errorGetUserChatsList)

        res.status(200).json({
            userChatsList
        })
    } catch (error) {
        console.log(error.message)
        if (error.message === 'no chats found') res.status(204).json()
        res.status(500).json({
            error: error.message
        })
    }
}
