import Anthropic from '@anthropic-ai/sdk'

const { CLAUDE_API_KEY } = process.env

if (!CLAUDE_API_KEY) {
    throw new Error(
        'Please define the CLAUDE_API_KEY environment variable inside .env.local'
    )
}

const clientClaude = new Anthropic({
    apiKey: CLAUDE_API_KEY
})

export default clientClaude
