import { AlertCircle, Briefcase, Compass, Lightbulb, Rocket, Users } from 'lucide-react'
import { Link } from 'next-view-transitions'
import Markdown from 'react-markdown'
import PlanHeader from './PlanHeader'
import PlanIncludesList from './PlanIncludesList'
import PlanPopular from './PlanPopular'
import PlanPrice from './PlanPrice'
import PlanPriceContact from './PlanPriceContact'
import PlanTime from './PlanTime'

const Plan = ({
    isPopular = false,
    route = '',

    title = '',
    subtitle = '',

    description = '',

    backgroundColor = 'var(--transparent-dark-blue)',
    transparentBackground = 'var(--transparent-yellow)',
    textColor = 'var(--dark-blue)',

    sessionsNumber = 0,
    sessionTime = 0,
    sessionTimeUnit = 'min',

    price = 0,
    numberDiscount = 10,

    includesList = [],

    btnText = ''
}) => {
    let icon = <></>

    switch (route) {
        case 'ruta-vocacional-completa':
            icon = <Compass size="65%" strokeWidth=".15em" />
            break
        case 'proyecta-tu-potencial':
            icon = <Rocket size="65%" strokeWidth=".15em" />
            break
        case 'impulsa-tu-perfil-profesional':
            icon = <Briefcase size="65%" strokeWidth=".15em" />
            break
        case 'exploracion-grupal':
            icon = <Users size="65%" strokeWidth=".15em" />
            break
        case 'descubrete-y-decide':
            icon = <Lightbulb size="65%" strokeWidth=".15em" />
            break
        // Add cases for other routes if needed
        default:
            icon = <Compass size="65%" strokeWidth=".15em" />
    }

    return <li>
        <article>
            {
                isPopular && <PlanPopular />
            }
            <div className="plan-description">
                <PlanHeader
                    icon={icon}
                    title={title}
                    subtitle={subtitle}
                    transparentBackground={transparentBackground}
                    textColor={textColor}
                />

                <div className="description">
                    <Markdown>
                        {description}
                    </Markdown>
                </div>

                <PlanTime
                    sessionsNumber={sessionsNumber}
                    sessionTime={sessionTime}
                    sessionTimeUnit={sessionTimeUnit}
                    transparentBackground={transparentBackground}
                    textColor={textColor}
                />

                {
                    price !== 0
                        ? <PlanPrice
                            price={price}
                            numberDiscount={numberDiscount}
                        />
                        : <PlanPriceContact />
                }

                <PlanIncludesList
                    includesList={includesList}
                />

                <div className="wrapper-link">
                    <Link href={`/asesoria-vocacional/planes/${route}`}>
                        <div className="btn-view-plan">
                            <span className="icon">
                                <AlertCircle />
                            </span>
                            <span className="link">
                                Ver plan detallado
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
            <footer>
                <Link href={`/asesoria-vocacional/agenda/${route}`}>
                    <span className="btn-action-plan">
                        {btnText}
                    </span>
                </Link>
            </footer>

            <style jsx>{`
                article {
                    background: ${backgroundColor};
                    border-radius: .5em;
                    max-width: 28em;
                    border: .2em solid var(--dark-blue);
                    position: relative;
                }

                .plan-description {
                    padding: 1.5em;
                    display: grid;
                    gap: 1.2em;
                }

                footer {
                    padding: 1em;
                    background: ${transparentBackground};
                    border-radius: 0 0 .3em .3em;
                }

                .wrapper-link {
                    display: grid;
                    justify-items: center;
                    align-items: center;
                    margin-top: .5em;
                }

                .link {
                    display: inline-block;
                    color: var(--dark-blue);
                    font-weight: 600;
                    font-size: .95em;
                    position: relative;
                }

                .link::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: -.1em;
                    transform: translateY(-50%);
                    width: 100%;
                    height: .15em;
                    background: var(--transparent-dark-blue);
                    border-radius: 1em;
                }


                .btn-view-plan {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: .5em;
                    transition: transform .3s;
                }

                .btn-view-plan:hover {
                    transform: scale(1.1);
                }

                .btn-action-plan {
                    display: block;
                    text-align: center;
                    background: var(--white);
                    border: .15em solid var(--dark-blue);
                    color: var(--dark-blue);
                    border-radius: .5em;
                    padding: .5em 1em;
                    font-weight: 600;
                    transition: transform .3s;
                }

                .btn-action-plan:hover {
                    transform: scale(1.05);
                }

            `}</style>
        </article>
    </li>
}

export default Plan
