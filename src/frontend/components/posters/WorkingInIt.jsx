import { TypeAnimation } from 'react-type-animation'

const textOptions = {
    becas: 'Estamos entrenando una Inteligencia Artificial que transformará tu búsqueda de becas académicas. Pronto podrás descubrir oportunidades perfectamente adaptadas a tu perfil, intereses y metas.',
    financiación: 'Estamos desarrollando una herramienta con Inteligencia Artificial que te permitirá comparar diferentes opciones de financiamiento lado a lado, ayudándote a tomar la mejor decisión para tu futuro.'
}

const WorkingInIt = ({
    title = ''
}) => {
    return (
        <section>
            <article className="content">
                <h2>{title}</h2>
                <img src="/404/404.svg" alt="working in it" />
                <div className="description">
                    {
                        title !== 'programas' &&
                        <TypeAnimation
                            sequence={[textOptions[title]]}
                            wrapper="p"
                            cursor={false}
                            repeat={0}
                            style={{ padding: '1em .5em' }}
                            speed={110}

                        />
                    }
                </div>
            </article>

            <style jsx>{`

                .content {
                    display: grid;
                    grid-template-rows: auto 1fr;
                    z-index: 1;
                    gap: 1.2em; 
                    justify-items: center;
                }

                h2 {
                    font-size: 1.5em;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                img {
                    position: relative;
                    width: 12em;
                }

                .description {
                    text-align: center;
                    font-weight: 600;
                    max-width: 30em;
                    color: var(--white);
                    border-radius: .5em;
                }
            `}</style>
        </section>
    )
}

export default WorkingInIt
