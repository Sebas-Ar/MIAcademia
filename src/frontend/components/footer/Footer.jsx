import { BookCheck } from 'lucide-react'
import { Link } from 'next-view-transitions'
import { useEffect, useRef, useState } from 'react'

const Footer = ({ backgroundColor = 'var(--dark-blue)' }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef(null)

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false)
            }
        }

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMenuOpen])

    return <footer>
        <div className="terms-conditions-wrapper" ref={menuRef}>
            <button
                className="terms-conditions-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Términos y condiciones"
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
            >
                <BookCheck strokeWidth=".1em" height="1.5em" aria-hidden="true" />
            </button>
            {isMenuOpen && (
                <nav
                    className="term-conditions-link-wrapper"
                    role="navigation"
                    aria-label="Políticas legales"
                >
                    <ul className="link-content">
                        <li>
                            <Link
                                href="/terminos-condiciones/politica-de-privacidad"
                                title="Lee nuestra política de privacidad y protección de datos"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Política de Privacidad
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/terminos-condiciones/condiciones-del-servicio"
                                title="Lee nuestras condiciones del servicio y términos de uso"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Condiciones del Servicio
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
        <p>©{new Date().getFullYear()} <span>MIAcademia Beta</span> | Todos los derechos reservados</p>
        <div></div>
        <style jsx>{`
            footer {
                display: grid;
                grid-template-columns: 2em 1fr 2em;
                gap: .5em;
                align-items: center;
                z-index: 10;
                background: ${backgroundColor};
                color: var(--white);
                text-align: center;
                padding: .5em 1em;
                font-weight: 200;
                z-index: 1111111111;
                view-transition-name: footer;
            }

            p {
                font-size: .8em;
            }

            span {
                font-weight: 500;
            }

            .terms-conditions-wrapper {
                position: relative;
            }

            .terms-conditions-btn {
                cursor: pointer;
                color: var(--white);
                display: grid;
                place-items: center;
                padding: 0 .5em;
                left: -1em;
                background: transparent;
                border: none;
                transition: transform .2s ease, color .2s ease;
            }

            .terms-conditions-btn:hover {
                transform: scale(1.1);
                color: var(--yellow);
            }

            .terms-conditions-btn:focus-visible {
                outline: 2px solid var(--yellow);
                outline-offset: 4px;
                border-radius: 4px;
            }

            .term-conditions-link-wrapper {
                position: absolute;
                bottom: calc(100% + 0.5em);
                left: -1em;
                padding: 1em;
                animation: slideUp 0.2s ease-out;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .link-content {
                display: flex;
                flex-direction: column;
                gap: .5em;
                align-items: flex-start;
                border-radius: .5em;
                background: var(--dark-blue);
                border: .15em solid var(--yellow);
                padding: .8em;
                list-style: none;
                margin: 0;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            
            .link-content li {
                width: 100%;
            }

            .link-content li :global(a) {
                font-size: .8em;
                color: var(--white);
                font-weight: 500;
                text-transform: capitalize;
                white-space: nowrap;
                text-decoration: underline;
                text-decoration-color: transparent;
                transition: text-decoration-color .2s ease, color .2s ease;
                display: block;
                padding: 0.4em 0.5em;
                border-radius: 0.3em;
            }

            .link-content li :global(a):hover {
                color: var(--yellow);
                text-decoration-color: var(--yellow);
                background: rgba(255, 255, 255, 0.05);
            }

            .link-content li :global(a):focus-visible {
                outline: 2px solid var(--yellow);
                outline-offset: 2px;
                background: rgba(255, 255, 255, 0.05);
            }
        `}</style>
    </footer>
}

export default Footer
