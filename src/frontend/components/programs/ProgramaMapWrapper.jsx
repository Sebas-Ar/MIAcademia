'use client'

import { MapPinned } from 'lucide-react'
import { useState } from 'react'
import ProgramItemWrapper from './ProgramItemWrapper'
import ProgramMap from './ProgramMap'

const ProgramaMapWrapper = ({
    program = {}
}) => {
    const [hasMapLocation, setHasMapLocation] = useState(true) // Empezar en true para que se renderice y pueda verificar

    return (
        <>
            {hasMapLocation !== false && // Mostrar mientras sea true o null (cargando)
                <ProgramItemWrapper
                    icon={<MapPinned strokeWidth=".12em" size="2em" />}
                    titleLine1='Conoce las sedes de la institución'
                    description='Ubicaciones donde se ofrece el programa en esta ciudad'
                    isFullWidth
                >
                    <ProgramMap
                        program={program}
                        onLocationAvailable={setHasMapLocation}
                    />
                </ProgramItemWrapper>
            }
            {hasMapLocation === false &&
                <ProgramItemWrapper
                    icon={<MapPinned strokeWidth=".12em" size="2em" />}
                    titleLine1="Ubicación"
                    titleLine2={program.location || 'No disponible'}
                    isFullWidth
                >
                    <></>
                </ProgramItemWrapper>
            }
        </>
    )
}

export default ProgramaMapWrapper
