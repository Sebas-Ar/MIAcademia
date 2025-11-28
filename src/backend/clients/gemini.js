import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) throw new Error('Please define the GEMINI_API_KEY environment variable')

const clientGemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export default clientGemini
