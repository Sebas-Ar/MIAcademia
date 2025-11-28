import { Clock, Info } from 'lucide-react'
import ManualRefreshButton from './ManualRefreshButton'

const PreBookingInfoBanner = ({
    hasActivePreBookings = false,
    totalPreBooked = 0,
    isRefreshing = false
}) => {
    // Banner para cuando hay pre-reservas activas
    if (hasActivePreBookings) {
        return (
            <div className="prebooking-info-banner active">
                <div className="banner-content">
                    <div className="icon-wrapper">
                        <Info size={20} />
                    </div>
                    <div className="info-text">
                        <p className="main-text">
                            {totalPreBooked === 1
                                ? 'Hay 1 horario temporalmente reservado por otro usuario'
                                : `Hay ${totalPreBooked} horarios temporalmente reservados por otros usuarios`
                            }
                        </p>
                        <p className="sub-text">
                            <Clock size={14} />
                            Los horarios marcados con ⏱ se liberarán automáticamente si no se confirman a tiempo
                        </p>
                        <p className="refresh-info">
                            💡 <strong>¿Crees que algún horario ya debería estar disponible?</strong> Usa el botón de actualización para verificar si otros usuarios han cancelado sus pre-reservas
                        </p>
                    </div>
                    <div className="action-wrapper">
                        <ManualRefreshButton isRefreshing={isRefreshing} compact={true} />
                    </div>
                </div>

                <style jsx>{`
                    .prebooking-info-banner {
                        margin-bottom: 1rem;
                        padding: 1rem;
                        border-radius: 8px;
                        animation: fade-in 0.3s ease-out;
                    }

                    .prebooking-info-banner.active {
                        background: linear-gradient(135deg, var(--color-blue-50, #eff6ff), var(--color-indigo-50, #eef2ff));
                        border: 1px solid var(--color-blue-200, #bfdbfe);
                    }

                    .prebooking-info-banner.inactive {
                        background: linear-gradient(135deg, var(--color-gray-50, #f9fafb), var(--color-slate-50, #f8fafc));
                        border: 1px solid var(--color-gray-200, #e5e7eb);
                    }

                    .banner-content {
                        display: flex;
                        align-items: flex-start;
                        gap: 0.75rem;
                    }

                    .icon-wrapper {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 32px;
                        height: 32px;
                        background: var(--color-blue-100, #dbeafe);
                        border-radius: 50%;
                        color: var(--color-blue-600, #2563eb);
                        flex-shrink: 0;
                    }

                    .icon-wrapper-small {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 24px;
                        height: 24px;
                        background: var(--color-gray-100, #f3f4f6);
                        border-radius: 50%;
                        color: var(--color-gray-600, #4b5563);
                        flex-shrink: 0;
                    }

                    .info-text {
                        flex: 1;
                    }

                    .action-wrapper {
                        flex-shrink: 0;
                        display: flex;
                        align-items: flex-start;
                        margin-top: 0.25rem;
                    }

                    .main-text {
                        margin: 0 0 0.25rem 0;
                        font-weight: 500;
                        color: var(--color-gray-800, #1f2937);
                        font-size: 0.9rem;
                    }

                    .sub-text {
                        margin: 0 0 0.5rem 0;
                        display: flex;
                        align-items: center;
                        gap: 0.25rem;
                        color: var(--color-gray-600, #4b5563);
                        font-size: 0.8rem;
                    }

                    .refresh-info {
                        margin: 0;
                        font-size: 0.75rem;
                        color: var(--color-gray-500, #6b7280);
                        font-style: italic;
                        line-height: 1.3;
                    }

                    .info-note {
                        margin: 0;
                        font-size: 0.8rem;
                        color: var(--color-gray-600, #4b5563);
                        line-height: 1.4;
                    }

                    @keyframes fade-in {
                        from {
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @media (max-width: 768px) {
                        .prebooking-info-banner {
                            padding: 0.75rem;
                        }
                        
                        .banner-content {
                            flex-direction: column;
                            gap: 0.75rem;
                        }
                        
                        .action-wrapper {
                            align-self: flex-end;
                            margin-top: 0;
                        }
                        
                        .main-text {
                            font-size: 0.85rem;
                        }
                        
                        .sub-text {
                            font-size: 0.75rem;
                        }

                        .refresh-info {
                            font-size: 0.7rem;
                        }

                        .info-note {
                            font-size: 0.75rem;
                        }
                    }
                `}</style>
            </div>
        )
    }

    // Banner informativo cuando no hay pre-reservas activas
    return (
        <div className="prebooking-info-banner inactive">
            <div className="banner-content">
                <div className="icon-wrapper-small">
                    <Clock size={16} />
                </div>
                <div className="info-text">
                    <p className="info-note">
                        Si no ves horarios disponibles o crees que deberían aparecer más opciones, puedes actualizar para verificar cancelaciones recientes
                    </p>
                </div>
                <div className="action-wrapper">
                    <ManualRefreshButton isRefreshing={isRefreshing} compact={true} />
                </div>
            </div>

            <style jsx>{`
                .prebooking-info-banner {
                    margin-bottom: 1rem;
                    padding: 1rem;
                    border-radius: 8px;
                    animation: fade-in 0.3s ease-out;
                }

                .prebooking-info-banner.active {
                    background: linear-gradient(135deg, var(--color-blue-50, #eff6ff), var(--color-indigo-50, #eef2ff));
                    border: 1px solid var(--color-blue-200, #bfdbfe);
                }

                .prebooking-info-banner.inactive {
                    background: linear-gradient(135deg, var(--color-gray-50, #f9fafb), var(--color-slate-50, #f8fafc));
                    border: 1px solid var(--color-gray-200, #e5e7eb);
                }

                .banner-content {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                }

                .icon-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    background: var(--color-blue-100, #dbeafe);
                    border-radius: 50%;
                    color: var(--color-blue-600, #2563eb);
                    flex-shrink: 0;
                }

                .icon-wrapper-small {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    background: var(--color-gray-100, #f3f4f6);
                    border-radius: 50%;
                    color: var(--color-gray-600, #4b5563);
                    flex-shrink: 0;
                }

                .info-text {
                    flex: 1;
                }

                .action-wrapper {
                    flex-shrink: 0;
                    display: flex;
                    align-items: flex-start;
                    margin-top: 0.25rem;
                }

                .main-text {
                    margin: 0 0 0.25rem 0;
                    font-weight: 500;
                    color: var(--color-gray-800, #1f2937);
                    font-size: 0.9rem;
                }

                .sub-text {
                    margin: 0 0 0.5rem 0;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: var(--color-gray-600, #4b5563);
                    font-size: 0.8rem;
                }

                .refresh-info {
                    margin: 0;
                    font-size: 0.75rem;
                    color: var(--color-gray-500, #6b7280);
                    font-style: italic;
                    line-height: 1.3;
                }

                .info-note {
                    margin: 0;
                    font-size: 0.8rem;
                    color: var(--color-gray-600, #4b5563);
                    line-height: 1.4;
                }

                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 768px) {
                    .prebooking-info-banner {
                        padding: 0.75rem;
                    }
                    
                    .banner-content {
                        flex-direction: column;
                        gap: 0.75rem;
                    }
                    
                    .action-wrapper {
                        align-self: flex-end;
                        margin-top: 0;
                    }
                    
                    .main-text {
                        font-size: 0.85rem;
                    }
                    
                    .sub-text {
                        font-size: 0.75rem;
                    }

                    .refresh-info {
                        font-size: 0.7rem;
                    }

                    .info-note {
                        font-size: 0.75rem;
                    }
                }
            `}</style>
        </div>
    )
}

export default PreBookingInfoBanner
