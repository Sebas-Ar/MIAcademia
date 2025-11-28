import { CheckCircle } from 'lucide-react'

const PlanBenefits = ({
    benefitsList = []
}) => {
    return <ul>
        {benefitsList.map((benefit, index) => (
            <li key={index}>
                <span className="wrapper-icon">
                    <CheckCircle size="1.2em" strokeWidth=".13em" color="var(--green)" />
                </span>
                <span>
                    {benefit}
                </span>
            </li>
        ))}
        <style jsx>{`
            ul {
                list-style: none;
                padding: 0;
                margin: 0;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(25em, 1fr));
                gap: 1em;

            }

            li {
                font-size: 1.2em;
                color: var(--dark-gray);
                display: grid;
                grid-template-columns: auto 1fr;
            }

            .wrapper-icon {
                display: grid;
                place-items: center;
                height: 1.5em;
                width: 1.5em;
                margin-right: 0.5em;
            }
        `}</style>
    </ul>
}

export default PlanBenefits
