'use client'

import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const PaymentSuccessPage = () => {
    const searchParams = useSearchParams()
    const [paymentInfo, setPaymentInfo] = useState(null)

    useEffect(() => {
        // Obtener parámetros de la URL
        const paymentId = searchParams.get('payment_id')
        const status = searchParams.get('status')
        const merchantOrder = searchParams.get('merchant_order_id')
        const externalReference = searchParams.get('external_reference')

        setPaymentInfo({
            paymentId,
            status,
            merchantOrder,
            externalReference
        })
    }, [searchParams])

    return (
        <div className="payment-success-page">
            <div className="success-container">
                <div className="success-icon">
                    <CheckCircle size="4em" strokeWidth="0.1em" />
                </div>

                <h1>¡Pago exitoso!</h1>

                <p className="success-message">
                    Tu pago ha sido procesado correctamente. Tus sesiones de asesoría vocacional han sido confirmadas.
                </p>

                {paymentInfo && (
                    <div className="payment-details">
                        <h3>Detalles del pago</h3>
                        <div className="detail-item">
                            <span>ID de pago:</span>
                            <span>{paymentInfo.paymentId}</span>
                        </div>
                        <div className="detail-item">
                            <span>Estado:</span>
                            <span className="status-approved">{paymentInfo.status}</span>
                        </div>
                        {paymentInfo.externalReference && (
                            <div className="detail-item">
                                <span>Referencia:</span>
                                <span>{paymentInfo.externalReference}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="next-steps">
                    <h3>¿Qué sigue?</h3>
                    <ul>
                        <li>📧 Recibirás un email de confirmación con los detalles de tus sesiones</li>
                        <li>📅 Te contactaremos antes de cada sesión para recordarte la fecha y hora</li>
                        <li>💬 Si tienes alguna pregunta, puedes contactarnos en cualquier momento</li>
                    </ul>
                </div>

                <div className="action-buttons">
                    <Link href="/asesoria-vocacional" className="primary-button">
                        Volver al inicio
                    </Link>
                    <Link href="/contacto" className="secondary-button">
                        Contactar soporte
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .payment-success-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2em;
                }

                .success-container {
                    max-width: 600px;
                    background: white;
                    border-radius: 1em;
                    padding: 3em;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }

                .success-icon {
                    color: #10b981;
                    margin-bottom: 1.5em;
                    animation: successPulse 2s ease-in-out infinite;
                }

                @keyframes successPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                h1 {
                    color: #047857;
                    font-size: 2.5em;
                    margin: 0 0 1em 0;
                    font-weight: 700;
                }

                .success-message {
                    font-size: 1.2em;
                    color: #374151;
                    line-height: 1.6;
                    margin-bottom: 2em;
                }

                .payment-details {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.5em;
                    padding: 1.5em;
                    margin-bottom: 2em;
                    text-align: left;
                }

                .payment-details h3 {
                    margin: 0 0 1em 0;
                    color: #374151;
                    font-size: 1.1em;
                    text-align: center;
                }

                .detail-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5em 0;
                    border-bottom: 1px solid #e2e8f0;
                }

                .detail-item:last-child {
                    border-bottom: none;
                }

                .detail-item span:first-child {
                    font-weight: 500;
                    color: #6b7280;
                }

                .detail-item span:last-child {
                    font-weight: 600;
                    color: #374151;
                }

                .status-approved {
                    color: #10b981 !important;
                    text-transform: capitalize;
                }

                .next-steps {
                    background: linear-gradient(135deg, #eff6ff, #dbeafe);
                    border: 1px solid #3b82f6;
                    border-radius: 0.5em;
                    padding: 1.5em;
                    margin-bottom: 2em;
                    text-align: left;
                }

                .next-steps h3 {
                    margin: 0 0 1em 0;
                    color: #1e40af;
                    text-align: center;
                }

                .next-steps ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }

                .next-steps li {
                    padding: 0.5em 0;
                    color: #3730a3;
                    line-height: 1.5;
                }

                .action-buttons {
                    display: flex;
                    gap: 1em;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .primary-button, .secondary-button {
                    padding: 1em 2em;
                    border-radius: 0.5em;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    display: inline-block;
                }

                .primary-button {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }

                .primary-button:hover {
                    background: linear-gradient(135deg, #059669, #047857);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
                }

                .secondary-button {
                    background: white;
                    color: #374151;
                    border: 1px solid #d1d5db;
                }

                .secondary-button:hover {
                    background: #f9fafb;
                    border-color: #9ca3af;
                }

                @media (max-width: 768px) {
                    .success-container {
                        padding: 2em;
                    }
                    
                    h1 {
                        font-size: 2em;
                    }
                    
                    .action-buttons {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    )
}

export default PaymentSuccessPage
