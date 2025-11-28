import { HeartHandshake } from 'lucide-react'

const AboutMotivation = () => {
    return <section>
        <div className="wrapper-icon">
            <HeartHandshake strokeWidth=".13em" size="50%" />
        </div>
        <h2>Nuestra motivación</h2>
        <article>
            <p className="problem-text">
                En Colombia, acceder a la información educativa suele ser un proceso disperso, desigual y poco claro
            </p>
            <p className="motivation-text">
                Nuestra motivación es democratizar el acceso a la información académica, centralizándola y haciéndola comprensible para cualquier persona, sin importar su contexto o recursos
            </p>
            <h4>
                Queremos que nadie elija una carrera por presión o desinformación
            </h4>
        </article>

        <style jsx>{`
            section {
                display: grid;
                padding: 5em 3em;
                background: var(--blue);
                text-align: center;
                color: var(--white);
            }

            .wrapper-icon {
                background: var(--transparent-dark-blue);
                height: 5em;
                aspect-ratio: 1;
                border-radius: 50%;
                display: grid;
                place-items: center;
                justify-self: center;
            }

            h2 {
                font-size: 2.5em;
                font-weight: 600;
                margin: 1em .5em;
            }

            article {
                background: var(--transparent-dark-blue);
                padding: 3em;
                border-radius: 1em;
                display: grid;
                gap: 3em;
                max-width: 60em;
                margin-inline: auto;
            }

            .problem-text {
                font-size: 1.6em;
                font-weight: 500;
                color: var(--white);
            }

            .motivation-text {
                font-size: 1.2em;
                font-weight: 400;
                color: var(--white);
            }

            h4 {
                background: var(--transparent-dark-blue);
                padding: 2em;
                border-radius: .5em;
                font-size: 1.3em;
                font-weight: 600;
            }
        `}</style>
    </section>
}

export default AboutMotivation
