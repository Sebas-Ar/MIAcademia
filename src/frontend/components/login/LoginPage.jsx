'use client'

import { signIn, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'

import LoginForm from '@/frontend/components/auth/LoginForm'
import AccessLayout from '@/frontend/layouts/access/AccessLayout'
import FormAccessWrapper from '@/frontend/wrappers/FormAccessWrapper'
import { useRouter } from 'next/navigation'

const LoginPage = ({ isBetaActive = true }) => {
    const session = useSession()
    const router = useRouter()
    const [errorResponse, setErrorResponse] = useState('')

    useEffect(() => {
        if (session.status === 'authenticated' && session?.data?.user?.role === 'admin') {
            router.push('/admin')
        }
    }, [session, router])

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const sendLoginRequest = async (data) => {
        setErrorResponse('')
        let res
        try {
            res = await signIn('credentials', {
                username: data.username,
                password: data.password,
                callbackUrl: '/',
                redirect: false
            })
            if (res.ok) {
                router.push('/admin')
            }
            if (res.error) {
                setErrorResponse(res.error)
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    // if (isBetaActive) {
    //         return <CodePage />
    //     }

    if (session?.data?.user?.role === 'admin') return <></>

    return <AccessLayout title="Login | MIAcademia">
        <FormAccessWrapper
            handleSubmit={handleSubmit}
            sendRequest={sendLoginRequest}
        >
            <LoginForm
                errorResponse={errorResponse}
                errors={errors}
                register={register}
            />
        </FormAccessWrapper>
    </AccessLayout>
}

export default LoginPage
