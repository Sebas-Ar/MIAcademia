const FormControls = ({
    isEditing,
    showCancelButton = false,
    showSaveButton = false,
    showCreateButton = false,
    onCancel
}) => {
    return (
        <div className="submit-section">
            {/* Botón de Guardar Cambios - Solo en modo edición y con campos completos */}
            {showSaveButton && (
                <button type="submit" className="submit-btn save-btn">
                    Guardar Cambios
                </button>
            )}

            {/* Botón de Agendar Sesión - Solo en modo creación y con campos completos */}
            {showCreateButton && (
                <button type="submit" className="submit-btn create-btn">
                    Agendar Sesión
                </button>
            )}

            {/* Botón de Cancelar - Siempre presente en modo edición */}
            {showCancelButton && (
                <button type="button" className="cancel-edit-btn" onClick={onCancel}>
                    Cancelar
                </button>
            )}

            <style jsx>{`
                .submit-section {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 1em;
                    animation: slideInFocus 0.6s ease-out;
                }

                .submit-btn {
                    padding: 1em 2em;
                    background: var(--yellow);
                    font-weight: 600;
                    border-radius: .5em;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    animation: slideIn 0.3s ease-out;
                }

                .submit-btn:hover {
                    background: var(--dark-yellow, #f59e0b);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }

                /* Estilos específicos para botón de guardar cambios */
                .save-btn {
                    background: var(--color-blue-500, #3b82f6);
                    color: white;
                }

                .save-btn:hover {
                    background: var(--color-blue-600, #2563eb);
                }

                /* Estilos específicos para botón de crear sesión */
                .create-btn {
                    background: var(--yellow);
                }

                .create-btn:hover {
                    background: var(--dark-yellow, #f59e0b);
                }

                .cancel-edit-btn {
                    padding: 1em 2em;
                    background: #f5f5f5;
                    color: #333;
                    font-weight: 600;
                    border-radius: .5em;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .cancel-edit-btn:hover {
                    background: #e5e5e5;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
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

export default FormControls
