'use client'

const VocationalPropertie = ({
    name = '',
    descripcion = '',
    icon = <></>,
    option = null
}) => {
    return (
        <section className="property">

            <h4>{name}</h4>
            <p>{descripcion}</p>
            <div className="icon-wrapper">
                {icon}
            </div>

            <style jsx>{`
                .property {
                    position: relative;
                    display: grid;
                    grid-template-columns: auto 1fr;
                    gap: .5em
                }

                h4 {
                    font-weight: 500;
                    text-transform: capitalize;
                }

                p {
                    font-weight: 300;
                    font-size: .8em;
                }

                .icon-wrapper {
                    background: var(--transparent-dark-blue);
                    align-self: start;
                    padding: .4em .5em;
                    color: var(--yellow);
                    grid-row: 1/3;
                    margin-right: .5em;
                    display: grid;
                    border-radius: 0 .5em .5em 0;
                }
            `}</style>
        </section>
    )
}

export default VocationalPropertie
