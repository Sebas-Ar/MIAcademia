import positionMap from '@/data/positionToIdMap.json'
import { permanentRedirect } from 'next/navigation'

export default async function ProgramaOldURLPage ({ params }) {
    const { position } = await params
    const programInfo = positionMap[position]

    if (programInfo) {
        // Redirect 301 permanente a la nueva URL (SEO-friendly)
        permanentRedirect(`/${programInfo.instituteSlug}/programas/${programInfo.programSlug}?id=${programInfo.programID}`)
    }

    // Si no existe, redirigir a la página principal
    permanentRedirect('/')
}
