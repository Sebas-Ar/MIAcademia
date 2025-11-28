import { Clock } from 'lucide-react'

const PlanDetails = ({
    detailList = [
        {
            title: 'Entrevista Inicial y Evaluación',
            description: 'Comenzamos con una entrevista para conocer tus intereses, habilidades y aspiraciones',
            duration: '60 min'
        }
    ]
}) => {
    return (
        <ul className="plan-details-list">
            {detailList.map((detail, index) => (
                <li key={index} className="plan-detail">
                    <article>
                        <span className="number">{index + 1}</span>
                        <div className="content">
                            <h3>{detail.title}</h3>
                            <p>{detail.description}</p>
                            <div className="time">
                                <span className="wrapper-icon">
                                    <Clock size="1.4em" strokeWidth=".15em" />
                                </span>
                                <span className="duration">
                                    {detail.duration}
                                </span>
                            </div>
                        </div>
                    </article>
                </li>
            ))}
            <style jsx>{`
                .plan-details-list {
                    display: flex;
                    flex-direction: column;
                    gap: 2em;
                }

                .plan-detail {
                    
                }

                article {
                    display: grid;
                    grid-template-columns: auto 1fr;
                    gap: 1em;
                }

                .number {
                    font-size: 1.5em;
                    font-weight: bold;
                    color: var(--blue);
                    background: var(--yellow);
                    align-self: start;
                    height: 2.2em;
                    width: 2.2em;
                    border-radius: 50%;
                    display: grid;
                    place-items: center;
                }

                .content {
                    display: grid;
                    gap: 0.5em;
                }

                h3 {
                    font-size: 1.2em;
                    font-weight: 600;

                }

                p {
                    font-size: 1.1em;
                    font-weight: 500;
                    color: var(--dark-gray);
                }

                .time {
                    display: flex;
                    align-items: center;
                    gap: 0.5em;
                    color: var(--dark-gray);
                    font-weight: 500;
                }

                .wrapper-icon {
                    display: grid;
                    place-items: center;
                }

                .duration {

                }
            `}</style>
        </ul>
    )
}

export default PlanDetails
