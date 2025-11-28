import { addFavoriteToUserDB, createUserDB, deleteFavoriteToUserDB, getFavoritesByUserIDDB, notifyUserLaterDB, updateUserDB, userAlreadyExist } from '../db/users.db'

export const notifyUserLater = async (req, res) => {
    const { ...userData } = req.body
    try {
        const isUserExist = await userAlreadyExist({ email: userData.email })

        if (!isUserExist) await createUserDB({ name: userData.name, email: userData.email, phone: userData.phone })

        const { errorNotifyUserLater } = await notifyUserLaterDB({ email: userData.email, typeNotification: userData.typeNotification })
        if (errorNotifyUserLater) throw new Error(errorNotifyUserLater)

        delete userData.typeNotification
        const { modifiedUser, errorUpdateUser } = await updateUserDB({ ...userData })
        if (errorUpdateUser) throw new Error(errorUpdateUser)

        res.status(200).json({
            message: 'success',
            modifiedUser
        })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            message: 'error'
        })
    }
}

export const getFavoritesByUserID = async (req, res) => {
    const { userEmail } = req.query
    console.log({ userEmail })
    try {
        if (!userEmail) {
            throw new Error('no anonimousUserID or email')
        }

        const { userFavoritesList, errorGetUserFavoritesList } = await getFavoritesByUserIDDB({ userEmail })
        if (errorGetUserFavoritesList) throw new Error(errorGetUserFavoritesList)

        res.status(200).json({
            userFavoritesList
        })
    } catch (error) {
        console.log(error.message)
        if (error.message === 'no favorites found') res.status(204).json()
        if (error.message === 'no anonimousUserID or email') res.status(204).json()
        res.status(500).json({
            error: error.message
        })
    }
}

export const addFavoriteToUser = async (req, res) => {
    const { userEmail } = req.query
    const { program } = req.body

    try {
        const { errorAddFavorite } = await addFavoriteToUserDB({ userEmail, program })
        if (errorAddFavorite) throw new Error(errorAddFavorite)

        res.status(200).json({
            message: 'success'
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: error.message
        })
    }
}

export const deleteFavoriteToUser = async (req, res) => {
    const { userEmail } = req.query
    const { program } = req.body

    try {
        if (!userEmail || !program) {
            throw new Error('no anonimousUserID or email')
        }
        const { error } = await deleteFavoriteToUserDB({ userEmail, program })
        if (error) throw new Error(error)

        res.status(200).json({
            message: 'success'
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: error.message
        })
    }
}
