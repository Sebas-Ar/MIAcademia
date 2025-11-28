import { Repeat } from 'lucide-react'
import { Suspense } from 'react'
import Cat from '../decoration/Cat'
import ProgramaMapWrapper from './ProgramaMapWrapper'
import ProgramItemWrapper from './ProgramItemWrapper'
import ProgramLink from './ProgramLink'
import ProgramPrice from './ProgramPrice'
import ProgramVariantsToggle from './ProgramVariantsToggle'
import SimilarProgramsLoader from './SimilarProgramsLoader'

const ProgramContent = ({
    program,
    variants = []
}) => {
    return (
        <section
            className="grid justify-items-center relative pb-8"
            aria-label="Información del programa"
        >
            <ProgramPrice
                program={program}
            />

            <ProgramaMapWrapper
                program={program}
            />

            <ProgramVariantsToggle
                variants={variants}
                currentProgramID={program?.programID}
            />

            <ProgramLink
                program={program}
            />

            {program?.programID && (
                <Suspense fallback={
                    <ProgramItemWrapper
                        icon={<Repeat strokeWidth=".12em" size="2em" aria-hidden="true" />}
                        titleLine1="Programas similares"
                        description="Otras opciones que podrían interesarte"
                    >
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                        </div>
                    </ProgramItemWrapper>
                }>
                    <SimilarProgramsLoader programID={program.programID} />
                </Suspense>
            )}

            <Cat />
        </section>
    )
}

export default ProgramContent
