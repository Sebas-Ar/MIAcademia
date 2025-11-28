/**
 * Utilidades para manejar Optimistic Locking en el frontend
 */

/**
 * Maneja errores específicos de concurrencia y proporciona mensajes amigables al usuario
 * @param {Error} error - Error capturado
 * @param {string} operation - Tipo de operación (reservar, actualizar, liberar)
 * @returns {Object} - Objeto con información del error procesado
 */
export const handleConcurrencyError = (error, operation = 'realizar la operación') => {
    const errorMessage = error.message || error.toString()

    // Errores específicos de concurrencia (status 409)
    if (errorMessage.includes('Conflicto de concurrencia') ||
        errorMessage.includes('modificado por otro usuario') ||
        errorMessage.includes('reservado por otro usuario')) {
        return {
            type: 'concurrency',
            title: 'Slot no disponible',
            message: 'Este horario ha sido reservado por otro usuario. Por favor, selecciona un horario diferente.',
            action: 'refresh'
        }
    }

    // Errores de slot no disponible
    if (errorMessage.includes('no disponible') ||
        errorMessage.includes('ya está reservado') ||
        errorMessage.includes('temporalmente reservado')) {
        return {
            type: 'availability',
            title: 'Horario no disponible',
            message: 'Este horario ya no está disponible. Por favor, selecciona otro horario.',
            action: 'select_different'
        }
    }

    // Errores de restricciones de tiempo
    if (errorMessage.includes('restricciones de tiempo') ||
        errorMessage.includes('diferencia es menor a 2 días') ||
        errorMessage.includes('mayor a 7 días')) {
        return {
            type: 'time_restriction',
            title: 'Restricción de tiempo',
            message: 'Las sesiones deben tener entre 2 y 7 días de separación.',
            action: 'adjust_schedule'
        }
    }

    // Error genérico
    return {
        type: 'generic',
        title: 'Error al ' + operation,
        message: 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.',
        action: 'retry'
    }
}

/**
 * Reintenta una operación con backoff exponencial
 * @param {Function} operation - Función asíncrona a reintentar
 * @param {number} maxRetries - Número máximo de reintentos
 * @param {number} baseDelay - Delay base en milisegundos
 * @returns {Promise} - Resultado de la operación o error final
 */
export const retryWithBackoff = async (operation, maxRetries = 3, baseDelay = 1000) => {
    let lastError

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation()
        } catch (error) {
            lastError = error

            // Si es un error de concurrencia, no reintentar
            if (error.message?.includes('Conflicto de concurrencia') ||
                error.message?.includes('reservado por otro usuario')) {
                throw error
            }

            // Si es el último intento, lanzar el error
            if (attempt === maxRetries) {
                throw error
            }

            // Calcular delay con backoff exponencial
            const delay = baseDelay * Math.pow(2, attempt)
            await new Promise(resolve => setTimeout(resolve, delay))
        }
    }

    throw lastError
}

/**
 * Wrapper para operaciones de slot con manejo de errores
 * @param {Function} operation - Operación a realizar
 * @param {Object} options - Opciones de configuración
 * @returns {Promise} - Resultado de la operación
 */
export const executeSlotOperation = async (operation, {
    operationType = 'realizar la operación',
    showToast = null,
    onConcurrencyError = null,
    maxRetries = 0
} = {}) => {
    try {
        return await retryWithBackoff(operation, maxRetries)
    } catch (error) {
        const errorInfo = handleConcurrencyError(error, operationType)

        // Mostrar toast si se proporciona la función
        if (showToast) {
            if (errorInfo.type === 'concurrency') {
                showToast.error(errorInfo.message, {
                    description: 'Refresca la página para ver horarios actualizados'
                })
            } else {
                showToast.error(errorInfo.message)
            }
        }

        // Callback específico para errores de concurrencia
        if ((errorInfo.type === 'concurrency' || errorInfo.type === 'availability') && onConcurrencyError) {
            onConcurrencyError(errorInfo)
        }

        throw error
    }
}

/**
 * Formatea mensajes de error para mostrar al usuario
 * @param {Object} errorResponse - Respuesta de error del servidor
 * @returns {string} - Mensaje formateado para el usuario
 */
export const formatErrorMessage = (errorResponse) => {
    if (errorResponse?.error === 'Conflicto de concurrencia detectado') {
        return 'Este horario ha sido reservado por otro usuario. Por favor, recarga la página y selecciona un horario diferente.'
    }

    if (errorResponse?.error === 'Slot no disponible para reserva') {
        return 'Este horario ya no está disponible. Por favor, selecciona otro horario.'
    }

    if (errorResponse?.error === 'Slot temporalmente reservado') {
        return 'Este horario está siendo reservado por otro usuario. Por favor, selecciona otro horario.'
    }

    return errorResponse?.message || 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'
}
