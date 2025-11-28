import { getSimilarProgramsDB } from '@/backend/db/progams.db'
import { Repeat } from 'lucide-react'
import ProgramItemWrapper from './ProgramItemWrapper'
import SimilarPrograms from './SimilarPrograms'

const SimilarProgramsLoader = async ({ programID }) => {
    const { similarPrograms } = await getSimilarProgramsDB({
        programID,
        limit: 6,
        random: true
    })

    if (!similarPrograms || similarPrograms.length === 0) return null

    return (
        <ProgramItemWrapper
            icon={<Repeat strokeWidth=".12em" size="2em" aria-hidden="true" />}
            titleLine1="Programas similares"
            description="Otras opciones que podrían interesarte"
        >
            <SimilarPrograms programs={similarPrograms} />
        </ProgramItemWrapper>
    )
}

export default SimilarProgramsLoader
