import { Heart } from 'lucide-react'

const SocialBenefitsHeader = () => (
    <header>
        <div className="wrapper-icon">
            <Heart size="55%" strokeWidth=".15em" />
        </div>
        <h2>Convenios y Beneficios Sociales</h2>
        <style jsx>{`
            header {
                display: grid;
                justify-items: center;
                gap: 1em;
            }

            h2 {
                font-size: 2.8em;
                font-weight: 600;
            }

            .wrapper-icon {
                width: 5em;
                height: 5em;
                display: grid;
                place-items: center;
                background: var(--blue);
                border-radius: 50%;
                color: var(--white);
            }
        `}</style>
    </header>
)
export default SocialBenefitsHeader
