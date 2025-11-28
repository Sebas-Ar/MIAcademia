import { getProgramDB, getProgramVariantsDB } from '@/backend/db/progams.db'
import Banner from '../banner/Banner'
import ProgramContent from './ProgramContent'
import ProgramHeader from './ProgramHeader'

const Program = async ({
    params,
    searchParams
}) => {
    const resolvedParams = await params
    const resolvedSearchParams = await searchParams
    const { slug, institute } = resolvedParams

    // Flujo único: si hay ?id= lo usamos, sino buscamos por slug
    const programID = resolvedSearchParams?.id
    const programSlug = !programID ? slug : undefined
    const instituteSlug = !programID ? institute : undefined

    const getProgramAndSuggestions = async () => {
        // await new Promise(resolve => setTimeout(resolve, 5000))
        try {
            const { program, errorGetProgram } = await getProgramDB({ programID, programSlug, instituteSlug })
            if (errorGetProgram) throw new Error(errorGetProgram)

            // Siempre obtener variantes para detectar si hay múltiples programas con el mismo slug
            let variants = []
            if (program?.programSlug && program?.instituteSlug) {
                const { variants: programVariants, errorGetVariants } = await getProgramVariantsDB({
                    programSlug: program.programSlug,
                    instituteSlug: program.instituteSlug
                })
                if (!errorGetVariants && programVariants?.length > 1) {
                    variants = programVariants
                }
            }

            return JSON.parse(JSON.stringify({ program, variants }))
        } catch (error) {
            return JSON.parse(JSON.stringify({}))
        }
    }

    const { program, variants } = await getProgramAndSuggestions()

    return <article className="bg-(--white) pt-[4.5em]">
        <ProgramHeader
            program={program}
        />

        <ProgramContent
            program={program}
            variants={variants}
        />

        <Banner>
            <div className="addsBottom">

            </div>
        </Banner>
    </article>
}

export default Program
