import { Target } from 'lucide-react'

const AboutVision = () => {
    return <section>
        <div className="wrapper-icon">
            <Target strokeWidth=".16em" size="55%" />
        </div>

        <h2>Nuestra visión</h2>
        <article>
            <p className="problem-text">
                Imaginamos un país en el que cada persona, sin importar su <span>edad, región o nivel socioeconómico</span>, pueda acceder fácilmente a la orientación y la información necesarias para construir su futuro académico y profesional
            </p>
            <h4>
                Queremos ser la plataforma de referencia en Colombia en temas de elección educativa, integrando tecnología, psicología y datos confiables para guiar decisiones que transformen vidas
            </h4>
        </article>

        <style jsx>{`

            section {
                display: grid;
                padding: 7em 3em 5em;
                background: linear-gradient(180deg, var(--white) 0%, var(--yellow) 30%, var(--yellow) 100%);   
                text-align: center;
                color: var(--white);
            }

            .wrapper-icon {
                color: var(--white);
                background: var(--yellow);
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
                border: .4em solid var(--white);
                padding: 3em;
                border-radius: 1em;
                display: grid;
                gap: 3em;
                max-width: 60em;
                margin-inline: auto;
            }

            .problem-text {
                font-size: 1.5em;
                font-weight: 500;
            }

            .problem-text span {
                font-weight: 800;
            }

            h4 {
                background: var(--white);
                color: var(--dark-blue);
                padding: 2em;
                border-radius: .5em;
                font-size: 1.2em;
                font-weight: 600;
            }
        `}</style>
    </section>
}

export default AboutVision
