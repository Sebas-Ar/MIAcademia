const ResultInterpretation = ({ index = 0, category = '', interpretationProfile = '' }) => {
    if (index >= 3) return <></>
    return (
        <li className="container">

            <h4>
                {category} ({category[0]})
            </h4>
            <p>
                {interpretationProfile}
            </p>

            <style jsx>{`
                .container {
                    
                }

                h4 {
                    color: var(--yellow);
                    font-weight: 500;
                }

                p {
                    font-weight: 300;
                }
            `}</style>
        </li>
    )
}

export default ResultInterpretation
