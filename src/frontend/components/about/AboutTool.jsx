const AboutTool = ({
    titlte = '',
    description = '',
    icon = <></>,
    border = 'unset',
    backgroundColor = 'unset',
    iconBackground = 'unset',
    titleColor = 'var(--dark-yellow)',
    textColor = 'var(--dark-blue)'
}) => {
    return <article>
        <div className="wrapper-icon">
            {icon}
        </div>
        <h4>{titlte}</h4>
        <p>{description}</p>
        <style jsx>{`
            article {
                display: grid;
                justify-items: center;
                background: ${backgroundColor};
                max-width: 29em;
                padding: 2em 1.6em;
                border-radius: 1em;
                box-shadow: 0 .6em 1.5em -1em #0000;
                transition: transform .3s, box-shadow .3s, border .3s;
                border: ${border};
            }

            article:hover {
                box-shadow: 0 .6em 1.5em -1em #0007;
                transform: scale(1.05);
                border-color: ${iconBackground};
            }

            .wrapper-icon {
                background: ${iconBackground};
                color: var(--white);
                height: 4em;
                aspect-ratio: 1;
                border-radius: 50%;
                display: grid;
                place-items: center;
                margin-bottom: 1.3em;
                transition: transform .3s;
            }

            article:hover .wrapper-icon {
                transform: rotate(10deg);
            }

            h4 {
                font-size: 1.5em;
                font-weight: 600;
                margin-bottom: .5em;
                color: ${titleColor};
            }

            p {
                text-align: center;
                font-weight: 500;
                color: ${textColor};
            }
        `}</style>

    </article>
}

export default AboutTool
