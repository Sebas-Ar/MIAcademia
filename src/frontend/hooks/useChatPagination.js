import { useCallback, useState } from 'react'

/**
 * Hook personalizado para manejar la paginación de programas en el chat
 * @param {string} chatID - ID del chat actual
 * @returns {Object} - Funciones y estado para manejar la paginación
 */
export const useChatPagination = (chatID) => {
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    /**
     * Carga una página específica de programas (usado para restore)
     * @param {number} pageNumber - Número de página a cargar
     * @param {number} programsPerPage - Cantidad de programas por página
     * @returns {Promise<Object>} - Lista de programas y metadata
     */
    const loadSpecificPage = useCallback(async (pageNumber, programsPerPage = 8) => {
        if (!chatID || isLoadingMore) {
            return null
        }

        // Validar que chatID tenga formato válido
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(chatID)
        if (!isValidObjectId) {
            console.error('Invalid chatID format:', chatID)
            return null
        }

        setIsLoadingMore(true)

        try {
            const response = await fetch(`/api/mia/${chatID}/programs?page=${pageNumber}&limit=${programsPerPage}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Error al cargar programas')
            }

            const data = await response.json()

            return {
                programs: data.programs,
                hasMore: data.hasMore,
                total: data.total,
                page: data.page,
                limit: data.limit
            }
        } catch (error) {
            console.error('Error loading specific page:', error)
            return null
        } finally {
            setIsLoadingMore(false)
        }
    }, [chatID, isLoadingMore])

    return {
        loadSpecificPage,
        isLoadingMore
    }
}
