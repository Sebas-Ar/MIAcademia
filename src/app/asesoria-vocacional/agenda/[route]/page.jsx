import { authOptions } from '@/auth/auth'
import { getPlanByRouteDB } from '@/backend/db/plans.db'
import { getUserDB } from '@/backend/db/users.db'
import SchedulingPage from '@/frontend/components/scheduling/SchedulingPage'
import { getServerSession } from 'next-auth'

export const metadata = {
    title: 'Asesoría Vocacional',
    description: '¿No sabes qué estudiar? Nuestros psicólogos te guían paso a paso con asesorías vocacionales personalizadas. Elige el plan que mejor se adapte a ti',
    alternates: {
        canonical: 'https://www.miacademia.ai/asesoria-vocacional'
    }
}

const schedulingPage = async ({ params }) => {
    const { plan, errorGetPlan } = await getPlanByRouteDB({ route: params.route })

    const getInitialData = async () => {
        let userData = null
        const session = await getServerSession(authOptions)
        if (session?.user?.email) {
            const { userData: user, errorGetUser } = await getUserDB({ email: session.user.email })
            if (errorGetUser) throw new Error(errorGetUser)
            userData = user
        }

        return JSON.parse(JSON.stringify({ userData }))
    }

    const { userData } = await getInitialData()

    if (errorGetPlan || !plan) {
        return <div>Error loading plan data.</div>
    }

    return <SchedulingPage userData={userData} planData={plan} />
}

export default schedulingPage
