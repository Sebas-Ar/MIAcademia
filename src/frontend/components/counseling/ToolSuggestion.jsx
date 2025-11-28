const ToolSuggestion = ({
    icon = <></>,
    title = '',
    description = '',
    color = 'blue'
}) => {
    return (
        <article>
            <div className="wrapper">
                <div className="tool">
                    {icon}
                </div>
                <hgroup>
                    <h3>{title}</h3>
                    <h4>{description}</h4>
                </hgroup>
            </div>

            <style jsx>{`

                article {
                    background: var(--transparent-${color});
                    border: .15em solid var(--${color});
                    border-radius: .5em;
                    display: grid;
                    place-items: center;
                    padding: 0em;
                    cursor: pointer;
                    transition: transform .3s;
                    height: 100%;
                    padding: 1em;
                    padding-bottom: 1.5em;

                }

                .wrapper {
                    display: grid;
                    gap: 1em;
                    justify-items: center;
                    grid-template-rows: auto auto;
                    text-align: center;
                }

                article:hover {
                    transform: scale(1.05);
                }

                .tool {
                }

                hgroup {
                    display: grid;
                    gap: .8em;
                    max-width: 20em;
                }

                h3 {
                    font-weight: 600;
                    font-size: 1.4em;
                    text-transform: capitalize;
                }

                h4 {
                    font-weight: 500;
                    font-size: 1em;
                }

                hgroup {
                    display: grid;
                    line-height: 1.4em;
                }
            `}</style>
        </article>
    )
}

export default ToolSuggestion
