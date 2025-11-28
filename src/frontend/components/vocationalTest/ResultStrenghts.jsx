const ResultStrenght = ({ index = 0, category = '', strengthsDescription = '' }) => {
    if (index >= 3) return <></>
    return (
        <li className="container">

            <h4>
                {category}:
            </h4>
            <p>
                {strengthsDescription}
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

export default ResultStrenght
