import { ObjectId } from 'mongodb'

const suggestionsCollectionName = 'mia-suggestions'

export const incrementSelectedSuggestion = async (mongoClient, suggestionID = '') => {
    try {
        const id = new ObjectId(suggestionID)
        const miaSuggestionCollection = mongoClient.db.collection(suggestionsCollectionName)
        await miaSuggestionCollection.updateOne({ _id: id }, { $inc: { selected: 1 } })

        return {}
    } catch (error) {
        return { errorIncrement: error.messsage }
    }
}

export const getAleatorySuggestions = async (mongoClient) => {
    try {
        const miaSuggestionCollection = mongoClient.db.collection(suggestionsCollectionName)
        const suggestionsList = await miaSuggestionCollection.aggregate([{ $sample: { size: 6 } }]).toArray()
        if (!suggestionsList || suggestionsList.length === 0) throw new Error('no suggestions found')

        return { suggestionsList }
    } catch (error) {
        return { errorGetAleatory: error.message }
    }
}

export const getSugggestionListDB = async (mongoClient) => {
    try {
        const miaSuggestionCollection = mongoClient.db.collection(suggestionsCollectionName)
        const suggestionsList = await miaSuggestionCollection.find().toArray()
        if (!suggestionsList || suggestionsList.length === 0) throw new Error('no suggestions found')

        return { suggestionsList }
    } catch (error) {
        return { errGetSuggestionList: error.message }
    }
}

export const updateSuggestionsDB = async (mongoClient, newSuggestionList = []) => {
    try {
        const miaSuggestionCollection = mongoClient.db.collection(suggestionsCollectionName)
        const updatedSuggestions = newSuggestionList.map(suggestion => {
            const id = new ObjectId(suggestion._id)
            return miaSuggestionCollection.updateOne({ _id: id }, { $set: { text: suggestion.text } })
        })

        await Promise.all(updatedSuggestions)

        return { }
    } catch (error) {
        return { errorUpdateSuggestions: error.message }
    }
}
