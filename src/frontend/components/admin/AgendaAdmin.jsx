'use client'

import { Calendar, Clock, Eye, Plus, Settings, Trash2, Unlock, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const AgendaAdmin = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [previewSlots, setPreviewSlots] = useState([])
    const [existingSlots, setExistingSlots] = useState([])
    const [loadingSlots, setLoadingSlots] = useState(false)
    const [previewSlotsToShow, setPreviewSlotsToShow] = useState(20)
    const [existingSlotsToShow, setExistingSlotsToShow] = useState(20)
    const [statusFilter, setStatusFilter] = useState('all') // Filtro por estado
    const [modalityFilter, setModalityFilter] = useState('all') // Filtro por modalidad

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
        defaultValues: {
            startDate: '',
            endDate: '',
            modality: 'virtual',
            startTime: '09:00',
            endTime: '17:00',
            slotDuration: 60,
            breakBetweenSlots: 0,
            excludeDays: []
        }
    })

    const watchedValues = watch()

    // Función para cargar slots existentes
    const loadExistingSlots = async () => {
        setLoadingSlots(true)
        try {
            const response = await fetch('/api/schedules')
            const result = await response.json()

            if (response.ok) {
                setExistingSlots(result.slots || [])
            } else {
                console.error('Error loading slots:', result)
            }
        } catch (error) {
            console.error('Error loading existing slots:', error)
        } finally {
            setLoadingSlots(false)
        }
    }

    // Función para eliminar un slot específico
    const deleteSlot = async (slotId) => {
        // Mostrar toast de confirmación
        toast.error('¿Estás seguro de que deseas eliminar este slot?', {
            action: {
                label: 'Sí, eliminar',
                onClick: () => confirmDeleteSlot(slotId)
            },
            cancel: {
                label: 'Cancelar',
                onClick: () => {}
            },
            duration: 10000 // 10 segundos para dar tiempo a decidir
        })
    }

    // Función para confirmar la eliminación
    const confirmDeleteSlot = async (slotId) => {
        try {
            const response = await fetch(`/api/schedules/${slotId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const result = await response.json()

            if (response.ok) {
                toast.success('Slot eliminado exitosamente')
                // Recargar la lista de slots existentes
                await loadExistingSlots()
            } else {
                toast.error(result.error || 'Error al eliminar el slot')
            }
        } catch (error) {
            console.error('Error deleting slot:', error)
            toast.error('Error al eliminar el slot')
        }
    }

    // Función para liberar un slot (cambiar status a available)
    const releaseSlot = async (slotId) => {
        // Mostrar toast de confirmación
        toast('¿Estás seguro de que deseas liberar este slot?', {
            description: 'El slot volverá a estar disponible para reservar',
            action: {
                label: 'Sí, liberar',
                onClick: () => confirmReleaseSlot(slotId)
            },
            cancel: {
                label: 'Cancelar',
                onClick: () => {}
            },
            duration: 10000
        })
    }

    // Función para confirmar la liberación del slot
    const confirmReleaseSlot = async (slotId) => {
        try {
            // Usar el endpoint PUT existente para reiniciar los campos y liberar el slot
            const response = await fetch(`/api/schedules/${slotId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 'available',
                    pre_booked_by: null,
                    pre_booked_at: null,
                    pre_booking_expires_at: null,
                    scheduled_by: null,
                    planId: null
                })
            })

            const result = await response.json()

            if (response.ok) {
                toast.success('Slot liberado exitosamente')
                // Recargar la lista de slots existentes
                await loadExistingSlots()
            } else {
                toast.error(result.error || 'Error al liberar el slot')
            }
        } catch (error) {
            console.error('Error releasing slot:', error)
            toast.error('Error al liberar el slot')
        }
    }

    // Cargar slots al montar el componente
    useEffect(() => {
        loadExistingSlots()
    }, [])

    // Función para generar preview de los slots
    const generatePreview = (data) => {
        const slots = []
        const startDate = new Date(data.startDate)
        const endDate = new Date(data.endDate)

        // Validación de fechas
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return []
        }

        // Función para agregar minutos a una hora
        const addMinutes = (time, minutes) => {
            const [hours, mins] = time.split(':').map(Number)
            const totalMinutes = hours * 60 + mins + minutes
            const newHours = Math.floor(totalMinutes / 60)
            const newMins = totalMinutes % 60

            // Validar que no pase de 24 horas
            if (newHours >= 24) {
                return null
            }

            return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
        }

        // Iterar por cada día en el rango
        let currentDate = new Date(startDate)

        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay()

            // Saltar días excluidos
            if (data.excludeDays.includes(dayOfWeek)) {
                const nextDate = new Date(currentDate)
                nextDate.setDate(nextDate.getDate() + 1)
                currentDate = nextDate
                continue
            }

            // Generar slots para este día
            let currentTime = data.startTime
            const endTime = data.endTime

            while (currentTime && currentTime < endTime) {
                const nextTime = addMinutes(currentTime, parseInt(data.slotDuration))

                if (nextTime && nextTime <= endTime) {
                    // Crear fecha completa combinando la fecha del día con la hora actual
                    const [hours, minutes] = currentTime.split(':').map(Number)
                    const slotDateTime = new Date(currentDate)
                    slotDateTime.setHours(hours, minutes, 0, 0)

                    slots.push({
                        date: slotDateTime,
                        modality: data.modality,
                        status: 'available'
                    })
                }

                const nextSlotTime = addMinutes(currentTime, parseInt(data.slotDuration) + parseInt(data.breakBetweenSlots))
                if (!nextSlotTime) break

                currentTime = nextSlotTime
            }

            const nextDate = new Date(currentDate)
            nextDate.setDate(nextDate.getDate() + 1)
            currentDate = nextDate
        }

        return slots
    }

    const onSubmit = async (data) => {
        // Validaciones adicionales
        const startDate = new Date(data.startDate)
        const endDate = new Date(data.endDate)

        if (endDate < startDate) {
            toast.error('La fecha de fin debe ser mayor o igual a la fecha de inicio')
            return
        }

        if (data.startTime >= data.endTime) {
            toast.error('La hora de fin debe ser mayor a la hora de inicio')
            return
        }

        setIsLoading(true)

        try {
            const slots = generatePreview(data)

            if (slots.length === 0) {
                toast.error('No se generaron slots con la configuración seleccionada')
                return
            }

            // Llamada a la API para crear los slots
            console.log('Enviando slots a la API:', slots)

            const response = await fetch('/api/schedules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ slots })
            })

            const result = await response.json()
            console.log('Respuesta del servidor:', result)

            if (!response.ok) {
                throw new Error(result.error || 'Error al crear los slots')
            }

            // Éxito
            toast.success(`¡Éxito! ${result.message}`)

            // Limpiar preview y form
            setPreviewSlots([])
            reset()

            // Recargar slots existentes
            await loadExistingSlots()
        } catch (error) {
            console.error('Error al crear slots:', error)

            // Manejo específico de errores de validación
            if (error.message.includes('validación')) {
                toast.error(`Error de validación: ${error.message}`)
            } else if (error.message.includes('Conflicto')) {
                toast.error('Ya existen slots con esas fechas y horarios')
            } else {
                toast.error(error.message || 'Error al crear los slots de agenda')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handlePreview = () => {
        const data = watchedValues

        // Validaciones
        if (!data.startDate || !data.endDate) {
            toast.error('Por favor selecciona las fechas de inicio y fin')
            return
        }

        const startDate = new Date(data.startDate)
        const endDate = new Date(data.endDate)

        if (endDate < startDate) {
            toast.error('La fecha de fin debe ser mayor o igual a la fecha de inicio')
            return
        }

        if (data.startTime >= data.endTime) {
            toast.error('La hora de fin debe ser mayor a la hora de inicio')
            return
        }

        const slots = generatePreview(data)

        if (slots.length === 0) {
            toast.error('No se generaron slots con la configuración seleccionada. Verifica las fechas y configuración.')
            return
        }

        setPreviewSlots(slots)
        toast.success(`Vista previa: ${slots.length} slots generados`)
    }

    const getDayName = (dayNumber) => {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        return days[dayNumber]
    }

    // Función para filtrar slots existentes
    const getFilteredSlots = () => {
        return existingSlots.filter(slot => {
            const statusMatch = statusFilter === 'all' || slot.status === statusFilter
            const modalityMatch = modalityFilter === 'all' || slot.modality === modalityFilter
            return statusMatch && modalityMatch
        })
    }

    // Obtener conteos por estado
    const getSlotCounts = () => {
        const filteredSlots = getFilteredSlots()
        return {
            total: existingSlots.length,
            filtered: filteredSlots.length,
            available: existingSlots.filter(slot => slot.status === 'available').length,
            preBooked: existingSlots.filter(slot => slot.status === 'pre-booked').length,
            scheduled: existingSlots.filter(slot => slot.status === 'scheduled').length
        }
    }

    // Funciones para manejar "ver más"
    const showMorePreviewSlots = () => {
        setPreviewSlotsToShow(prev => Math.min(prev + 20, previewSlots.length))
    }

    const showMoreExistingSlots = () => {
        const filteredSlots = getFilteredSlots()
        setExistingSlotsToShow(prev => Math.min(prev + 20, filteredSlots.length))
    }

    // Reset counters when slots change
    useEffect(() => {
        setPreviewSlotsToShow(20)
    }, [previewSlots])

    useEffect(() => {
        setExistingSlotsToShow(20)
    }, [existingSlots, statusFilter, modalityFilter])

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Administrador de Agenda</h2>
                        <p className="text-gray-600">Crea slots de agenda disponibles para asesorías vocacionales</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Formulario */}
                <div className="xl:col-span-1 bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center gap-2 mb-6">
                        <Settings className="w-5 h-5 text-gray-600" />
                        <h3 className="text-xl font-semibold">Configuración de Slots</h3>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Rango de Fechas */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                <Calendar className="w-4 h-4" />
                                <span>Rango de Fechas</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha de Inicio
                                    </label>
                                    <input
                                        type="date"
                                        {...register('startDate', { required: 'La fecha de inicio es requerida' })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.startDate && (
                                        <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha de Fin
                                    </label>
                                    <input
                                        type="date"
                                        {...register('endDate', { required: 'La fecha de fin es requerida' })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.endDate && (
                                        <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modalidad */}
                        <div>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                <Users className="w-4 h-4" />
                                <span>Modalidad</span>
                            </div>
                            <select
                                {...register('modality', { required: 'La modalidad es requerida' })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="virtual">📹 Virtual</option>
                                <option value="presencial">🏢 Presencial</option>
                                <option value="llamada">📞 Llamada</option>
                            </select>
                        </div>

                        {/* Horarios */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                <Clock className="w-4 h-4" />
                                <span>Horarios de Atención</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hora de Inicio
                                    </label>
                                    <input
                                        type="time"
                                        {...register('startTime', { required: 'La hora de inicio es requerida' })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hora de Fin
                                    </label>
                                    <input
                                        type="time"
                                        {...register('endTime', { required: 'La hora de fin es requerida' })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Duración y Descansos */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                <Clock className="w-4 h-4" />
                                <span>Configuración de Tiempo</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Duración por Slot
                                    </label>
                                    <select
                                        {...register('slotDuration', { required: 'La duración es requerida' })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value={30}>⏰ 30 minutos</option>
                                        <option value={60}>⏰ 60 minutos</option>
                                        <option value={90}>⏰ 90 minutos</option>
                                        <option value={120}>⏰ 120 minutos</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descanso entre Slots
                                    </label>
                                    <select
                                        {...register('breakBetweenSlots')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value={0}>⚡ Sin descanso</option>
                                        <option value={15}>⏱️ 15 minutos</option>
                                        <option value={20}>⏱️ 20 minutos</option>
                                        <option value={30}>⏱️ 30 minutos</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Opciones de Exclusión */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Excluir días específicos
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[0, 1, 2, 3, 4, 5, 6].map(day => (
                                        <label key={day} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                value={day}
                                                {...register('excludeDays')}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-1 text-xs">{getDayName(day)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex space-x-4 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handlePreview}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition duration-200 font-medium"
                            >
                                <Eye className="w-4 h-4" />
                                Vista Previa
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition duration-200 font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                {isLoading ? 'Creando...' : 'Crear Slots'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Vista Previa */}
                <div className="xl:col-span-1 bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center gap-2 mb-6">
                        <Eye className="w-5 h-5 text-gray-600" />
                        <h3 className="text-xl font-semibold">Vista Previa</h3>
                    </div>

                    {previewSlots.length === 0
                        ? (
                            <div className="text-center text-gray-500 py-12">
                                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium mb-2">Sin vista previa</p>
                                <p className="text-sm">Haz clic en &quot;Vista Previa&quot; para ver los slots que se generarán</p>
                            </div>
                        )
                        : (
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-blue-800 font-medium">
                                            📊 Total de slots: <span className="font-bold">{previewSlots.length}</span>
                                            </p>
                                            <p className="text-blue-700">
                                            🕒 Duración: {watchedValues.slotDuration} min
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-blue-800 font-medium">
                                                {watchedValues.modality === 'virtual' && '📹 Virtual'}
                                                {watchedValues.modality === 'presencial' && '🏢 Presencial'}
                                                {watchedValues.modality === 'llamada' && '📞 Llamada'}
                                            </p>
                                            {watchedValues.breakBetweenSlots > 0 && (
                                                <p className="text-blue-700">
                                                ⏱️ Descanso: {watchedValues.breakBetweenSlots} min
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                                    <div className="space-y-1 p-2">
                                        {previewSlots.slice(0, previewSlotsToShow).map((slot, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Clock className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {slot.date.toLocaleDateString('es-CO', {
                                                                weekday: 'short',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {slot.date.toLocaleTimeString('es-CO', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: false
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                                        {slot.modality}
                                                    </span>
                                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                                </div>
                                            </div>
                                        ))}

                                        {previewSlots.length > previewSlotsToShow && (
                                            <div className="text-center py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                                <button
                                                    onClick={showMorePreviewSlots}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200 flex items-center gap-2 mx-auto"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                Ver más ({previewSlots.length - previewSlotsToShow} restantes)
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                </div>

                {/* Slots Existentes */}
                <div className="xl:col-span-1 bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-600" />
                            <h3 className="text-xl font-semibold">Slots Existentes</h3>
                        </div>
                        <button
                            onClick={loadExistingSlots}
                            disabled={loadingSlots}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            {loadingSlots ? '🔄' : '↻'} Actualizar
                        </button>
                    </div>

                    {/* Filtros */}
                    {existingSlots.length > 0 && (
                        <div className="mb-4 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Filtro por Estado */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Estado
                                    </label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">🔍 Todos los estados</option>
                                        <option value="available">🟢 Disponibles</option>
                                        <option value="pre-booked">🟡 Pre-reservados</option>
                                        <option value="scheduled">🔴 Agendados</option>
                                    </select>
                                </div>

                                {/* Filtro por Modalidad */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Modalidad
                                    </label>
                                    <select
                                        value={modalityFilter}
                                        onChange={(e) => setModalityFilter(e.target.value)}
                                        className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">🔍 Todas las modalidades</option>
                                        <option value="virtual">📹 Virtual</option>
                                        <option value="presencial">🏢 Presencial</option>
                                        <option value="llamada">📞 Llamada</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {loadingSlots
                        ? (
                            <div className="text-center text-gray-500 py-12">
                                <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p>Cargando slots...</p>
                            </div>
                        )
                        : existingSlots.length === 0
                            ? (
                                <div className="text-center text-gray-500 py-12">
                                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg font-medium mb-2">No hay slots creados</p>
                                    <p className="text-sm">Crea tu primer slot usando el formulario</p>
                                </div>
                            )
                            : (
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-green-800 font-medium">
                                                    📊 Total: <span className="font-bold">{getSlotCounts().total}</span>
                                                </p>
                                                <p className="text-green-700 text-sm">
                                                    🔍 Filtrados: {getSlotCounts().filtered}
                                                </p>
                                            </div>
                                            <div className="text-sm space-y-1">
                                                <p className="text-green-800">🟢 Disponibles: {getSlotCounts().available}</p>
                                                <p className="text-yellow-800">🟡 Pre-reservados: {getSlotCounts().preBooked}</p>
                                                <p className="text-red-800">🔴 Agendados: {getSlotCounts().scheduled}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                                        <div className="space-y-1 p-2">
                                            {getFilteredSlots().slice(0, existingSlotsToShow).map((slot, index) => (
                                                <div key={slot._id || index} className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-150 group">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                            slot.status === 'available'
                                                                ? 'bg-green-100'
                                                                : slot.status === 'pre-booked'
                                                                    ? 'bg-yellow-100'
                                                                    : 'bg-red-100'
                                                        }`}>
                                                            <Clock className={`w-4 h-4 ${
                                                                slot.status === 'available'
                                                                    ? 'text-green-600'
                                                                    : slot.status === 'pre-booked'
                                                                        ? 'text-yellow-600'
                                                                        : 'text-red-600'
                                                            }`} />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {new Date(slot.date).toLocaleDateString('es-CO', {
                                                                    weekday: 'short',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {new Date(slot.date).toLocaleTimeString('es-CO', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    hour12: false
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                            slot.status === 'available'
                                                                ? 'bg-green-100 text-green-800'
                                                                : slot.status === 'pre-booked'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {slot.modality}
                                                        </span>
                                                        <span className={`w-2 h-2 rounded-full ${
                                                            slot.status === 'available'
                                                                ? 'bg-green-400'
                                                                : slot.status === 'pre-booked'
                                                                    ? 'bg-yellow-400'
                                                                    : 'bg-red-400'
                                                        }`}></span>
                                                        <div className="opacity-0 group-hover:opacity-100 ml-2 flex gap-1">
                                                            {slot.status !== 'available' && (
                                                                <button
                                                                    onClick={() => releaseSlot(slot._id)}
                                                                    className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-all duration-200"
                                                                    title="Liberar slot"
                                                                >
                                                                    <Unlock className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => deleteSlot(slot._id)}
                                                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-all duration-200"
                                                                title="Eliminar slot"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {getFilteredSlots().length > existingSlotsToShow && (
                                                <div className="text-center py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                                    <button
                                                        onClick={showMoreExistingSlots}
                                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200 flex items-center gap-2 mx-auto"
                                                    >
                                                        <Calendar className="w-4 h-4" />
                                                Ver más ({getFilteredSlots().length - existingSlotsToShow} restantes)
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                </div>
            </div>
        </div>
    )
}

export default AgendaAdmin
