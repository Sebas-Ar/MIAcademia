import { connectToMongoose } from '../clients/mongooseDB.js'
import { AgendaSlot } from '../db/models/booking.models.js'
import { User } from '../db/models/models.js'

// ====================================
// SINCRONIZAR SESIONES DEL USUARIO
// ====================================

// Obtener sesiones agendadas del usuario
export const getUserSessions = async (req, res) => {
    try {
        const { userId } = req.query

        if (!userId) {
            return res.status(400).json({
                error: 'ID de usuario requerido'
            })
        }

        await connectToMongoose()

        // Obtener sesiones directamente desde AgendaSlot (fuente de verdad)
        // Incluir tanto sesiones pre-reservadas como confirmadas del usuario
        const userSessions = await AgendaSlot.find({
            $or: [
                { pre_booked_by: userId, status: 'pre-booked' },
                { scheduled_by: userId, status: 'scheduled' }
            ]
        })
            .populate({
                path: 'planId',
                model: 'Plan',
                select: 'route title' // Solo obtener route y title del plan
            })
            .sort({ date: 1 })

        // Obtener información básica del usuario para contexto
        const user = await User.findById(userId).select('scheduledSessions')

        // Obtener información del plan de las sesiones encontradas (más confiable)
        let planName = ''
        let planRoute = ''

        if (userSessions.length > 0 && userSessions[0].planId) {
            planName = userSessions[0].planId.title || ''
            planRoute = userSessions[0].planId.route || ''
        }

        // Fallback a información del usuario si no se encontró en las sesiones
        if (!planName || !planRoute) {
            planName = user?.scheduledSessions?.planName || ''
            planRoute = user?.scheduledSessions?.planRoute || ''
        }

        // Formatear respuesta compatible con el formato anterior
        const formattedSessions = {
            planName,
            planRoute,
            globalTimeout: user?.scheduledSessions?.globalTimeout || null,
            status: user?.scheduledSessions?.status || 'pre-scheduled',
            sessions: userSessions
        }

        res.status(200).json({
            scheduledSessions: formattedSessions,
            sessions: userSessions // Para compatibilidad con el código existente
        })
    } catch (error) {
        console.error('Error getting user sessions:', error)
        res.status(500).json({
            error: 'Error al obtener sesiones del usuario',
            message: error.message
        })
    }
}

// Sincronizar sesiones locales con la base de datos
export const syncUserSessions = async (req, res) => {
    try {
        const { userId, sessionData } = req.body

        if (!userId || !sessionData) {
            return res.status(400).json({
                error: 'ID de usuario y datos de sesión requeridos'
            })
        }

        await connectToMongoose()

        // Buscar usuario
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            })
        }

        // Convertir slotIds a ObjectIds si existen
        const sessionIds = []
        if (sessionData.sessions && sessionData.sessions.length > 0) {
            for (const session of sessionData.sessions) {
                if (session.slotId) {
                    sessionIds.push(session.slotId)
                }
            }
        }

        // Actualizar datos de sesiones del usuario
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    'scheduledSessions.sessions': sessionIds
                }
            },
            {
                new: true,
                upsert: false,
                runValidators: true
            }
        ).populate({
            path: 'scheduledSessions.sessions',
            model: 'AgendaSlot'
        })

        res.status(200).json({
            message: 'Sesiones sincronizadas exitosamente',
            scheduledSessions: updatedUser.scheduledSessions
        })
    } catch (error) {
        console.error('Error syncing user sessions:', error)
        res.status(500).json({
            error: 'Error al sincronizar sesiones del usuario',
            message: error.message
        })
    }
}

