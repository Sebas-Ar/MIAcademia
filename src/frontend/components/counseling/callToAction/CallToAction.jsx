const CallToAction = () => {
    return (
        <section>
            <h2>Potencia tu Futuro</h2>
            <p>
                No esperes más para tomar el control de tu futuro profesional. Nuestros expertos están listos para acompañarte en este importante paso
            </p>
            <div className="wrapper-buttons">
                <button className="btn-primary">
                    Iniciar Mi Proceso Vocacional
                </button>
                <button className="btn-secondary">
                    Contáctanos
                </button>
            </div>
            <div className="line"></div>

            <style jsx>{`
                section {
                    background: var(--yellow);
                    padding: 4em 2em 0;
                    text-align: center;
                    color: var(--white);
                    display: grid;
                    gap: 1.5em;
                    justify-items: center;
                }

                h2 {
                    font-size: 2.4em;
                    font-weight: 700;
                }

                p {
                    font-size: 1.5em;
                    font-weight: 500;
                    max-width: 41em;
                    margin: 0 auto 1em;
                }

                .wrapper-buttons {
                    display: flex;
                    gap: 1.5em;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                button {
                    font-size: 1.2em;
                    border: .2em solid var(--white);
                    color: var(--white);
                    border-radius: .5em;
                    padding: .5em 2em;
                    font-weight: 600;
                    margin-bottom: 0em;
                }

                .btn-primary {
                    background: var(--white);
                    color: var(--yellow);
                }

                .line {
                    width: 17em;
                    height: .3em;
                    background: var(--white);
                    margin: 2em auto;
                    border-radius: 1em;
                }
            `}</style>
        </section>
    )
}

export default CallToAction
