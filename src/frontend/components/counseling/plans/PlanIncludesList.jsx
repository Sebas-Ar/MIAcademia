import { Check } from 'lucide-react'

const PlanIncludesList = ({
    includesList = []
}) => {
    return <ul className="includes-list-wrapper">
        {
            includesList.map((includes, index) => {
                return <li key={index}>
                    <div className="wraper-icon">
                        <Check height="1.5em" strokeWidth=".16em" />
                    </div>
                    <p>
                        {includes.title}
                    </p>
                </li>
            })
        }

        <style jsx>{`

            ul {
                display: grid;
                gap: .5lh;
            }

            li {
                display: flex;
                align-items: center;
                gap: .5em;
            }

            .wraper-icon {
                display: grid;
                place-items: center;
                color: var(--green);
            }
        `}</style>
    </ul>
}

export default PlanIncludesList
