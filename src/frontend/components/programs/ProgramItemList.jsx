import { formatDuration } from '@/frontend/utils/formatProgramData'
import { PersonStanding, Timer } from 'lucide-react'
import ProgramItem from './ProgramItem'

const ProgramItemList = ({
    program
}) => {
    return (
        <ul
            className="z-111 max-w-[50em] flex flex-wrap justify-center gap-[2em] mx-[1em] relative"
            role="list"
            aria-label="Características principales del programa"
        >
            <ProgramItem
                propertyName='duración'
                propertyValue={formatDuration(program?.duration)?.durationFormated}
                icon={<Timer strokeWidth=".15em" size="1.6em" />}
                info={formatDuration(program?.duration)?.info}
                ariaLabel={`Duración del programa: ${formatDuration(program?.duration)?.durationFormated}`}
            />

            <ProgramItem
                propertyName='modalidad'
                propertyValue={program?.modality}
                icon={<PersonStanding strokeWidth=".15em" size="1.6em" />}
                infoOptions={[
                    {
                        value: 'presencial',
                        info: 'Vive la experiencia universitaria al máximo con interacción directa, clases en campus y horarios establecidos. Ideal para una inmersión total'
                    },
                    {
                        value: 'virtual',
                        info: 'Estudia 100% en línea desde cualquier lugar. Disfruta de flexibilidad total en tus horarios y desarrolla una alta autogestión'
                    },
                    {
                        value: 'a distancia',
                        info: 'Combina el estudio autónomo con encuentros presenciales o virtuales programados. Aprende a tu ritmo con el apoyo de centros regionales y tutores'
                    },
                    {
                        value: 'híbrido',
                        info: 'Obtén lo mejor de dos mundos. Mezcla clases presenciales en el campus con actividades virtuales para una mayor flexibilidad y una experiencia de aprendizaje enriquecida'
                    }
                ]}
                inverted={true}
                ariaLabel={`Modalidad del programa: ${program?.modality}`}
            />
        </ul>
    )
}

export default ProgramItemList
