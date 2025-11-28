import { BookAlert, ChevronDown, ChevronUp, CircleAlert, RefreshCw } from 'lucide-react'
import { useState } from 'react'

const SchedulingRules = () => {
    const [isExpanded, setIsExpanded] = useState(false)

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <article className="rules-wrapper">
            <header className="rules-header" onClick={toggleExpanded}>
                <h3>
                    <span className="wrapper-main-icon">
                        <BookAlert size="1.5em" strokeWidth=".1em" />
                    </span>
                    Reglas de Agendamiento
                    <span className="expand-icon">
                        {isExpanded ? <ChevronUp size="1.2em" /> : <ChevronDown size="1.2em" />}
                    </span>
                </h3>
                <p>Información importante sobre tus sesiones</p>
            </header>

            <ul className={`rules-list ${isExpanded ? 'expanded' : 'collapsed'}`}>
                <li className="rules-item highlight">
                    <span className="wrapper-icon">
                        <RefreshCw size="1.4em" strokeWidth=".15em" />
                    </span>
                    <div className="rules-content">
                        <span className="rules-text">Reagendamientos gratuitos</span>
                        <span className="rules-value">2 disponibles</span>
                    </div>
                </li>
                <li className="rules-item">
                    <span className="wrapper-icon">
                        <CircleAlert size="1.4em" strokeWidth=".15em" />
                    </span>
                    <div className="rules-content">
                        <span className="rules-text">Cancelaciones</span>
                        <span className="rules-value">Con 24h de anticipación</span>
                    </div>
                </li>
            </ul>

            <style jsx>{`
                .rules-wrapper {
                    max-width: 600px;
                    margin: 2em auto;
                    padding: 2em;
                    border-radius: 1em;
                    background: linear-gradient(135deg, #ffffff, #f8fafc);
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    text-align: center;
                }

                .rules-header {
                    margin-bottom: ${isExpanded ? '2em' : '0'};
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    user-select: none;
                }

                .rules-header:hover {
                    transform: translateY(-2px);
                }

                .rules-header h3 {
                    margin: 0 0 0.5em 0;
                    font-size: 1.4em;
                    font-weight: 700;
                    color: var(--dark-blue, #1e40af);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5em;
                    position: relative;
                }

                .expand-icon {
                    position: absolute;
                    right: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 1.5em;
                    height: 1.5em;
                    transition: transform 0.3s ease;
                    color: var(--blue, #3b82f6);
                }

                .expand-icon svg {
                    display: block;
                    margin: auto;
                }

                .wrapper-main-icon {
                    display: grid;
                    place-items: center;
                }

                .rules-header p {
                    margin: 0;
                    font-size: 0.95em;
                    color: var(--dark-gray, #64748b);
                    font-weight: 500;
                }

                .rules-list {
                    display: grid;
                    gap: 1.2em;
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .rules-list.collapsed {
                    max-height: 0;
                    opacity: 0;
                    margin-top: 0;
                    margin-bottom: 0;
                    transform: translateY(-20px);
                    pointer-events: none;
                }

                .rules-list.expanded {
                    max-height: 500px; /* Ajusta según el contenido */
                    opacity: 1;
                    margin-top: 2em;
                    margin-bottom: 0;
                    transform: translateY(0);
                    pointer-events: all;
                }

                .rules-item {
                    display: flex;
                    align-items: center;
                    gap: 1em;
                    padding: 1.2em 1.5em;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.8em;
                    transition: all 0.3s ease, opacity 0.4s ease, transform 0.4s ease;
                    text-align: left;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
                }

                .rules-list.collapsed .rules-item {
                    opacity: 0;
                    transform: translateY(-10px) scale(0.98);
                }

                .rules-list.expanded .rules-item {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }

                .rules-list.expanded .rules-item:nth-child(1) {
                    transition-delay: 0.1s;
                }

                .rules-list.expanded .rules-item:nth-child(2) {
                    transition-delay: 0.2s;
                }

                .rules-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
                    border-color: var(--blue, #3b82f6);
                }

                .rules-item.highlight {
                    border: 2px solid var(--yellow, #fbbf24);
                    position: relative;
                    overflow: hidden;
                }

                .wrapper-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 3em;
                    height: 3em;
                    border-radius: 50%;
                    background: var(--blue, #dbeafe);
                    color: white;
                    flex-shrink: 0;
                    transition: all 0.3s ease;
                }

                .rules-item.highlight .wrapper-icon {
                    background: var(--yellow, #fbbf24);
                }

                .rules-item:hover .wrapper-icon {
                    transform: scale(1.1);
                }

                .rules-content {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.2em;
                }

                .rules-text {
                    font-weight: 600;
                    font-size: 1em;
                    color: var(--dark-blue, #1e40af);
                    margin: 0;
                }

                .rules-value {
                    font-weight: 500;
                    font-size: 0.9em;
                    color: var(--dark-gray, #64748b);
                    margin: 0;
                }

                .rules-item.highlight .rules-value {
                    color: var(--dark-gray, #92400e);
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .rules-wrapper {
                        margin: 1em;
                        padding: 1.5em;
                    }

                    .rules-header h3 {
                        font-size: 1.2em;
                    }

                    .expand-icon {
                        position: static;
                        margin-left: auto;
                    }

                    .rules-item {
                        padding: 1em;
                        gap: 0.8em;
                    }

                    .wrapper-icon {
                        width: 2.5em;
                        height: 2.5em;
                    }

                    .rules-text {
                        font-size: 0.95em;
                    }

                    .rules-value {
                        font-size: 0.85em;
                    }
                }
            `}</style>
        </article>
    )
}

export default SchedulingRules
