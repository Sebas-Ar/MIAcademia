import { Calendar } from 'lucide-react'

const FormTitle = ({
    isEditing,
    currentSessionNumber,
    totalSessions
}) => {
    return (
        <div className="form-title">
            {isEditing
                ? (
                    <>
                        <h2>✏️ Editando Sesión</h2>
                        <p>Modifica los datos de tu sesión agendada</p>
                    </>
                )
                : (
                    <>
                        <h2>
                            <span>
                                <Calendar size="1.2em" strokeWidth=".1em" />
                            </span>
                            Agendar Sesión
                        </h2>
                        <p>Programa tu sesión {currentSessionNumber} de {totalSessions}</p>
                    </>
                )
            }

            <style jsx>{`
                .form-title {
                    text-align: center;
                    padding: 1.5em 2em;
                    background: var(--blue);
                    color: white;
                    border-radius: .8em;
                    margin-bottom: 1em;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                    animation: slideInFocus 0.6s ease-out;
                }

                .form-title h2 {
                    margin: 0 0 0.5em 0;
                    font-size: 1.5em;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5em;
                }

                .form-title p {
                    margin: 0;
                    font-size: 1em;
                    opacity: 0.9;
                    font-weight: 500;
                }

                span {
                    display: grid;
                    place-items: center;
                }

                @keyframes slideInFocus {
                    0% {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    50% {
                        opacity: 0.7;
                        transform: translateY(10px) scale(0.98);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    )
}

export default FormTitle
