const PlanHeader = ({
    icon = <></>,
    title = '',
    subtitle = '',
    transparentBackground = '',
    textColor = ''
}) => {
    return <header>
        <div className="icon-wrapper">
            {icon}
        </div>
        <hgroup>
            <h3>{title}</h3>
            <h4>
                <span>
                    {subtitle}
                </span>
            </h4>
        </hgroup>

        <style jsx>{`
            header {
                display: grid;
                gap: 1em;
            }

            .icon-wrapper {
                display: grid;
                height: 3.7em;
                width: 3.7em;
                place-items: center;
                border-radius: 1em;
                background: ${transparentBackground};
                justify-self: center;
                color: ${textColor};
            }

            hgroup {
                text-align: center;
            }
            
            h3 {
                font-size: 1.7em;
                font-weight: 600;
                text-transform: capitalize;
                z-index: 1;
            }
            
            h4 {
                color: ${textColor};
                font-size: 1.1em;
                font-weight: 600;
                text-transform: capitalize;
                background: ${transparentBackground};
                justify-self: center;
                border-radius: .5em;
                padding: 0 .4em;

                    span {
                        opacity: ${textColor === 'var(--white)' ? '.9' : '.7'};
                    }
            }

        `}</style>
    </header>
}

export default PlanHeader
