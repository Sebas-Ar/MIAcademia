'use client'

import { Calendar, CheckCircle, Clock, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const ConfirmationPage = () => {
    const [confirmationData, setConfirmationData] = useState({
        sessionCount: 0,
        planName: '',
        paymentId: '',
        confirmationDate: new Date().toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    })

    useEffect(() => {
        // Aquí podrías obtener datos del localStorage o de la URL
        // Por ahora usaremos datos de ejemplo
        setConfirmationData(prev => ({
            ...prev,
            sessionCount: 3,
            planName: 'Plan Premium',
            paymentId: 'MP' + Date.now()
        }))
    }, [])

    return (
        <div className="confirmation-page">
            <div className="confirmation-container">
                <div className="success-header">
                    <div className="success-icon">
                        <CheckCircle size="5em" strokeWidth="0.1em" />
                    </div>
                    <h1>¡Felicitaciones!</h1>
                    <h2>Tu asesoría vocacional ha sido confirmada</h2>
                </div>

                <div className="confirmation-details">
                    <div className="detail-card">
                        <div className="card-header">
                            <Calendar size="1.5em" strokeWidth="0.15em" />
                            <h3>Sesiones confirmadas</h3>
                        </div>
                        <p>Has confirmado <strong>{confirmationData.sessionCount} sesiones</strong> del {confirmationData.planName}</p>
                        <p>Fecha de confirmación: {confirmationData.confirmationDate}</p>
                    </div>

                    <div className="detail-card">
                        <div className="card-header">
                            <Mail size="1.5em" strokeWidth="0.15em" />
                            <h3>Confirmación por email</h3>
                        </div>
                        <p>Hemos enviado todos los detalles de tus sesiones a tu correo electrónico.</p>
                        <p>Revisa tu bandeja de entrada y la carpeta de spam.</p>
                    </div>

                    <div className="detail-card">
                        <div className="card-header">
                            <Clock size="1.5em" strokeWidth="0.15em" />
                            <h3>Próximos pasos</h3>
                        </div>
                        <ul>
                            <li>Te contactaremos 24 horas antes de cada sesión</li>
                            <li>Recibirás el enlace de la sesión virtual (si aplica)</li>
                            <li>Prepara tus preguntas y dudas vocacionales</li>
                        </ul>
                    </div>

                    <div className="detail-card">
                        <div className="card-header">
                            <Phone size="1.5em" strokeWidth="0.15em" />
                            <h3>¿Necesitas ayuda?</h3>
                        </div>
                        <p>Si tienes alguna pregunta o necesitas reprogramar una sesión:</p>
                        <div className="contact-options">
                            <Link href="/contacto" className="contact-link">
                                Contactar soporte
                            </Link>
                            <a href="mailto:soporte@mia.com" className="contact-link">
                                soporte@mia.com
                            </a>
                        </div>
                    </div>
                </div>

                <div className="payment-reference">
                    <h4>Referencia de pago</h4>
                    <p>ID: <span className="payment-id">{confirmationData.paymentId}</span></p>
                    <small>Guarda esta referencia para futuras consultas</small>
                </div>

                <div className="action-buttons">
                    <Link href="/asesoria-vocacional" className="primary-button">
                        Volver al inicio
                    </Link>
                    <Link href="/contacto" className="secondary-button">
                        Contactar soporte
                    </Link>
                </div>

                <div className="testimonial">
                    <h3>🌟 ¡Estás a punto de descubrir tu futuro!</h3>
                    <p>Nuestros asesores vocacionales te ayudarán a encontrar el camino perfecto hacia tus metas profesionales. ¡Prepárate para una experiencia transformadora!</p>
                </div>
            </div>

            <style jsx>{`
                .confirmation-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #ecfdf5, #d1fae5, #a7f3d0);
                    padding: 2em 1em;
                }

                .confirmation-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 1.5em;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                }

                .success-header {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    text-align: center;
                    padding: 3em 2em;
                    position: relative;
                    overflow: hidden;
                }

                .success-header::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                    animation: celebration 3s ease-in-out infinite;
                }

                @keyframes celebration {
                    0%, 100% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(180deg) scale(1.1); }
                }

                .success-icon {
                    margin-bottom: 1em;
                    animation: successBounce 2s ease-in-out infinite;
                }

                @keyframes successBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .success-header h1 {
                    font-size: 3em;
                    margin: 0 0 0.5em 0;
                    font-weight: 800;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .success-header h2 {
                    font-size: 1.5em;
                    margin: 0;
                    font-weight: 300;
                    opacity: 0.9;
                }

                .confirmation-details {
                    padding: 2em;
                    display: grid;
                    gap: 1.5em;
                }

                .detail-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 1em;
                    padding: 1.5em;
                    transition: all 0.3s ease;
                }

                .detail-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5em;
                    margin-bottom: 1em;
                    color: #059669;
                }

                .card-header h3 {
                    margin: 0;
                    font-size: 1.2em;
                    font-weight: 600;
                }

                .detail-card p {
                    margin: 0 0 0.5em 0;
                    color: #374151;
                    line-height: 1.6;
                }

                .detail-card p:last-child {
                    margin-bottom: 0;
                }

                .detail-card ul {
                    margin: 0;
                    padding-left: 1.5em;
                    color: #374151;
                }

                .detail-card li {
                    margin-bottom: 0.5em;
                    line-height: 1.5;
                }

                .contact-options {
                    display: flex;
                    gap: 1em;
                    margin-top: 1em;
                    flex-wrap: wrap;
                }

                .contact-link {
                    padding: 0.5em 1em;
                    background: #059669;
                    color: white;
                    text-decoration: none;
                    border-radius: 0.5em;
                    font-size: 0.9em;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .contact-link:hover {
                    background: #047857;
                    transform: translateY(-1px);
                }

                .payment-reference {
                    background: linear-gradient(135deg, #eff6ff, #dbeafe);
                    border: 1px solid #3b82f6;
                    margin: 0 2em 2em 2em;
                    padding: 1.5em;
                    border-radius: 1em;
                    text-align: center;
                }

                .payment-reference h4 {
                    margin: 0 0 0.5em 0;
                    color: #1e40af;
                    font-size: 1.1em;
                }

                .payment-reference p {
                    margin: 0 0 0.5em 0;
                    color: #3730a3;
                    font-size: 1.1em;
                }

                .payment-id {
                    font-family: 'Courier New', monospace;
                    font-weight: 600;
                    background: white;
                    padding: 0.25em 0.5em;
                    border-radius: 0.25em;
                    border: 1px solid #3b82f6;
                }

                .payment-reference small {
                    color: #6366f1;
                    font-size: 0.8em;
                }

                .action-buttons {
                    display: flex;
                    gap: 1em;
                    justify-content: center;
                    padding: 0 2em 2em 2em;
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

                .testimonial {
                    background: linear-gradient(135deg, #fef3c7, #fde68a);
                    margin: 2em;
                    padding: 2em;
                    border-radius: 1em;
                    text-align: center;
                    border: 1px solid #f59e0b;
                }

                .testimonial h3 {
                    margin: 0 0 1em 0;
                    color: #d97706;
                    font-size: 1.3em;
                }

                .testimonial p {
                    margin: 0;
                    color: #92400e;
                    line-height: 1.6;
                    font-style: italic;
                }

                @media (max-width: 768px) {
                    .confirmation-container {
                        margin: 0;
                        border-radius: 0;
                    }
                    
                    .success-header h1 {
                        font-size: 2.5em;
                    }
                    
                    .success-header h2 {
                        font-size: 1.2em;
                    }
                    
                    .action-buttons {
                        flex-direction: column;
                    }
                    
                    .contact-options {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    )
}

export default ConfirmationPage
