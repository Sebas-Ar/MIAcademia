import Plan from './Plan'

const PlansList = ({
    plans = [],
    servicesTitleRef = null
}) => {
    console.log(plans[0])
    return <section ref={servicesTitleRef} className="wrapper">
        <h2>Nuestros servicios</h2>
        <p>
            Elige el plan que mejor se adapte a tus necesidades y objetivos profesionales
        </p>
        <ul className="plans-wrapper">
            {plans.map((plan, index) => (
                <Plan
                    key={index}
                    isPopular={plan.isPopular}
                    route={plan.route}

                    title={plan.title}
                    subtitle={plan.subtitle}

                    description={plan.descriptionShort}

                    backgroundColor={plan.backgroundColor}
                    transparentBackground={plan.transparentBackground}
                    textColor={plan.textColor}

                    sessionsNumber={plan.sessionsNumber}
                    sessionTime={plan.sessionTime}
                    sessionTimeUnit={plan.sessionTimeUnit}

                    price={plan.price}
                    numberDiscount={plan.numberDiscount}

                    includesList={plan.detailList}

                    btnText={plan.btnText}
                />
            ))}
        </ul>

        <style jsx>{`
                .wrapper {
                    padding: 5em 2em;
                    display: grid;
                }

                h2 {
                    margin: auto;
                    padding: 0 1em;
                    border-radius: .5em;
                    background: var(--transparent-blue);
                    text-align: center;
                    font-size: 2.8em;
                    font-weight: 600;
                    color: var(--dark-blue);
                }

                p {
                    text-align: center;
                    font-size: 1.2em;
                    font-weight: 500;
                    padding: 1.5em 0;
                    max-width: 35em;
                    margin: 0 auto;
                }

                .plans-wrapper {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 2em;
                    padding: 3em;
                }
            `}</style>
    </section>
}

export default PlansList
