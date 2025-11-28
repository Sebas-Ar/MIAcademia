import Groq from 'groq-sdk'

const { GROQ_API_KEY } = process.env

if (!GROQ_API_KEY) {
    throw new Error(
        'Please define the GROQ_API_KEY environment variable inside .env.local'
    )
}

const clientGroq = new Groq({
    apiKey: GROQ_API_KEY
})

export default clientGroq
