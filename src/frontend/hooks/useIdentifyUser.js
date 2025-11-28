'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { getUserIdentification } from '../utils/user'

export const useIdentifyUser = () => {
    const [isLogging, setIsLogging] = useState(false)
    const [userEmail, setUserEmail] = useState(null)
    const [anonimousUserID, setanonimousUserID] = useState(null)
    const [id, setId] = useState(null)

    // auth
    const session = useSession()

    useEffect(() => {
        const { userID, email, _id } = getUserIdentification({ session })
        console.log(session.status)

        setUserEmail(email || null)
        setanonimousUserID(userID || null)
        setId(_id || null)

        const updateVocationalTestFromAnonimousUserIDWithEmail = async () => {
            const response = await fetch('/api/vocational-test/email', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userID, email })
            })
            await response.json()
        }

        const updateChatMIAFromAnonimousUserIDWithEmail = async () => {
            const response = await fetch('/api/mia/email', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userID, email })
            })
            await response.json()
        }

        if (session.status === 'authenticated') {
            if (userID && email) {
                updateVocationalTestFromAnonimousUserIDWithEmail()
                updateChatMIAFromAnonimousUserIDWithEmail()

                localStorage.removeItem('anonimousUserID')
                // is necesary reload to update data (refetch data) it can be improved
                window.location.reload()
            }
            setIsLogging(true)
        }
    }, [session])

    return { anonimousUserID, userEmail, isLogging, id }
}
