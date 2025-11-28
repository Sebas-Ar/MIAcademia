import { CreditCard } from 'lucide-react'

const ConfirmScheduling = ({
    onConfirm
}) => {
    return (
        <div className="confirm-scheduling-section">
            <div className="sessions-summary">
                <h3>¡Perfecto! Has agendado todas tus sesiones</h3>
            </div>
            <button
                type="button"
                className="confirm-scheduling-btn"
                onClick={onConfirm}
            >
                <CreditCard size="1.2em" strokeWidth="0.15em" />
                Confirmar Agendamiento y Proceder al Pago
            </button>

            <style jsx>{`
                .confirm-scheduling-section {
                    background: linear-gradient(135deg, #10b981, #059669);
                    border-radius: 1em;
                    padding: 2em;
                    text-align: center;
                    animation: slideInFocus 0.6s ease-out;
                    margin-top: 1em;
                }

                .sessions-summary {
                    margin-bottom: 1.5em;
                }

                .sessions-summary h3 {
                    color: white;
                    font-size: 1.2em;
                    font-weight: 600;
                    margin: 0 0 0.5em 0;
                }

                .confirm-scheduling-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5em;
                    padding: 1em 2em;
                    background: white;
                    color: #059669;
                    font-weight: 600;
                    border-radius: 0.5em;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1em;
                    margin: 0 auto;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }

                .confirm-scheduling-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
                    background: #f8fafc;
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

export default ConfirmScheduling
