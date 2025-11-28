import { getChatProgramsDB } from '@/backend/db/chat.db'
import { ObjectId } from 'mongodb'

export default async function handler (req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            message: 'Method not allowed'
        })
    }

    const { chatID } = req.query
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 8

    // Validar que chatID sea un ObjectId válido
    if (!chatID || !ObjectId.isValid(chatID)) {
        return res.status(400).json({
            message: 'chatID inválido',
            error: 'El chatID debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)'
        })
    }

    try {
        const { programs, total, errorGetPrograms } = await getChatProgramsDB({
            chatID,
            page,
            limit
        })

        if (errorGetPrograms) {
            throw new Error(errorGetPrograms)
        }

        const hasMore = (page * limit) < total
        return res.status(200).json({
            programs,
            total,
            page,
            limit,
            hasMore,
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener programas',
            error: error.message
        })
    }
}
