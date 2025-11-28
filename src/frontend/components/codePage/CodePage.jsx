import { useState } from 'react'

import AccessLayout from '@/frontend/layouts/access/AccessLayout'
import FormAccessWrapper from '@/frontend/wrappers/FormAccessWrapper'
import CodeForm from './CodeForm'

// import { useCookies } from 'react-cookie'

const CodePage = () => {
    // const [, setCookie] = useCookies(['user'])

    const [errorResponse, setErrorResponse] = useState('')
    const [otp, setOtp] = useState('')

    const sendCode = async (e) => {
        e.preventDefault()
        setErrorResponse('')
        try {
            const response = await fetch('/api/code', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: otp.toUpperCase() })
            })
            const data = await response.json()

            if (otp === data.code) {
                // maxAge to 72 hours
                // setCookie('user', 'access', { path: '/', maxAge: 2592000 })
                window.location.reload()
            } else {
                setErrorResponse('Código incorrecto')
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return <AccessLayout>
        <FormAccessWrapper
            handleSubmit={null}
            sendRequest={sendCode}
        >
            <CodeForm
                errorResponse={errorResponse}
                setOtp={setOtp}
                otp={otp}
            />
        </FormAccessWrapper>
    </AccessLayout>
}

export default CodePage
