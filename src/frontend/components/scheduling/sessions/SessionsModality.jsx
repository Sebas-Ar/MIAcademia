import { Camera, MapPin, Phone } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import SessionsModalityOptions from './SessionsModalityOptions'

const SessionsModality = ({
    agendaSlots = []
}) => {
    const { setValue, watch } = useFormContext()
    const selectedModality = watch('modality')

    const modalities = [
        {
            value: 'virtual',
            icon: <Camera size="1.6em" strokeWidth=".15em" />,
            title: 'Virtual',
            description: 'Google Meet',
            disabled: !agendaSlots?.slots?.some(slot => slot.modality === 'virtual')
        },
        {
            value: 'llamada',
            icon: <Phone size="1.6em" strokeWidth=".15em" />,
            title: 'Telefónica',
            description: 'Llamada directa',
            disabled: !agendaSlots?.slots?.some(slot => slot.modality === 'llamada')
        },
        {
            value: 'presencial',
            icon: <MapPin size="1.6em" strokeWidth=".15em" />,
            title: 'Presencial',
            description: 'En nuestras oficinas',
            disabled: !agendaSlots?.slots?.some(slot => slot.modality === 'presencial')
        }
    ]

    return <article>
        <ul>
            {modalities.map((modality) => (
                <SessionsModalityOptions
                    key={modality.value}
                    agendaSlots={agendaSlots}
                    icon={modality.icon}
                    title={modality.title}
                    description={modality.description}
                    isDiabled={modality.disabled}
                    isSelected={selectedModality === modality.value}
                    onClick={() => {
                        if (!modality.disabled) {
                            setValue('modality', modality.value)
                        }
                    }}
                />
            ))}
        </ul>

        <style jsx>{`
            article {
                
            }

            ul {
                display: grid;
                gap: 1em;
                grid-template-columns: repeat(auto-fit, minmax(14em, 1fr));
            }
        `}</style>
    </article>
}

export default SessionsModality
