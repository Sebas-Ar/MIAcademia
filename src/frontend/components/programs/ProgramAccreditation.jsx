import { CircleAlert } from 'lucide-react'
import InformationIcon from '../information/InformationIcon'

const ProgramAccreditation = ({ program }) => {
    const accreditationInfo = {
        'alta calidad': {
            borderColor: 'var(--yellow)',
            description: 'Acreditación en Alta Calidad: Sello de excelencia. Es un reconocimiento voluntario y superior que certifica la excelencia académica, la organización y la mejora continua de un programa o institución.',
            level: 'excelente'
        },
        'registro calificado': {
            borderColor: 'var(--blue)',
            description: 'Registro Calificado: Licencia obligatoria. Garantiza que el programa cumple con las condiciones mínimas de ley para funcionar, otorgada por el Ministerio de Educación.',
            level: 'básico'
        },
        previa: {
            borderColor: 'var(--gray)',
            description: 'Acreditación Previa: Concepto histórico. Era un requisito inicial para programas nuevos, hoy integrado dentro del proceso de obtención del Registro Calificado.',
            level: 'histórico'
        },
        'n/a': {
            borderColor: 'var(--gray)',
            description: 'N/A (No Aplica): Verificar con atención. Indica la ausencia de una credencial. Es normal para la Acreditación de Alta Calidad (que es voluntaria), pero es una alerta crítica si se refiere al Registro Calificado (que es obligatorio).',
            level: 'no disponible'
        }
    }

    const currentAccreditation = program?.accreditation?.toLowerCase() || 'n/a'
    const info = accreditationInfo[currentAccreditation] || accreditationInfo['n/a']

    return (
        <div className="relative z-11" role="region" aria-labelledby="accreditation-title">
            <h3
                id="accreditation-title"
                className="text-[1.2em] text-(--dark-blue) rounded-lg text-center grid relative"
            >
                <span className="absolute top-0 -translate-y-[45%] text-[0.7em] font-semibold bg-(--light-blue) py-[0.2em] px-[1em] justify-self-center capitalize tracking-wider">
                    Acreditación
                </span>
                <span
                    className="font-bold border-[0.2em] rounded-lg py-[0.5em] px-[2em] uppercase tracking-wider"
                    style={{ borderColor: info.borderColor }}
                    aria-label={`Estado de acreditación: ${program?.accreditation}. Nivel: ${info.level}`}
                >
                    {program?.accreditation}
                </span>
            </h3>

            <InformationIcon
                icon={<CircleAlert size="1.5em" aria-hidden="true" />}
                text={info.description}
                minWidth="20em"
                ariaLabel={`Información sobre ${program?.accreditation}`}
            />
        </div>
    )
}

export default ProgramAccreditation
