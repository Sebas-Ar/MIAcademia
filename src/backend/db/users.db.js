import { connectToDatabase } from '../clients/miaDB'

const userCollectionName = 'users'

export const getUserDB = async ({ email = '' }) => {
    try {
        const mongoClient = await connectToDatabase()
        const usersCollection = mongoClient.db.collection('users')

        const userData = await usersCollection.findOne({ email })
        return { userData }
    } catch (error) {
        console.log(error.message)
        return { errorGetUser: error.message }
    }
}

export const createUserDB = async ({
    googleID = '',
    name = '',
    email = '',
    image = ''
}) => {
    try {
        const mongoClient = await connectToDatabase()
        const usersCollection = mongoClient.db.collection(userCollectionName)

        await usersCollection.insertOne({
            name,
            email,
            image,
            googleID,
            createdAt: new Date()
        })
    } catch (error) {
        console.log(error)
    }
}

export const userAlreadyExist = async ({ email = '', googleID = '' }) => {
    try {
        const mongoClient = await connectToDatabase()
        const usersCollection = mongoClient.db.collection(userCollectionName)

        const user = await usersCollection.findOne({ email })

        if (!user) throw new Error('user not exist')

        if (googleID && !user.googleID) {
            await usersCollection.updateOne(
                { email },
                {
                    $set: {
                        googleID
                    }
                }
            )
        }

        return true
    } catch (error) {
        console.log(error.message)
        return false
    }
}

export const notifyUserLaterDB = async ({ email = '', typeNotification = '' }) => {
    try {
        const mongoClient = await connectToDatabase()
        const usersCollection = mongoClient.db.collection('users')

        await usersCollection.updateOne(
            { email },
            {
                $set: {
                    [typeNotification]: true
                }
            }
        )
        return {}
    } catch (error) {
        console.log(error)
        return { errorNotifyUserLater: error.message }
    }
}

export const updateUserDB = async (data) => {
    try {
        const mongoClient = await connectToDatabase()
        const usersCollection = mongoClient.db.collection('users')

        const { email } = data
        delete data.email

        await usersCollection.updateOne(
            { email },
            {
                $set: data
            },
            {
                returnOriginal: false

            }
        )
        return { modifiedUser: { ...data } }
    } catch (error) {
        console.log(error)
        return { errorUpdateUser: error.message }
    }
}

export const getFavoritesByUserIDDB = async ({ userEmail }) => {
    try {
        const mongoClient = await connectToDatabase()
        const usersCollection = mongoClient.db.collection(userCollectionName)

        const projection = {
            favoritesList: true
        }
        console.log({ userEmail })
        const { favoritesList } = await usersCollection.findOne({ email: userEmail }, { projection })
        if (favoritesList?.length === 0) throw new Error('no favorites found')

        return { userFavoritesList: favoritesList }
    } catch (error) {
        return { errorGetUserFavoritesList: error.message }
    }
}

export const addFavoriteToUserDB = async ({
    userEmail = '',
    program = {
        programID: '',
        programName: '',
        programType: '',
        instituteName: ''
    }
}) => {
    try {
        const mongoClient = await connectToDatabase()
        const usersCollection = mongoClient.db.collection(userCollectionName)
        await usersCollection.updateOne(
            { email: userEmail },
            {
                $push: {
                    favoritesList: program
                }
            }
        )
        return { }
    } catch (error) {
        return { errorAddFavorite: error.message }
    }
}

export const deleteFavoriteToUserDB = async ({
    userEmail = '',
    program = {
        programID: ''
    }
}) => {
    try {
        const mongoClient = await connectToDatabase()
        const usersCollection = mongoClient.db.collection(userCollectionName)
        await usersCollection.updateOne(
            { email: userEmail },
            {
                $pull: {
                    favoritesList: program
                }
            }
        )
        return { }
    } catch (error) {
        return { errorAddFavorite: error.message }
    }
}
