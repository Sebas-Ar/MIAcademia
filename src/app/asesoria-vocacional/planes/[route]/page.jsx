import { getPlanByRouteDB } from '@/backend/db/plans.db'
import PlanPageContent from '@/frontend/components/counseling/planPage/PlanPageContent'
import PlanPageHeader from '@/frontend/components/counseling/planPage/PlanPageHeader'
import { Briefcase, Compass, Lightbulb, Rocket, Users } from 'lucide-react'

export const metadata = {
    title: 'Ruta Vocacional Completa | Descubre tu propósito y diseña tu plan de vida',
    description: 'Vive una experiencia completa de orientación vocacional con 7 sesiones personalizadas para descubrir tu propósito, explorar carreras y planificar tu futuro profesional',
    alternates: {
        canonical: 'https://www.miacademia.ai/asesoria-vocacional/planes/ruta-vocacional-completa'
    }
}

const indexPage = async ({ params }) => {
    const { plan, errorGetPlan } = await getPlanByRouteDB({ route: params.route })
    console.log(plan.detailList)

    if (errorGetPlan || !plan) {
        return <div>Error loading plan data.</div>
    }

    let icon = <></>

    switch (plan.route) {
        case 'ruta-vocacional-completa':
            icon = <Compass size="65%" strokeWidth=".15em" />
            break
        case 'proyecta-tu-potencial':
            icon = <Rocket size="65%" strokeWidth=".15em" />
            break
        case 'impulsa-tu-perfil-profesional':
            icon = <Briefcase size="65%" strokeWidth=".15em" />
            break
        case 'exploracion-grupal':
            icon = <Users size="65%" strokeWidth=".15em" />
            break
        case 'descubrete-y-decide':
            icon = <Lightbulb size="65%" strokeWidth=".15em" />
            break
        // Add cases for other routes if needed
        default:
            icon = <Compass size="65%" strokeWidth=".15em" />
    }

    return <div>
        <PlanPageHeader
            icon={icon}
            title={plan.title}
            description={plan.description}
            sessions={plan.sessionsNumber}
            duration={plan.sessionTime}
            sessionTimeUnit={plan.sessionTimeUnit}
            price={plan.price}
            currency="COP"
            isPopular={plan.isPopular}
            buttonText="Comenzar Ahora"
            route={plan.route}
        />
        <PlanPageContent
            detailList={plan.detailList}
            benefitsList={plan.benefitsList}
            price={plan.price}
            sessions={plan.sessionsNumber}
            duration={plan.sessionTime}
            modalidad={plan.modalidad}
            entities={plan.entities}
            route={plan.route}
        />
    </div>
}

export default indexPage
