import { AlertTriangle, X } from 'lucide-react'

const TimeoutNotification = ({
    showTimeoutNotification,
    onDismiss
}) => {
    if (!showTimeoutNotification) return null

    return (
        <div className="modal-page">
            <div className="modal-background"></div>
            <div className="modal-wrapper">
                <button
                    className="btn-close"
                    onClick={onDismiss}
                    aria-label="Cerrar notificación"
                >
                    <X size="1.4em" strokeWidth=".2em" />
                </button>

                <div className="modal-icon">
                    <AlertTriangle size={40} strokeWidth={2} />
                </div>

                <h3>Tiempo Límite Alcanzado</h3>

                <p className="modal-description">
                    Se ha culminado el tiempo límite para agendar las citas.
                </p>

                <div className="info-box">
                    <p>
                        Las sesiones seleccionadas se han <strong>liberado automáticamente</strong> para que otros usuarios puedan acceder a ellas.
                    </p>
                </div>

                <p className="modal-action-required">
                    Debes volver a iniciar el proceso de agendamiento y seleccionar tus sesiones a partir de la disponibilidad actual.
                </p>

                <button onClick={onDismiss} className="btn-confirm">
                    Entendido
                </button>
            </div>

            <style jsx>{`
                .modal-page {
                    height: 100dvh;
                    width: 100vw;
                    position: fixed;
                    top: 0;
                    left: 0;
                    display: grid;
                    place-items: center;
                    padding: 2em;
                    z-index: 11111111111;
                }

                .modal-background {
                    height: 100%;
                    width: 100%;
                    background: var(--transparent-dark-gray);
                    position: absolute;
                    z-index: -1;
                }

                .modal-wrapper {
                    background-color: var(--dark-blue);
                    padding: 2.4em;
                    width: 100%;
                    max-width: 35em;
                    border-radius: 1em;
                    overflow: hidden;
                    border: .125em solid var(--yellow);
                    display: grid;
                    gap: 1em;
                    position: relative;
                }

                .btn-close {
                    position: absolute;
                    top: 1em;
                    right: 1em;
                    color: var(--yellow);
                    display: grid;
                    place-items: center;
                    padding: .1em;
                    cursor: pointer;
                    transition: transform .3s;
                    background: none;
                    border: none;
                }

                .btn-close:hover {
                    transform: scale(1.2);
                }

                .modal-icon {
                    display: grid;
                    place-items: center;
                    color: var(--yellow);
                    margin-bottom: .5em;
                }

                .modal-wrapper h3 {
                    font-size: 1.1em;
                    color: var(--yellow);
                    text-align: center;
                    font-weight: 600;
                    text-transform: uppercase;
                    margin: 0;
                }

                .modal-description {
                    color: var(--yellow);
                    font-size: 1em;
                    text-align: center;
                    font-weight: 300;
                    margin: .5em 0;
                }

                .info-box {
                    background: var(--transparent-white);
                    border: .15em solid var(--yellow);
                    border-radius: .5em;
                    padding: 1em;
                    margin: .5em 0;
                }

                .info-box p {
                    color: var(--yellow);
                    font-size: .95em;
                    text-align: center;
                    font-weight: 300;
                    margin: 0;
                    line-height: 1.5;
                }

                .info-box strong {
                    font-weight: 600;
                }

                .modal-action-required {
                    color: var(--yellow);
                    font-size: .95em;
                    text-align: center;
                    font-weight: 400;
                    margin: .3em 0;
                    line-height: 1.5;
                }

                .btn-confirm {
                    background: var(--yellow);
                    border: .15em solid var(--dark-yellow);
                    color: var(--dark-blue);
                    padding: .8em 1.5em;
                    border-radius: .5em;
                    font-size: .95em;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform .3s, background .3s, box-shadow .3s;
                    justify-self: center;
                    margin-top: .5em;
                }

                .btn-confirm:hover {
                    transform: scale(1.05);
                    background: var(--dark-yellow);
                    box-shadow: 0 4px 16px rgba(251, 191, 36, 0.4);
                }

                .btn-confirm:active {
                    transform: scale(0.98);
                }
            `}</style>
        </div>
    )
}

export default TimeoutNotification
