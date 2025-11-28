const PlanPriceContact = () => {
    return <div className="wrapper">
        <p className="title">Precio Personalizado</p>
        <p className="description">Contacta con nuestro equipo de ventas</p>
        <style jsx>{`
            .wrapper {
                display: grid;
                gap: .5em;
                text-align: center;
                background: var(--transparent-yellow);
                padding: .7em;
                border-radius: .5em;
                border: var(--transparent-blue) .15em solid;
            }

            .title {
                font-weight: 600;
                font-size: 1.2em;
            }

            .description {
                font-size: .9em;
                font-weight: 500;
            }

        `}</style>
    </div>
}

export default PlanPriceContact