// Agregar una sesión a las sesiones del usuario
export const addUserSession = async (req, res) => {
    try {
        const { userId, slotId, planId } = req.body

        if (!userId || !slotId) {
            return res.status(400).json({
                error: 'ID de usuario y slotId requeridos'
            })
        }

        await connectToMongoose()

        // Verificar que el slot existe
        const slot = await AgendaSlot.findById(slotId)
        if (!slot) {
            return res.status(404).json({
                error: 'Slot no encontrado'
            })
        }

        // Buscar usuario
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            })
        }

        // Inicializar scheduledSessions si no existe
        if (!user.scheduledSessions) {
            user.scheduledSessions = {
                sessions: []
            }
        }

        // Verificar si el slot ya está agregado
        const slotExists = user.scheduledSessions.sessions.includes(slotId)
        if (slotExists) {
            return res.status(400).json({
                error: 'El slot ya está agregado a las sesiones del usuario'
            })
        }

        // Agregar la sesión
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: { 'scheduledSessions.sessions': slotId },
                $set: {
                    'scheduledSessions.planId': planId
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).populate({
            path: 'scheduledSessions.sessions',
            model: 'AgendaSlot'
        })

        res.status(200).json({
            message: 'Sesión agregada exitosamente',
            scheduledSessions: updatedUser.scheduledSessions
        })
    } catch (error) {
        console.error('Error adding user session:', error)
        res.status(500).json({
            error: 'Error al agregar sesión del usuario',
            message: error.message
        })
    }
}

// Remover una sesión de las sesiones del usuario
export const removeUserSession = async (req, res) => {
    try {
        const { userId, slotId } = req.body

        if (!userId || !slotId) {
            return res.status(400).json({
                error: 'ID de usuario y slotId requeridos'
            })
        }

        await connectToMongoose()

        // Verificar usuario antes de la eliminación
        const userBefore = await User.findById(userId)
        if (!userBefore) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            })
        }

        // Remover la sesión
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $pull: { 'scheduledSessions.sessions': slotId }
            },
            {
                new: true,
                runValidators: true
            }
        ).populate({
            path: 'scheduledSessions.sessions',
            model: 'AgendaSlot'
        })

        if (!updatedUser) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            })
        }

        // Si no quedan sesiones, limpiar datos relacionados
        if (updatedUser.scheduledSessions.sessions.length === 0) {
            await User.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        'scheduledSessions.planName': '',
                        'scheduledSessions.planRoute': '',
                        'scheduledSessions.globalTimeout': null,
                        'scheduledSessions.status': 'pre-scheduled'
                    }
                }
            )
        }

        res.status(200).json({
            message: 'Sesión removida exitosamente',
            scheduledSessions: updatedUser.scheduledSessions
        })
    } catch (error) {
        console.error('Error removing user session:', error)
        res.status(500).json({
            error: 'Error al remover sesión del usuario',
            message: error.message
        })
    }
}

// Actualizar estado de las sesiones del usuario
export const updateUserSessionsStatus = async (req, res) => {
    try {
        const { userId, status } = req.body

        if (!userId || !status) {
            return res.status(400).json({
                error: 'ID de usuario y status requeridos'
            })
        }

        const validStatuses = ['timeout', 'pre-scheduled', 'scheduled', 'canceled', 'postponed', 'completed']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Status inválido',
                validStatuses
            })
        }

        await connectToMongoose()

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: { 'scheduledSessions.status': status }
            },
            {
                new: true,
                runValidators: true
            }
        ).populate({
            path: 'scheduledSessions.sessions',
            model: 'AgendaSlot'
        })

        if (!updatedUser) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            })
        }

        res.status(200).json({
            message: 'Status actualizado exitosamente',
            scheduledSessions: updatedUser.scheduledSessions
        })
    } catch (error) {
        console.error('Error updating user sessions status:', error)
        res.status(500).json({
            error: 'Error al actualizar status de sesiones del usuario',
            message: error.message
        })
    }
}

// Limpiar todas las sesiones del usuario
export const clearUserSessions = async (req, res) => {
    try {
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({
                error: 'ID de usuario requerido'
            })
        }

        await connectToMongoose()

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    'scheduledSessions.sessions': []
                }
            },
            {
                new: true,
                runValidators: true
            }
        )

        if (!updatedUser) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            })
        }

        res.status(200).json({
            message: 'Sesiones limpiadas exitosamente',
            scheduledSessions: updatedUser.scheduledSessions
        })
    } catch (error) {
        console.error('Error clearing user sessions:', error)
        res.status(500).json({
            error: 'Error al limpiar sesiones del usuario',
            message: error.message
        })
    }
}
