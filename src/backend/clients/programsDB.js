import { createClient } from '@libsql/client'

const { TURSO_URL, TURSO_AUTH_TOKEN } = process.env

if (!TURSO_URL) {
    throw new Error(
        'Please define the TURSO_URL environment variable inside .env.local'
    )
}

if (!TURSO_AUTH_TOKEN) {
    throw new Error(
        'Please define the TURSO_AUTH_TOKEN environment variable inside .env.local'
    )
}

const clientProgramsDB = createClient({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
})

export default clientProgramsDB
