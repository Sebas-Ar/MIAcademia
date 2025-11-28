import OpenAI from 'openai'

const { OPENIA_API_KEY } = process.env

if (!OPENIA_API_KEY) {
    throw new Error(
        'Please define the OPENIA_API_KEY environment variable inside .env.local'
    )
}

const clientOpenaIA = new OpenAI({
    // apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
    apiKey: OPENIA_API_KEY // This is the default and can be omitted
})

export default clientOpenaIA
