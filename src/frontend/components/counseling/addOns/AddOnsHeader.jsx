const AddOnsHeader = () => {
    return <header>
        <h2>Complementos Opcionales</h2>
        <p>
            Potencia tu experiencia con nuestros servicios adicionales
        </p>

        <style jsx>{`
            header {
                text-align: center;
            }

            h2 {
                font-size: 2.8em;
                font-weight: 700;
                margin-bottom: 0.5em;
            }

            p {
                font-size: 1.4em;
                font-weight: 500;
                max-width: 48em;
                margin: 0 auto 1em;
                color: var(--dark-gray);
            }
        `}</style>
    </header>
}

export default AddOnsHeader
