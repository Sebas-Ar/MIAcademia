const AboutHero = () => {
    return <div className="wrapper-hero">
        <h3>Transformando el futuro educativo de Colombia</h3>
        <h1>Conoce MIAcademia</h1>
        <p>
            Creemos en una <span>educación sin barreras y accesible para todos</span>, por eso trabajamos para <span>democratizar el acceso a la educación</span>
        </p>
        <style jsx>{`
            .wrapper-hero {
                display: grid;
                gap: 1.5em;
                justify-items: center;
                padding: 2em;
                padding-bottom: 10em;
                background: linear-gradient(180deg, var(--yellow) 70%, var(--white) 100%);
                text-align: center;
            }

            h1 {
                font-size: 3.8em;
                font-weight: 700;
                letter-spacing: .0em;
                color: var(--white);
                line-height: 1em;
            }

            h3 {
                border: .25em solid var(--white);
                padding: .4em 1em;
                margin-bottom: 2em;
                border-radius: 3em;
                color: var(--white);
                font-size: .85em;
                font-weight: 700;
                letter-spacing: .04em;
            }

            p {
                font-weight: 400;
                font-size: 1.6em;
                max-width: 40em;
                color: var(--white);

                span {
                    font-weight: 700;
                }
            }
        `}</style>
    </div>
}

export default AboutHero
