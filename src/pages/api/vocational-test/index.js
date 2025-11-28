import { generateVocationalTestResult, getVocationalTestList, intializeVocationalTest } from '@/backend/controllers/vocationalTest.controller'

const handler = async (req, res) => {
    switch (req.method) {
        case 'GET':
            return await getVocationalTestList(req, res)
        case 'POST':
            return await intializeVocationalTest(req, res)
        case 'PATCH':
            return await generateVocationalTestResult(req, res)
        default:
            res.status(429).json({
                messge: 'no http method enable'
            })
    }
}

export default handler
