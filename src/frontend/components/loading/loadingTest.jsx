import { useEffect, useState } from 'react'

const textList = [
    'Analizando tus respuestas para identificar tus intereses y habilidades...',
    'Comparando tus perfiles con cientos de programas académicos...',
    'Procesando tus preferencias con modelos de inteligencia artificial...',
    'Buscando coincidencias entre tu perfil y posibles carreras ideales...',
    'Identificando áreas clave para tu desarrollo profesional...',
    'Desarrollando recomendaciones personalizadas para ti...',
    'Organizando los resultados según tus aptitudes y metas...',
    'Filtrando opciones académicas alineadas a tu vocación...',
    'Construyendo un mapa de tus intereses y fortalezas...'
]

const LoadingTest = () => {
    const [textToShow, setTestToShow] = useState(textList[0])

    // change textToShow to next every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setTestToShow(textList[Math.floor(Math.random() * textList.length)])
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="loading">
            <svg viewBox="0 0 1000 1000" >
                <circle className="st3067 st3067--transparent" cx="500" cy="500" r="240"/>
                <circle className="st3067" cx="500" cy="500" r="160"/><circle className="st3067 st3067--small" cx="500" cy="500" r="160" transform="rotate(0 500 500)">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="-360 500 500" dur="5s" repeatCount="indefinite"/>
                </circle>
                <circle className="st3067 st3067--medium" cx="500" cy="500" r="240" transform="rotate(0 500 500)"
                ><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="-360 500 500" dur="4s" repeatCount="indefinite"/>
                </circle>
                <circle className="st3067" cx="500" cy="500" r="320"/><circle className="st3067 st3067--three" cx="500" cy="500" r="320" transform="rotate(0 500 500)">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="-360 500 500" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle className="st3067" cx="500" cy="500" r="400"/><circle className="st3067 st3067--large" cx="500" cy="500" r="400" transform="rotate(0 500 500)">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="-360 500 500" dur="5s" repeatCount="indefinite"/>
                </circle>
                <circle className="st3067" cx="500" cy="500" r="480"/><circle className="st3067 st3067--xlarge" cx="500" cy="500" r="480" transform="rotate(0 500 500)">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 500 500" to="-360 500 500" dur="5s" repeatCount="indefinite"/>
                </circle>
            </svg>
            <p>
                {textToShow}
            </p>

            <style jsx>{`
                
                .loading {
                    display: grid;
                    gap: 2em;
                    place-items: center;
                    font-size: 1.5em;
                    margin: 1.5em;
                }

                p {
                    text-align: center;
                    max-width: 30rem;
                }

                svg {
                    height: 5em;
                    color: var(--yellow);
                }

                .st3067 {
                    fill: none;
                    stroke: currentColor;
                    stroke-width: 0pt;
                    stroke-miterlimit: 10;
                }

                .st3067--transparent {
                    stroke: rgba(#ffffff, 0);
                }

                .st3067--xlarge {
                    stroke-linecap: square;
                    stroke-dasharray: 2000, 513;
                    stroke-width: 20;
                }

                .st3067--large {
                    stroke-linecap: square;
                    stroke-dasharray: 1500, 1013;
                    stroke-width: 20;
                }

                .st3067--medium {
                    stroke-linecap: square;
                    stroke-dasharray: 1000, 1513;
                    stroke-width: 20;
                }

                .st3067--small {
                    stroke-linecap: square;
                    stroke-dasharray: 500, 2013;
                    stroke-width: 20;
                }

                .st3067--xsmall {
                    stroke-linecap: square;
                    stroke-dasharray: 100, 2413;
                    stroke-width: 20;
                }

                .st3067--three {
                    stroke-linecap: square;
                    stroke-dasharray: 320, 320;
                    stroke-width: 20;
                }
                
            `}</style>
        </div>

    )
}

export default LoadingTest
