const PlanInfo = ({
    price = '',
    sessions = 0,
    duration = '',
    modalidad = ''
}) => {
    return (
        <dl>
            <div className="item">
                <dt>Precio</dt>
                <dd>{price}</dd>
            </div>
            <div className="item">
                <dt>Sesiones</dt>
                <dd>{sessions}</dd>
            </div>
            <div className="item">
                <dt>Duración</dt>
                <dd>{duration}</dd>
            </div>
            <div className="item">
                <dt>Modalidad</dt>
                <dd>{modalidad}</dd>
            </div>

            <style jsx>{`
                dl {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 1em;
                }
                dt {
                    font-weight: bold;
                    font-size: 1.2em;
                }

                dd {
                    font-size: 1.1em;
                }
            `}</style>
        </dl>
    )
}

export default PlanInfo
