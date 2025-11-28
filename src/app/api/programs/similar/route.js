import { getSimilarProgramsDB } from '@/backend/db/progams.db'
import { NextResponse } from 'next/server'

export async function GET (request) {
    try {
        const { searchParams } = new URL(request.url)
        const programID = searchParams.get('programID')
        const limit = parseInt(searchParams.get('limit')) || 6

        if (!programID) {
            return NextResponse.json(
                { error: 'programID es requerido' },
                { status: 400 }
            )
        }

        const { similarPrograms, errorGetSimilarPrograms } = await getSimilarProgramsDB({
            programID,
            limit,
            random: true
        })

        if (errorGetSimilarPrograms) {
            return NextResponse.json(
                { error: errorGetSimilarPrograms },
                { status: 500 }
            )
        }

        return NextResponse.json({
            programs: similarPrograms || []
        })
    } catch (error) {
        console.error('Error en API similar programs:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
