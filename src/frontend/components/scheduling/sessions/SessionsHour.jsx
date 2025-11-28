import { useFormContext } from 'react-hook-form'
import PreBookingInfoBanner from './components/PreBookingInfoBanner'
import SessionsHourOptions from './SessionsHourOptions'

const SessionsHour = ({
    agendaSlots = [],
    isRefreshing = false,
    id = '',
    isEditing = false
}) => {
    const { watch } = useFormContext()
    const selectedDate = watch('date')
    const selectedModality = watch('modality')

    const generateTimeSlots = () => {
        const slots = []

        agendaSlots.slots.filter(slot => {
            const slotDate = new Date(slot.date)
            const formattedSlotDate = `${slotDate.getFullYear()}-${String(slotDate.getMonth() + 1).padStart(2, '0')}-${String(slotDate.getDate()).padStart(2, '0')}`

            return formattedSlotDate === selectedDate && selectedModality === slot.modality
        }).forEach(slot => {
            console.log({ slot })
            const hour = new Date(slot.date).getHours()
            const minute = new Date(slot.date).getMinutes()

            // Verificar si el slot pre-reservado ha expirado
            let effectiveStatus = slot.status
            let isExpired = false
            let timeRemaining = null
            let isOwnPreBooking = false

            if (slot.status === 'pre-booked' && slot.pre_booking_expires_at) {
                const now = new Date()
                const expirationDate = new Date(slot.pre_booking_expires_at)

                // Verificar si este slot está pre-agendado por el usuario actual
                isOwnPreBooking = slot.pre_booked_by._id === id

                // Si la pre-reserva ha expirado, tratar como disponible
                if (now > expirationDate) {
                    effectiveStatus = 'available'
                    isExpired = true
                } else {
                    // Si el usuario está editando y es su propia pre-reserva, tratarla como disponible
                    if (isEditing && isOwnPreBooking) {
                        effectiveStatus = 'available'
                    }
                    // Calcular tiempo restante si aún está vigente
                    const timeDiff = expirationDate - now
                    timeRemaining = Math.ceil(timeDiff / (1000 * 60)) // minutos restantes
                }
            }
            console.log({ isOwnPreBooking, isEditing })

            slots.push({
                slotId: slot._id,
                hour: `${hour}:${String(minute).padStart(2, '0')}`,
                status: effectiveStatus,
                originalStatus: slot.status,
                preBookingExpiresAt: slot.pre_booking_expires_at,
                isExpiredPreBooking: isExpired,
                timeRemainingMinutes: timeRemaining,
                preBookedBy: slot.pre_booked_by,
                isOwnPreBooking: isOwnPreBooking,
                isEditingMode: isEditing
            })
        })

        return slots
    }

    const timeSlots = generateTimeSlots()

    // Calcular estadísticas para el banner informativo
    const activePreBookings = timeSlots.filter(slot =>
        slot.originalStatus === 'pre-booked' &&
        slot.status === 'pre-booked' &&
        slot.timeRemainingMinutes > 0
    )

    return <article>
        {/* Banner informativo con botón de recarga integrado */}
        <PreBookingInfoBanner
            hasActivePreBookings={activePreBookings.length > 0}
            totalPreBooked={activePreBookings.length}
            isRefreshing={isRefreshing}
        />

        <ul className={isRefreshing ? 'refreshing' : ''}>
            {timeSlots.map(({ slotId, hour, status, originalStatus, preBookingExpiresAt, isExpiredPreBooking, timeRemainingMinutes, preBookedBy, isOwnPreBooking, isEditingMode }, index) => (
                <SessionsHourOptions
                    key={slotId}
                    slotId={slotId}
                    hour={hour}
                    status={status}
                    originalStatus={originalStatus}
                    preBookingExpiresAt={preBookingExpiresAt}
                    isExpiredPreBooking={isExpiredPreBooking}
                    timeRemainingMinutes={timeRemainingMinutes}
                    preBookedBy={preBookedBy}
                    isOwnPreBooking={isOwnPreBooking}
                    isEditingMode={isEditingMode}
                    // isDisabled={index === 0} // Example: disable first slot
                />
            ))}
        </ul>

        <style jsx>{`
            article {
                
            }

            ul {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 1em;
                transition: opacity 0.3s ease;
            }

            ul.refreshing {
                opacity: 0.7;
                pointer-events: none;
            }
        `}</style>
    </article>
}

export default SessionsHour
