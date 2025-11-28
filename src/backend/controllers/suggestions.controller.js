import { getAleatorySuggestions, getSugggestionListDB, incrementSelectedSuggestion, updateSuggestionsDB } from '@/backend/db/suggetions.db'
import { connectToDatabase } from '../clients/miaDB'

export const getSuggestionList = async (req, res) => {
    try {
        const mongoClient = await connectToDatabase()
        const { suggestionsList, errGetSuggestionList } = await getSugggestionListDB(mongoClient)
        if (errGetSuggestionList) throw new Error(errGetSuggestionList)

        res.json({
            message: 'success',
            suggestionsList
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: 'error',
            error: error.message
        })
    }
}

export const incrementAnGetSuggestionAleatory = async (req, res) => {
    const { suggestionID } = req.body

    try {
        const mongoClient = await connectToDatabase()
        const { errorIncrement } = await incrementSelectedSuggestion(mongoClient, suggestionID)
        if (errorIncrement) throw new Error(errorIncrement)

        const { suggestionsList, errorGetAleatory } = await getAleatorySuggestions(mongoClient)
        if (errorGetAleatory) throw new Error(errorGetAleatory)

        // assign suggestions to input and chatResponse components
        const suggestions = {
            input: suggestionsList.slice(0, 3),
            chatResponse: suggestionsList.slice(3, 6)
        }

        res.json({
            message: 'success',
            suggestions
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: 'error',
            error: error.message
        })
    }
}

export const updateSuggestionList = async (req, res) => {
    const { newSuggestionList } = req.body

    try {
        const mongoClient = await connectToDatabase()
        const { errorUpdateSuggestions } = await updateSuggestionsDB(mongoClient, newSuggestionList)
        if (errorUpdateSuggestions) throw new Error(errorUpdateSuggestions)

        res.json({
            message: 'success'
        })
    } catch (error) {
        res.json({
            message: 'error',
            error: error.message
        })
    }
}
