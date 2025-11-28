import OpenAI from 'openai'

const { DEEPSEEK_API_KEY } = process.env

if (!DEEPSEEK_API_KEY) {
    throw new Error(
        'Please define the DEEPSEEK_API_KEY environment variable inside .env.local'
    )
}

const clientDeepSeek = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    // apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
    apiKey: DEEPSEEK_API_KEY // This is the default and can be omitted
})

export default clientDeepSeek
