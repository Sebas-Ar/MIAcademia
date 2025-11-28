import { Star } from 'lucide-react'

const PlanPopular = ({
    position = 'absolute'
}) => {
    return <span className="plan-popular">
        <div className="wrapper-icon">
            <Star size="1em" strokeWidth=".25em" />
        </div>
        Más Popular

        <style jsx>{`
            .plan-popular {
                background: var(--yellow);
                padding: .2em .5em;
                border-radius: .5em;
                position: ${position};
                right: .7em;
                top: .7em;
                font-weight: 700;
                display: flex;
                gap: .3em;
                align-items: center;
                border: .15em solid var(--dark-yellow);
            }

            .wrapper-icon {
                display: grid;
                place-items: center;
            }
            
        `}</style>
    </span>
}

export default PlanPopular
