const WrapperSection = ({
    children = <></>,
    icon = <></>,
    title = ''
}) => {
    return (
        <section className="wrapper-section">
            <header>
                <span className="wrapper-icon">
                    {icon}
                </span>
                <h2>{title}</h2>
            </header>
            {children}
            <style jsx>{`

                .wrapper-section {
                    padding: 2em;
                    background: var(--white);
                    border-radius: 1em;
                    border: .1em solid var(--gray);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .wrapper-section:hover {
                    box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);
                    transform: translateY(-0.2em);
                }

                header {
                    display: flex;
                    justify-items: start;
                    align-items: center;
                    gap: 1em;
                    margin-bottom: 2em;
                }

                h2 {
                    font-size: 1.6em;
                    font-weight: 600;
                }

                .wrapper-icon {
                    display: grid;
                    place-items: center;
                    height: 2em;
                    width: 2em;
                }

            `}</style>
        </section>
    )
}

export default WrapperSection
