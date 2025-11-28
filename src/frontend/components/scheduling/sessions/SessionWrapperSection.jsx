import { Edit2 } from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

const SessionWrapperSection = ({
    title = 'Detalles de la Sesión',
    icon = <></>,
    children = <></>,
    fieldName = '' // Nombre del campo en el formulario para detectar selección
}) => {
    const [isEditing, setIsEditing] = useState(false)
    const { watch, setValue } = useFormContext()

    // Obtener el valor seleccionado del formulario
    const selectedValue = watch(fieldName)
    const hasSelection = selectedValue && selectedValue !== ''

    // Función para obtener el texto de la opción seleccionada
    const getSelectedText = () => {
        switch (fieldName) {
            case 'modality':
                return getModalityText(selectedValue)
            case 'date':
                return getDateText(selectedValue)
            case 'hour':
                return selectedValue
            default:
                return selectedValue
        }
    }

    const getModalityText = (value) => {
        const modalities = {
            virtual: 'Virtual - Google Meet',
            telefonica: 'Telefónica - Llamada directa',
            presencial: 'Presencial - En nuestras oficinas'
        }
        return modalities[value] || value
    }

    const getDateText = (dateStr) => {
        if (!dateStr) return ''
        const [year, month, date] = dateStr.split('-').map(Number)
        const selectedDate = new Date(year, month - 1, date)
        return selectedDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const handleEdit = () => {
        // Limpiar la selección del campo actual
        setValue(fieldName, '')

        // Si se está editando la fecha y hay una hora seleccionada, también limpiarla
        if (fieldName === 'date') {
            const currentHour = watch('hour')
            if (currentHour && currentHour !== '') {
                setValue('hour', '')
            }
        }

        // Si se está editando la modalidad, limpiar fecha y hora
        if (fieldName === 'modality') {
            const currentDate = watch('date')
            const currentHour = watch('hour')

            if (currentDate && currentDate !== '') {
                setValue('date', '')
            }
            if (currentHour && currentHour !== '') {
                setValue('hour', '')
            }
        }

        setIsEditing(true)

        // Desactivar modo edición después de un breve delay para permitir la re-renderización
        setTimeout(() => {
            setIsEditing(false)
        }, 100)
    }

    return <section>
        <h4>
            <span className="wrapper-icon">
                {icon}
            </span>
            <span className="title">
                {title}
            </span>
        </h4>

        <div className="content">
            {
                hasSelection && !isEditing && (
                    <div className="selected-option">
                        <span className="selected-text">{getSelectedText()}</span>
                        <button
                            type="button"
                            className="edit-btn"
                            onClick={handleEdit}
                            title="Editar selección"
                        >
                            <Edit2 size="1em" strokeWidth="0.15em" />
                        </button>
                    </div>
                )
            }
            {
                !hasSelection && !isEditing &&
                    children
            }
        </div>

        <style jsx>{`
            section {
                display: grid;
                gap: 1.5em;
            }

            h4 {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: .5em;
                font-weight: 600;
                position: relative;
                padding: 0 .8em;
            }

            .title {
                font-size: 1.4em;
            }

            .wrapper-icon {
                display: grid;
                place-items: center;
            }

            .edit-btn {
                margin-left: auto;
                padding: 0em;
                border-radius: 0.25em;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .edit-btn:hover {
                background: var(--transparent-yellow);
                transform: scale(1.05);
            }

            .content {
                padding-left: .5em;
            }

            .selected-option {
                justify-self: center;
                padding: .2em 1em;
                background: var(--transparent-yellow);
                border: 2px solid var(--yellow);
                border-radius: 0.5em;
                display: flex;
                align-items: center;
                gap: 1em;
            }

            .selected-text {
                font-weight: 500;
                color: var(--color-fg);
                text-transform: capitalize;
            }
        `}</style>
    </section>
}

export default SessionWrapperSection
