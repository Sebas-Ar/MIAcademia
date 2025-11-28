import { getSuggestionList, incrementAnGetSuggestionAleatory, updateSuggestionList } from '@/backend/controllers/suggestions.controller'

const handlerSuggestions = async (req, res) => {
    switch (req.method) {
        case 'GET':
            return await getSuggestionList(req, res)
        case 'PUT':
            return await updateSuggestionList(req, res)
        case 'PATCH':
            return await incrementAnGetSuggestionAleatory(req, res)
        default:
            res.status(429).json({
                messge: 'no http method enable'
            })
    }
}

export default handlerSuggestions
