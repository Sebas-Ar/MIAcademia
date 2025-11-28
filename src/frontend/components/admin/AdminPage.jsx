'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import IAConfig from '@/frontend/components/admin/IAConfig'
import Footer from '@/frontend/components/footer/Footer'
import Header from '@/frontend/components/header/Header'
import MenuMain from '@/frontend/components/navigation/MainMenu'
import { useRouter } from 'next/navigation'

const AdminPage = ({ isBetaActive = true }) => {
    const router = useRouter()
    const session = useSession()

    useEffect(() => {
        if (session.status === 'unauthenticated' || session?.data?.user?.role === 'user') {
            router.push('/login')
        }
    }, [session, router])

    // if (isBetaActive) {
    //         return <CodePage />
    //     }

    if (session?.data?.user?.role === 'admin') {
        return (
            <div className='page'>

                <MenuMain />

                <Header
                    isChatEnabled={true}
                    programMode={false}
                    showSubtitle={false}
                    showDescription={false}
                />
                <IAConfig />

                <Footer />

                <style jsx>{`
                    .page {
                        background-color: var(--white);
                        min-height: 100dvh;
                        display: grid;
                        grid-template-rows: auto 1fr auto;
                    }
                `}</style>
            </div>
        )
    }

    return <></>
}

export default AdminPage
