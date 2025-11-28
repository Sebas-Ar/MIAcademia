'use client'

import { useEffect, useState } from 'react'

const PlansAdmin = () => {
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPlan, setEditingPlan] = useState(null)
    const [formData, setFormData] = useState({
        route: '',
        icon: '',
        title: '',
        subtitle: '',
        description: '',
        backgroundColor: '',
        transparentBackground: '',
        price: 0,
        numberDiscount: 0,
        sessionsNumber: 1,
        sessionTime: 60,
        sessionTimeUnit: 'min',
        includesList: [''],
        btnText: '',
        detailList: [{ title: '', description: '', duration: '' }],
        benefitsList: [''],
        currency: 'COP',
        isPopular: false,
        modalidad: 'Virtual',
        entities: [''],
        descriptionShort: '',
        textColor: 'var(--black)',
        sessionInterval: {
            minDays: 2,
            maxDays: 7
        }
    })

    // Cargar planes al inicializar
    useEffect(() => {
        fetchPlans()
    }, [])

    // Obtener todos los planes
    const fetchPlans = async () => {
        try {
            setLoading(true)
            setError(null) // Limpiar errores previos
            const response = await fetch('/api/plans')
            if (!response.ok) throw new Error('Error al cargar los planes')
            const data = await response.json()
            // La API devuelve directamente un array, no un objeto con propiedad plans
            setPlans(Array.isArray(data) ? data : [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Crear nuevo plan
    const createPlan = async (planData) => {
        try {
            const response = await fetch('/api/plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(planData)
            })
            if (!response.ok) throw new Error('Error al crear el plan')
            await fetchPlans()
            setIsModalOpen(false)
            resetForm()
        } catch (err) {
            setError(err.message)
        }
    }

    // Actualizar plan existente
    const updatePlan = async (planData) => {
        try {
            const response = await fetch('/api/plans', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...planData, _id: editingPlan._id })
            })
            if (!response.ok) throw new Error('Error al actualizar el plan')
            await fetchPlans()
            setIsModalOpen(false)
            setEditingPlan(null)
            resetForm()
        } catch (err) {
            setError(err.message)
        }
    }

    // Eliminar plan
    const deletePlan = async (planId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este plan?')) return

        try {
            const response = await fetch('/api/plans', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: planId })
            })
            if (!response.ok) throw new Error('Error al eliminar el plan')
            await fetchPlans()
        } catch (err) {
            setError(err.message)
        }
    }

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault()
        if (editingPlan) {
            updatePlan(formData)
        } else {
            createPlan(formData)
        }
    }

    // Abrir modal para editar
    const openEditModal = (plan) => {
        setEditingPlan(plan)
        setFormData({ ...plan })
        setIsModalOpen(true)
    }

    // Abrir modal para crear
    const openCreateModal = () => {
        setEditingPlan(null)
        resetForm()
        setIsModalOpen(true)
    }

    // Resetear formulario
    const resetForm = () => {
        setFormData({
            route: '',
            icon: '',
            title: '',
            subtitle: '',
            description: '',
            backgroundColor: '',
            transparentBackground: '',
            price: 0,
            numberDiscount: 0,
            sessionsNumber: 1,
            sessionTime: 60,
            sessionTimeUnit: 'min',
            includesList: [''],
            btnText: '',
            detailList: [{ title: '', description: '', duration: '' }],
            benefitsList: [''],
            currency: 'COP',
            isPopular: false,
            modalidad: 'Virtual',
            entities: [''],
            descriptionShort: '',
            textColor: 'var(--black)',
            sessionInterval: {
                minDays: 2,
                maxDays: 7
            }
        })
    }

    // Manejar cambios en arrays
    const handleArrayChange = (arrayName, index, value) => {
        const newArray = [...formData[arrayName]]
        newArray[index] = value
        setFormData({ ...formData, [arrayName]: newArray })
    }

    // Agregar elemento a array
    const addArrayItem = (arrayName, defaultItem = '') => {
        setFormData({
            ...formData,
            [arrayName]: [...formData[arrayName], defaultItem]
        })
    }

    // Remover elemento de array
    const removeArrayItem = (arrayName, index) => {
        const newArray = formData[arrayName].filter((_, i) => i !== index)
        setFormData({ ...formData, [arrayName]: newArray })
    }

    // Manejar cambios en detailList
    const handleDetailChange = (index, field, value) => {
        const newDetails = [...formData.detailList]
        newDetails[index] = { ...newDetails[index], [field]: value }
        setFormData({ ...formData, detailList: newDetails })
    }

    if (loading) return <div className="flex justify-center items-center p-12 text-xl text-gray-600">Cargando planes...</div>
    if (error) return <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg m-4 text-center">Error: {error}</div>

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 m-0">Administrar Planes</h2>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1"
                    onClick={openCreateModal}
                >
                    Crear Nuevo Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {plans.length === 0
                    ? (
                        <div className="col-span-full text-center py-12 px-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-gray-600">
                            <p className="text-lg m-0">No hay planes disponibles. Crea tu primer plan usando el botón &quot;Crear Nuevo Plan&quot;.</p>
                        </div>
                    )
                    : (
                        plans.map((plan) => (
                            <div key={plan._id} className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800 capitalize flex-1 mr-4 m-0">{plan.title}</h3>
                                    <div className="flex gap-2">
                                        <button
                                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 p-2 rounded-md transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
                                            onClick={() => openEditModal(plan)}
                                            title="Editar plan"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
                                            onClick={() => deletePlan(plan._id)}
                                            title="Eliminar plan"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="my-2 text-gray-600 text-sm m-0"><strong className="text-gray-800">Precio:</strong> ${plan.price?.toLocaleString()} {plan.currency}</p>
                                    <p className="my-2 text-gray-600 text-sm m-0"><strong className="text-gray-800">Sesiones:</strong> {plan.sessionsNumber}</p>
                                    <p className="my-2 text-gray-600 text-sm m-0"><strong className="text-gray-800">Modalidad:</strong> {plan.modalidad}</p>
                                    <p className="my-2 text-gray-600 text-sm m-0"><strong className="text-gray-800">Ruta:</strong> {plan.route}</p>
                                    {plan.isPopular && <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold mt-2">Popular</span>}
                                </div>
                            </div>
                        ))
                    )}
            </div>            {/* Modal para crear/editar plan */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[var(--transparent-dark-blue)] flex justify-center items-center z-50 overflow-y-auto py-8 px-4">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[70vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b-2 border-gray-200 bg-gray-50 rounded-t-xl">
                            <h3 className="text-2xl font-semibold text-gray-800 m-0">{editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}</h3>
                            <button
                                className="text-gray-600 hover:bg-red-100 hover:text-red-600 w-8 h-8 flex items-center justify-center rounded-full text-2xl transition-all duration-300"
                                onClick={() => {
                                    setIsModalOpen(false)
                                    setEditingPlan(null)
                                    resetForm()
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                                {/* Información básica */}
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600 m-0">Información Básica</h4>

                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700 font-semibold text-sm">Título</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700 font-semibold text-sm">Ruta (URL)</label>
                                        <input
                                            type="text"
                                            value={formData.route}
                                            onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                                            required
                                            className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700 font-semibold text-sm">Subtítulo</label>
                                        <input
                                            type="text"
                                            value={formData.subtitle}
                                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                            required
                                            className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700 font-semibold text-sm">Descripción</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows="4"
                                            required
                                            className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700 font-semibold text-sm">Descripción Corta</label>
                                        <input
                                            type="text"
                                            value={formData.descriptionShort}
                                            onChange={(e) => setFormData({ ...formData, descriptionShort: e.target.value })}
                                            className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                        />
                                    </div>
                                </div>

                                {/* Configuración */}
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600 m-0">Configuración</h4>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block mb-2 text-gray-700 font-semibold text-sm">Precio</label>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                                required
                                                className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-gray-700 font-semibold text-sm">Moneda</label>
                                            <select
                                                value={formData.currency}
                                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                                className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                            >
                                                <option value="COP">COP</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block mb-2 text-gray-700 font-semibold text-sm">Descuento (%)</label>
                                            <input
                                                type="number"
                                                value={formData.numberDiscount}
                                                onChange={(e) => setFormData({ ...formData, numberDiscount: Number(e.target.value) })}
                                                min="0"
                                                max="100"
                                                className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-gray-700 font-semibold text-sm">Número de Sesiones</label>
                                            <input
                                                type="number"
                                                value={formData.sessionsNumber}
                                                onChange={(e) => setFormData({ ...formData, sessionsNumber: Number(e.target.value) })}
                                                min="1"
                                                required
                                                className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block mb-2 text-gray-700 font-semibold text-sm">Duración de Sesión</label>
                                            <input
                                                type="number"
                                                value={formData.sessionTime}
                                                onChange={(e) => setFormData({ ...formData, sessionTime: Number(e.target.value) })}
                                                min="1"
                                                required
                                                className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-gray-700 font-semibold text-sm">Unidad de Tiempo</label>
                                            <select
                                                value={formData.sessionTimeUnit}
                                                onChange={(e) => setFormData({ ...formData, sessionTimeUnit: e.target.value })}
                                                className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                            >
                                                <option value="min">Minutos</option>
                                                <option value="hr">Horas</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block mb-2 text-gray-700 font-semibold text-sm">Modalidad</label>
                                            <select
                                                value={formData.modalidad}
                                                onChange={(e) => setFormData({ ...formData, modalidad: e.target.value })}
                                                className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                            >
                                                <option value="Virtual">Virtual</option>
                                                <option value="Presencial">Presencial</option>
                                                <option value="Híbrida">Híbrida</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-gray-700 font-semibold text-sm">Ícono</label>
                                            <input
                                                type="text"
                                                value={formData.icon}
                                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                                placeholder="Briefcase, User, etc."
                                                className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700 font-semibold text-sm">Texto del Botón</label>
                                        <input
                                            type="text"
                                            value={formData.btnText}
                                            onChange={(e) => setFormData({ ...formData, btnText: e.target.value })}
                                            required
                                            className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="flex items-center gap-2 cursor-pointer font-normal">
                                            <input
                                                type="checkbox"
                                                checked={formData.isPopular}
                                                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                                                className="w-4 h-4"
                                            />
                                            Plan Popular
                                        </label>
                                    </div>

                                    <div className="mt-6 pt-6 border-t-2 border-gray-300">
                                        <h5 className="text-base font-semibold text-gray-800 mb-3 m-0">Intervalo entre Sesiones</h5>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block mb-2 text-gray-700 font-semibold text-sm">Mínimo de Días</label>
                                                <input
                                                    type="number"
                                                    value={formData.sessionInterval?.minDays || 2}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        sessionInterval: {
                                                            ...formData.sessionInterval,
                                                            minDays: Number(e.target.value)
                                                        }
                                                    })}
                                                    min="1"
                                                    className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Días mínimos entre sesiones</p>
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-gray-700 font-semibold text-sm">Máximo de Días</label>
                                                <input
                                                    type="number"
                                                    value={formData.sessionInterval?.maxDays || 7}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        sessionInterval: {
                                                            ...formData.sessionInterval,
                                                            maxDays: Number(e.target.value)
                                                        }
                                                    })}
                                                    min="1"
                                                    className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Días máximos entre sesiones</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Estilos */}
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600 m-0">Estilos</h4>

                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700 font-semibold text-sm">Color de Fondo</label>
                                        <input
                                            type="text"
                                            value={formData.backgroundColor}
                                            onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                                            placeholder="var(--transparent-blue)"
                                            className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700 font-semibold text-sm">Fondo Transparente</label>
                                        <input
                                            type="text"
                                            value={formData.transparentBackground}
                                            onChange={(e) => setFormData({ ...formData, transparentBackground: e.target.value })}
                                            placeholder="var(--blue)"
                                            className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block mb-2 text-gray-700 font-semibold text-sm">Color de Texto</label>
                                        <input
                                            type="text"
                                            value={formData.textColor}
                                            onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                                            placeholder="var(--white)"
                                            className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Listas dinámicas */}
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600 m-0">Incluye</h4>
                                {formData.includesList.map((item, index) => (
                                    <div key={index} className="flex gap-2 mb-2 items-center">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleArrayChange('includesList', index, e.target.value)}
                                            placeholder="¿Qué incluye este plan?"
                                            className="flex-1 p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('includesList', index)}
                                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xl leading-none w-10 h-10 flex items-center justify-center rounded-md"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('includesList')}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md mt-2 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Agregar Incluye
                                </button>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600 m-0">Beneficios</h4>
                                {formData.benefitsList.map((benefit, index) => (
                                    <div key={index} className="flex gap-2 mb-2 items-center">
                                        <input
                                            type="text"
                                            value={benefit}
                                            onChange={(e) => handleArrayChange('benefitsList', index, e.target.value)}
                                            placeholder="Beneficio del plan"
                                            className="flex-1 p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('benefitsList', index)}
                                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xl leading-none w-10 h-10 flex items-center justify-center rounded-md"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('benefitsList')}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md mt-2 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Agregar Beneficio
                                </button>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600 m-0">Dirigido a</h4>
                                {formData.entities.map((entity, index) => (
                                    <div key={index} className="flex gap-2 mb-2 items-center">
                                        <input
                                            type="text"
                                            value={entity}
                                            onChange={(e) => handleArrayChange('entities', index, e.target.value)}
                                            placeholder="A quién está dirigido"
                                            className="flex-1 p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('entities', index)}
                                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xl leading-none w-10 h-10 flex items-center justify-center rounded-md"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('entities')}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md mt-2 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Agregar Entidad
                                </button>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-600 m-0">Detalles de Sesiones</h4>
                                {formData.detailList.map((detail, index) => (
                                    <div key={index} className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-4 relative">
                                        <div className="mb-4">
                                            <label className="block mb-2 text-gray-700 font-semibold text-sm">Título de la Sesión</label>
                                            <input
                                                type="text"
                                                value={detail.title}
                                                onChange={(e) => handleDetailChange(index, 'title', e.target.value)}
                                                placeholder="Título de la sesión"
                                                className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-2 text-gray-700 font-semibold text-sm">Descripción</label>
                                            <textarea
                                                value={detail.description}
                                                onChange={(e) => handleDetailChange(index, 'description', e.target.value)}
                                                placeholder="Descripción detallada"
                                                rows="3"
                                                className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block mb-2 text-gray-700 font-semibold text-sm">Duración</label>
                                            <input
                                                type="text"
                                                value={detail.duration}
                                                onChange={(e) => handleDetailChange(index, 'duration', e.target.value)}
                                                placeholder="60 min"
                                                className="w-full p-3 border-2 border-gray-300 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('detailList', index)}
                                            className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md text-sm"
                                        >
                                            Eliminar Detalle
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('detailList', { title: '', description: '', duration: '' })}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md mt-2 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Agregar Detalle de Sesión
                                </button>
                            </div>

                            <div className="flex justify-end gap-4 pt-8 border-t-2 border-gray-200 mt-8">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        setEditingPlan(null)
                                        resetForm()
                                    }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    {editingPlan ? 'Actualizar Plan' : 'Crear Plan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PlansAdmin
