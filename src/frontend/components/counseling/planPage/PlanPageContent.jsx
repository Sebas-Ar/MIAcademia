'use client'

import { BookOpen, Info, TrendingUp, Users } from 'lucide-react'
import PlanBenefits from './PlanBenefits'
import PlanCallToAction from './PlanCallToAction'
import PlanDetails from './PlanDetails'
import PlanInfo from './PlanInfo'
import PlanWhoFor from './PlanWhoFor'
import WrapperSection from './WrapperSection'

const PlanPageContent = ({
    detailList = [],
    benefitsList = [],
    price = '',
    sessions = 0,
    duration = '',
    modalidad = '',
    entities = [],
    route = ''
}) => {
    console.log(detailList)
    return <div className="plan-page-content">
        <div className="wrapper-content">

            <div className="main">
                <WrapperSection
                    icon={<BookOpen size="100%" strokeWidth=".15em" color="var(--dark-yellow)" />}
                    title="Programa Detallado"
                >
                    <PlanDetails
                        detailList={detailList}
                    />
                </WrapperSection>
                <WrapperSection
                    icon={<TrendingUp size="100%" strokeWidth=".15em" color="var(--dark-yellow)" />}
                    title="Beneficios que Obtendrás"
                >
                    <PlanBenefits
                        benefitsList={benefitsList}
                    />
                </WrapperSection>
            </div>

            <aside>
                <WrapperSection
                    icon={<Info size="100%" strokeWidth=".15em" color="var(--dark-yellow)" />}
                    title="Información Rápida"
                >
                    <PlanInfo
                        price={price}
                        sessions={sessions}
                        duration={duration}
                        modalidad={modalidad}
                    />
                </WrapperSection>
                <WrapperSection
                    icon={<Users size="100%" strokeWidth=".15em" color="var(--dark-yellow)" />}
                    title="¿Para Quién es Este Plan?"
                >
                    <PlanWhoFor
                        entities={entities}
                    />
                </WrapperSection>

                <PlanCallToAction
                    route={route}
                />
            </aside>

        </div>
        <style jsx>{`
            .plan-page-content {
                padding: 2em;
            }

            .wrapper-content {
                margin: 2em auto;
                display: grid;
                gap: 2em;
                max-width: 100em;
            }

            aside, .main {
                display: grid;
                gap: 2em;
            }

            @media (min-width: 1350px) {
                .wrapper-content {
                    grid-template-columns: 2fr 1fr;
                }

                .main {
                    align-self: start;
                }

                aside {
                    grid-column: 2 / 3;
                    align-self: start;
                    position: sticky;
                    top: 2em;
                }
            }
        `}</style>
    </div>
}

export default PlanPageContent
