import { uid } from 'uid'

export const getUserIdentification = ({
    session = {}
}) => {
    console.log(session?.data)
    if (session.status === 'loading') return {}

    let userID = localStorage.getItem('anonimousUserID')
    if (session?.data?.user?.email) {
        return {
            email: session.data.user.email,
            userID,
            _id: session?.data?.user?.id || null
        }
    }

    if (!userID) {
        userID = uid(24)
        localStorage.setItem('anonimousUserID', userID)
    }
    return {
        userID,
        email: null
    }
}
