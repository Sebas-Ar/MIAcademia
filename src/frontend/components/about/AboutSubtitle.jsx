const AboutSubtitle = ({
    subtitle = '',
    description = ''
}) => {
    return <header>
        <h2>{subtitle}</h2>
        <p>{description}</p>

        <style jsx>{`
            header {
                display: grid;
                gap: 1.5em;
            }

            h2 {
                font-size: 2.3em;
                font-weight: 600;
                text-align: center;
            }

            p {
                font-size: 1.2em;
                text-align: center;
                max-width: 45em;
                justify-self: center;
            }
        `}</style>

    </header>
}

export default AboutSubtitle
