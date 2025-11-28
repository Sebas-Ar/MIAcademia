import SocialBenefitsHeader from './SocialBenefitsHeader'
import SocialBenefitsItems from './SocialBenefitsItems'

const SocialBenefits = () => {
    return <section>
        <SocialBenefitsHeader />

        <p>
            Creemos que todos merecen acceso a orientación vocacional de calidad. Por eso trabajamos con fundaciones y organizaciones para ofrecer descuentos especiales a personas con recursos limitados
        </p>

        <SocialBenefitsItems />

        <button>
            Consultar Disponibilidad de Beneficios
        </button>

        <style jsx> {`
            section {
                background: var(--transparent-blue);
                padding: 5em 2em;
                text-align: center;
                width: 100%;
            }

            p {
                text-align: center;
                font-size: 1.2em;
                font-weight: 500;
                max-width: 48em;
                margin: 2.5em auto;
            }

            button {
                font-size: 1.2em;
                background: var(--blue);
                border: .15em solid var(--dark-blue);
                color: var(--white);
                border-radius: .5em;
                padding: .7em 2em;
                font-weight: 600;
                margin-top: 3em;
            }
        `}</style>
    </section>
}

export default SocialBenefits
