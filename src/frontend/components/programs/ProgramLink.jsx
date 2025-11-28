'use client'

import { Landmark } from 'lucide-react'

const { eventCategories, eventNames, triggerEvent } = require('@/frontend/googleTagManager')

const ProgramLink = ({
    program
}) => {
    const onClick = () => {
        triggerEvent(eventCategories.GENERAL_INTERACTIONS, eventNames.NAVIGATION, { programID: program?.programID })
    }

    if (!program?.urlWeb) return null

    return (
        <div className="my-[2em] mx-[1em] px-[1em]">
            <a
                href={program?.urlWeb}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClick}
                className="font-semibold bg-(--yellow) flex items-center justify-center gap-2 mx-auto rounded-full transition-all hover:scale-105 hover:shadow-lg cursor-pointer max-w-fit text-[1.3em] py-[1em] px-[1.5em]"
                aria-label={`Visitar sitio web oficial de ${program?.instituteName || 'la institución'} (se abre en una nueva ventana)`}
            >
                <Landmark strokeWidth=".12em" size="1.5em" aria-hidden="true" />
                <span className="uppercase tracking-wide leading-[1em]">
                    Sitio Web De La Institución
                </span>
            </a>
        </div>
    )
}

export default ProgramLink
