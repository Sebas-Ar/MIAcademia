import { getPlansData } from '@/backend/controllers/plans.controller'
import CounselingPage from '@/frontend/components/counseling/CounselingPage'

export const metadata = {
    title: 'Asesoría Vocacional',
    description: '¿No sabes qué estudiar? Nuestros psicólogos te guían paso a paso con asesorías vocacionales personalizadas. Elige el plan que mejor se adapte a ti',
    alternates: {
        canonical: 'https://www.miacademia.ai/asesoria-vocacional'
    }
}

const indexPage = async () => {
    const { plans, error } = await getPlansData()

    if (error) {
        console.error('Error loading plans:', error)
    }

    console.log(plans)

    return <CounselingPage plans={plans} />
}

export default indexPage
