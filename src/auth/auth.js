import { createUserDB, getUserDB, userAlreadyExist } from '@/backend/db/users.db'
import { getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            authorize (credentials, req) {
                if (credentials.username === process.env.USERNAME_ADMIN &&
                     credentials.password === process.env.PASSWORD_ADMIN) {
                    return {
                        id: 1,
                        name: 'admin',
                        email: 'admin@admin.com',
                        role: 'admin'
                    }
                }

                throw new Error('Usuario o contraseña incorrectos')
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    session: { jwt: true },
    callbacks: {
        async jwt ({ session, token, user, account, profile, isNewUser, trigger }) {
            if (user) {
                token.role = user?.role || 'user'
            }

            if (account?.provider === 'google') {
                const isUserExist = await userAlreadyExist({ email: user?.email, googleID: user?.id })

                if (!isUserExist) {
                    await createUserDB({
                        googleID: user?.id,
                        name: user?.name,
                        email: user?.email,
                        image: user?.image
                    })

                    token.isNewUser = true
                }

                const { errorGetUser, userData } = await getUserDB({ email: user?.email })
                if (errorGetUser) token.phone = ''
                token.phone = userData.phone || ''
            }

            // update session data, it can be used to handler user behaibior
            // ej: handle firt login to request complete user data
            // in "session" is the data to update.
            if (trigger === 'update') {
                token = { ...token, ...session }
                return token
            }

            return token
        },
        async session ({ session, token, isNewUser }) {
            if (token?.role) {
                session.user.role = token.role || 'user'
            }

            session.user.isNewUser = Boolean(token?.isNewUser)
            session.user.phone = token?.phone

            return session
        }
        // async signIn (user, account, profile) {
        //     console.log({ user })
        //     return false
        // }
    },
    secret: process.env.AUTH_SECRET

}

export const getSession = () => getServerSession(authOptions)
