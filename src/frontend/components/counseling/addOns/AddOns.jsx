import { Clock, HeartHandshake, Sparkles, Star } from 'lucide-react'
import AddOnsHeader from './AddOnsHeader'
import AddOnsItems from './AddOnsItems'

const AddOns = () => {
    return <section>
        <AddOnsHeader />
        <AddOnsItems items={[
            {
                icon: <Star size="50%" strokeWidth=".15em" />,
                iconBackgroundColor: 'var(--yellow)',
                title: 'Certificado de Participación',
                description: 'Documento oficial que valida tu proceso de orientación vocacional'
            },
            {
                icon: <Sparkles size="50%" strokeWidth=".15em" />,
                iconBackgroundColor: 'var(--green)',
                title: 'Informe Vocacional Digital',
                description: 'Reporte completo y personalizado con todos tus resultados'
            },
            {
                icon: <Clock size="50%" strokeWidth=".15em" />,
                iconBackgroundColor: 'var(--blue)',
                title: 'Asesorías Adicionales',
                description: 'Sesiones individuales de 60 minutos - $40.000/hora'
            },
            {
                icon: <HeartHandshake size="50%" strokeWidth=".15em" />,
                iconBackgroundColor: 'var(--red)',
                title: 'Taller para Padres',
                description: 'Orientación especializada para acompañar el proceso vocacional'
            }
        ]} />

        <style jsx>{`
            section {
                padding: 5em 0;
            }
        `}</style>
    </section>
}

export default AddOns
