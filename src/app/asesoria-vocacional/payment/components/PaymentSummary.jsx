import { Calendar, Clock, CreditCard } from 'lucide-react'

const PaymentSummary = ({ sessions, planData }) => {
    // Calcular precio total (ejemplo: $50,000 por sesión)
    const pricePerSession = 50000
    const totalPrice = sessions.length * pricePerSession

    const formatDateTime = (dateStr) => {
        console.log(dateStr)
        const date = new Date(dateStr)
        return {
            date: date.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            hour: date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(price)
    }

    return (
        <div className="payment-summary">
            <div className="summary-header">
                <CreditCard size="1.5em" strokeWidth="0.15em" />
                <h2>Resumen del agendamiento</h2>
            </div>

            <div className="plan-info">
                <h3><strong>Plan:</strong> {planData?.title}</h3>
                <p>{sessions.length} sesión{sessions.length > 1 ? 'es' : ''} de asesoría vocacional</p>
            </div>

            <div className="sessions-list">
                <h4>Sesiones Pre-agendadas:</h4>
                {sessions.map((session, index) => {
                    const { date, hour } = formatDateTime(session.date)
                    return (
                        <div key={session._id} className="session-item">
                            <div className="session-header">
                                <div className="session-number">
                                    Sesión {index + 1}
                                </div>
                                <div className="session-modality">
                                    {session.modality}
                                </div>
                            </div>
                            <div className="session-details">
                                <div className="detail">
                                    <div className="detail-icon">
                                        <Calendar size="1.1em" strokeWidth="0.15em" />
                                    </div>
                                    <div className="detail-text">{date}</div>
                                </div>
                                <div className="detail self-start">
                                    <div className="detail-icon">
                                        <Clock size="1.1em" strokeWidth="0.15em" />
                                    </div>
                                    <div className="detail-text">{hour}</div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="price-breakdown">
                <div className="price-line total">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                </div>
            </div>

            <div className="payment-security">
                <p>🔒 Pago seguro con Mercado Pago</p>
                <small>Tus datos están protegidos con cifrado SSL</small>
            </div>

            <style jsx>{`
                .payment-summary {
                    background: white;
                    border-radius: 1em;
                    padding: 2em;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    border: 1px solid #e2e8f0;
                }

                .summary-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5em;
                    margin-bottom: 1.5em;
                    color: #1e293b;
                }

                .summary-header h2 {
                    margin: 0;
                    font-size: 1.4em;
                    font-weight: 600;
                }

                .plan-info {
                    background: linear-gradient(135deg, #eff6ff, #dbeafe);
                    border: 1px solid #3b82f6;
                    border-radius: 0.5em;
                    padding: 1.5em;
                    margin-bottom: 2em;
                }

                .plan-info h3 {
                    margin: 0 0 0.5em 0;
                    color: #1e40af;
                    font-size: 1.2em;
                }

                .plan-info p {
                    margin: 0;
                    color: #3730a3;
                    font-weight: 500;
                }

                .sessions-list h4 {
                    margin: 0 0 1em 0;
                    color: #374151;
                    font-size: 1.1em;
                }

                .session-item {
                    display: flex;
                    flex-direction: column;
                    gap: 1em;
                    padding: 1.5em;
                    background: #f8fafc;
                    border-radius: 0.8em;
                    margin-bottom: 1em;
                    border: 1px solid #e2e8f0;
                    transition: all 0.2s ease;
                }

                .session-item:hover {
                    background: #f1f5f9;
                    border-color: #3b82f6;
                    transform: translateY(-1px);
                }

                .session-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5em;
                }

                .session-number {
                    background: #3b82f6;
                    color: white;
                    padding: 0.4em 0.8em;
                    border-radius: 0.5em;
                    font-size: 0.9em;
                    font-weight: 600;
                }

                .session-modality {
                    background: #10b981;
                    color: white;
                    padding: 0.3em 0.6em;
                    border-radius: 0.4em;
                    font-size: 0.8em;
                    font-weight: 500;
                }

                .session-details {
                    display: flex;
                    flex-direction: column;
                    gap: 0.8em;
                }

                .detail {
                    display: flex;
                    align-items: center;
                    gap: 0.8em;
                    font-size: 0.95em;
                    color: #374151;
                    background: white;
                    padding: 1em 1.2em;
                    border-radius: 0.6em;
                    border: 1px solid #e5e7eb;
                    transition: all 0.2s ease;
                }

                .detail:hover {
                    border-color: #cbd5e1;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }

                .detail-icon {
                    color: #6b7280;
                    flex-shrink: 0;
                    width: 2.5em;
                    display: flex;
                    justify-content: center;
                }

                .detail-text {
                    font-weight: 500;
                    flex: 1;
                    line-height: 1.4;
                }

                .detail:first-child .detail-icon {
                    color: #3b82f6;
                }

                .detail:last-child .detail-icon {
                    color: #059669;
                }



                .price-breakdown {
                    margin-top: 2em;
                }

                .price-line {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5em;
                    font-size: 0.95em;
                }

                .price-line.total {
                    font-size: 1.2em;
                    font-weight: 700;
                    color: #1e293b;
                }

                .payment-security {
                    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
                    border: 1px solid #10b981;
                    border-radius: 0.5em;
                    padding: 1em;
                    margin-top: 2em;
                    text-align: center;
                }

                .payment-security p {
                    margin: 0 0 0.25em 0;
                    color: #047857;
                    font-weight: 600;
                    font-size: 0.9em;
                }

                .payment-security small {
                    color: #065f46;
                    font-size: 0.8em;
                }
            `}</style>
        </div>
    )
}

export default PaymentSummary
