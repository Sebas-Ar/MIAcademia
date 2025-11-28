import ServiceConditions from '@/frontend/components/termsConditions/ServiceConditions'

export const metadata = {
    title: 'Condiciones del servicio | MIAcademia',
    description: 'Tu asistente experto para explorar los programas académicos de educación superior',
    alternates: {
        canonical: 'https://www.miacademia.ai/terminos-condiciones/condiciones-del-servicio'
    }
}

const Page = () => {
    return <ServiceConditions />
}

export default Page
