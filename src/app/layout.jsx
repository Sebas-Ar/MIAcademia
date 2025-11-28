// styles
// Importa primero los CSS base del proyecto y al final Tailwind (globals.css)
import '@/frontend/styles/animations.css'
import '@/frontend/styles/globals.css'
import '@/frontend/styles/responsive.css'
import '@/frontend/styles/root.css'
// font
import { Poppins } from 'next/font/google'
// jsx registry
import StyledJsxRegistry from '@/config/registryJSX'
// view transitions
import { ViewTransitions } from 'next-view-transitions'
// auth
import Providers from '@/auth/Provider'
import { getSession } from '@/auth/auth'
// google Tag Manager
import { GoogleTagManager } from '@next/third-parties/google'
import { Toaster } from 'sonner'

const poppins = Poppins({
    variable: '--font-poppins',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin']
})

export const metadata = {
    metadataBase: new URL('https://www.miacademia.ai'),
    title: 'MIAcademia',
    description: 'Tu asistente experto para explorar los programas académicos de educación superior',
    keywords: 'miacademia, asistente, programas académicos, educación superior, test vocacional, holland, riasec, test de holland, riasec test, riasec holland test, riasec test de holland, riasec test holland, riasec test vocacional, riasec vocacional test, riasec vocacional holland test, miacademia test vocacional, miacademia test de holland, miacademia test de riasec, miacademia riasec, miacademia riasec test, miacademia riasec holland test, miacademia riasec test de holland, miacademia riasec test vocacional, miacademia vocacional test, miacademia vocacional holland test',
    author: '@MIAcademia_ai',

    twitter: {
        card: 'summary_large_image',
        site: '@MiAcademia_ai',
        creator: '@MiAcademia_ai',
        title: 'Tu asistente experto para explorar los programas académicos de educación superior',
        description: 'MIAcademia es tu asistente experto para explorar los programas académicos de educación superior. Descubre los programas académicos de educación superior que mejor se alinean con tus intereses y habilidades. ¡Explora los programas académicos de educación superior de manera personalizada y enfocada en tus objetivos!'
    },

    openGraph: {
        title: 'MIAcademia',
        description: 'Tu asistente experto para explorar los programas académicos de educación superior',
        url: 'https://www.miacademia.ai',
        site_name: 'MIAcademia',
        images: [
            {
                url: '/og-square.jpg',
                width: 800,
                height: 600,
                alt: 'MIAcademia'
            },
            {
                url: '/og-banner.jpg',
                width: 1280,
                height: 720,
                alt: 'MIAcademia'
            }
        ],
        locale: 'es_ES',
        type: 'website'
    }
}

export default async function RootLayout ({ children }) {
    const session = await getSession()

    return (
        <ViewTransitions>
            <html lang="en" style={{ fontFamily: poppins.style.fontFamily }}>
                <body>
                    <Providers session={session}>
                        <StyledJsxRegistry>
                            {children}
                            <Toaster
                                position="bottom-right"
                                toastOptions={{
                                    style: {
                                        background: 'var(--yellow)',
                                        borderColor: 'var(--dark-blue)',
                                        color: 'var(--dark-blue)',
                                        marginBottom: '2em'
                                    }
                                }}
                            />
                        </StyledJsxRegistry>
                    </Providers>
                    <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID_PROD} />
                </body>
            </html>
        </ViewTransitions>
    )
}
