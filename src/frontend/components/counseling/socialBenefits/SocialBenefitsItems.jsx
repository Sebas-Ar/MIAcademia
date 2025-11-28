const { Gift, Users } = require('lucide-react')

const SocialBenefitsItems = () => {
    return (
        <div className="benefits-wrapper">
            <article>
                <div className="wrapper-icon">
                    <Gift size="100%" strokeWidth=".15em" />
                </div>
                <h3>
                    Descuentos hasta 50%
                </h3>
                <p>
                    Para estudiantes de bajos recursos económicos
                </p>
            </article>
            <article>
                <div className="wrapper-icon">
                    <Users size="100%" strokeWidth=".15em" />
                </div>
                <h3>
                    Convenios Institucionales
                </h3>
                <p>
                    Alianzas con fundaciones y colegios
                </p>
            </article>
            <style jsx>{`
                .benefits-wrapper {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(15em, 34em));
                    gap: 2em;
                    justify-content: center;
                    margin: auto;
                }

                article {
                    background: var(--white);
                    padding: 2em;
                    border-radius: .5em;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    display: grid;
                    justify-items: center;
                    gap: 1em;
                }

                .wrapper-icon {
                    width: 3.5em;
                    height: 3.5em;
                    display: grid;
                    place-items: center;
                    border-radius: 50%;
                    color: var(--blue);
                }

                h3 {
                    font-size: 1.4em;
                    font-weight: 600;
                }

                p {
                    font-size: 1.1em;
                    font-weight: 500;
                    color: var(--dark-gray);
                }
            `}</style>
        </div>
    )
}

export default SocialBenefitsItems
