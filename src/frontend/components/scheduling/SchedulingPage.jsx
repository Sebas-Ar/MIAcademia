'use client'

import { useIdentifyUser } from '@/frontend/hooks/useIdentifyUser'
import { useSession } from 'next-auth/react'
import LoginGoogle from '../login/LoginGoogle'
import PlanRedirectGuard from './PlanRedirectGuard'
import SchedulingPlan from './SchedulingPlan'
import SchedulingRules from './SchedulingRules'
import Sessions from './sessions/Sessions'

const SchedulingPage = ({
    userData = {},
    planData = null
}) => {
    // Hook para identificación de usuario
    const { userEmail, id } = useIdentifyUser()

    // Hook para estado de sesión con loading
    const { status } = useSession()

    return <>
        <div className="scheduling-page-content">
            {/* Componente que detecta y redirige cuando hay conflicto de planes */}
            <PlanRedirectGuard />

            <SchedulingPlan planData={planData} />

            {status === 'loading' || (status === 'authenticated' && !userEmail)
                ? <div className="login-required-section">
                    <div className="login-card">
                        <div className="login-header">
                            <h3>
                                {status === 'loading'
                                    ? 'Verificando autenticación...'
                                    : 'Cargando datos de usuario...'
                                }
                            </h3>
                            <p>
                                {status === 'loading'
                                    ? 'Por favor espera mientras verificamos tu sesión.'
                                    : 'Obteniendo información de tu cuenta.'
                                }
                            </p>
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                            </div>
                        </div>
                    </div>
                </div>
                : userEmail
                    ? <>
                        <Sessions planData={planData} id={id} />
                        <SchedulingRules />
                    </>
                    : (
                // Usuario no autenticado - mostrar login
                        <div className="login-required-section">
                            <div className="login-card">
                                <div className="login-header">
                                    <h3>Inicia sesión para continuar</h3>
                                    <p>Para agendar tus sesiones de asesoría vocacional necesitas estar registrado en nuestra plataforma.</p>
                                    <LoginGoogle
                                        text="Continuar con Google"
                                        locationBtn="scheduling-page"
                                    />
                                </div>
                                <div className="login-benefits">
                                    <h4>Al registrarte podrás:</h4>
                                    <ul>
                                        <li>✅ Agendar tus sesiones de asesoría personalizada</li>
                                        <li>✅ Gestionar y modificar tus citas</li>
                                        <li>✅ Acceder a tu historial de sesiones</li>
                                        <li>✅ Recibir recordatorios y notificaciones</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

            <style jsx>{`
                .scheduling-page-content {
                    background: var(--light-blue);
                    padding: 2em;
                }

            /* Estilos para la sección de login requerido */
            .login-required-section {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 400px;
                padding: 2rem 0;
            }

            .login-card {
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                padding: 2.5rem;
                max-width: 500px;
                width: 100%;
                text-align: center;
                border: 1px solid #e5e7eb;
            }

            .login-header {
                display: grid;
                justify-items: center;
            }

            .login-header h3 {
                margin: 0 0 1rem 0;
                color: var(--dark-blue, #1e40af);
                font-size: 1.5rem;
                font-weight: 600;
            }

            .login-header p {
                margin: 0 0 1.5rem 0;
                color: #6b7280;
                line-height: 1.6;
                font-size: 1rem;
            }

            .login-benefits {
                text-align: left;
                margin: 1.5rem 0 2rem 0;
                padding: 1.5rem;
                background: #f8fafc;
                border-radius: 8px;
                border-left: 4px solid var(--dark-blue, #1e40af);
            }

            .login-benefits h4 {
                margin: 0 0 1rem 0;
                color: var(--dark-blue, #1e40af);
                font-size: 1.1rem;
                font-weight: 600;
            }

            .login-benefits ul {
                margin: 0;
                padding: 0;
                list-style: none;
            }

            .login-benefits li {
                margin: 0.5rem 0;
                color: #374151;
                font-size: 0.95rem;
                line-height: 1.5;
            }

            .login-action {
                display: flex;
                justify-content: center;
            }

            /* Estilos del loading spinner */
            .loading-spinner {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 1rem;
            }

            .spinner {
                width: 32px;
                height: 32px;
                border: 3px solid #f3f4f6;
                border-top: 3px solid var(--dark-blue, #1e40af);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Responsivo para login card */
            @media (max-width: 768px) {
                .login-card {
                    padding: 2rem 1.5rem;
                    margin: 0 1rem;
                }

                .login-header h3 {
                    font-size: 1.3rem;
                }

                .login-benefits {
                    padding: 1rem;
                }
            }
            `}</style>
        </div>
    </>
}

export default SchedulingPage
