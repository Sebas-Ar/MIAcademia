import mongoose from 'mongoose'

const { MONGODB_URI, MONGODB_DB } = process.env

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    )
}

if (!MONGODB_DB) {
    throw new Error(
        'Please define the MONGODB_DB environment variable inside .env.local'
    )
}

let cachedMongoose = global.mongoose

if (!cachedMongoose) {
    cachedMongoose = global.mongoose = { conn: null, promise: null }
}

export async function connectToMongoose () {
    if (cachedMongoose.conn) {
        return cachedMongoose.conn
    }

    if (!cachedMongoose.promise) {
        const options = {
            dbName: MONGODB_DB,
            maxPoolSize: 10, // Usa maxPoolSize en lugar de bufferMaxEntries
            retryWrites: true // retryWrites en lugar de reconnectTries
        }

        cachedMongoose.promise = mongoose.connect(MONGODB_URI, options).then((mongooseInstance) => {
            return mongooseInstance
        })
    }
    cachedMongoose.conn = await cachedMongoose.promise
    return cachedMongoose.conn
}
