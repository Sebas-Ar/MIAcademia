import Markdown from 'react-markdown'

const AboutServiceItem = ({
    icon = <></>,
    title = '',
    subtitle = '',
    colorSubtitle = 'var(--dark-blue)',
    description = '',
    subItemList = null,
    backgroundColor = '',
    iconBackgroundColor = '',
    textColor = 'var(--dark-blue)'
}) => {
    return <article className="wrapper-item">
        <div className="wrapper-icon">
            {icon}
        </div>
        <div className="content">
            <hgroup>
                <h3>{title}</h3>
                <h4>{subtitle}</h4>
            </hgroup>
            <div className="description">
                <Markdown>
                    {description}
                </Markdown>
            </div>
            {
                subItemList && <div className="wrapper-sub-item-list">
                    {
                        subItemList.map((subItem, index) => (
                            <article key={index} className="sub-item">
                                <h5>{subItem.title}</h5>
                                <p>{subItem.description}</p>
                            </article>
                        ))
                    }
                </div>

            }
        </div>

        <style jsx>{`

            .wrapper-item {
                display: grid;
                grid-template-columns: auto 1fr;
                gap: 2em;
                padding: 3em 2em;
                border-radius: 1em;
                box-shadow: 0 .6em 1.5em -1em #0000;
                max-width: 70em;
                background: ${backgroundColor};
                color: ${textColor};
                transition: transform .3s, box-shadow .3s;
            }

            .wrapper-icon {
                align-self: center;
                background: ${iconBackgroundColor};
                height: 4.5em;
                aspect-ratio: 1;
                border-radius: 50%;
                display: grid;
                place-items: center;
                color: var(--white);
                transition: transform .3s;
            }

            h3, h4 {
                display: inline-block;
            }

            h3 {
                font-size: 1.8em;
                font-weight: 600;
                margin-right: .5em;
                margin-bottom: .5em;
            }

            h4 {
                font-size: .9em;
                font-weight: 600;
                background: ${iconBackgroundColor};
                color: ${colorSubtitle};
                position: relative;
                bottom: .3em;
                padding: .2em 1em;
                border-radius: 1em;
            }

            .content {
                display: grid;
                gap: .5em;
            }
            
            .description {
                font-size: 1.1em;
            }

            .wrapper-sub-item-list {
                display: grid;
                gap: 1em;
                grid-template-columns: 1fr 1fr 1fr;
                margin-top: 1.5em;
            }

            .sub-item {
                background: ${iconBackgroundColor};
                color: ${colorSubtitle};
                padding: 1em;
                border-radius: 1em;
                min-width: 13em;
            }

            .sub-item h5 {
                font-size: 1.1em;
                font-weight: 600;
                margin-bottom: .5em;
            }

            @media (width <= 860px) {
                .wrapper-item {
                    grid-template-columns: auto;
                    gap: 1em;
                    justify-items: center;
                    text-align: center;
                }

                hgroup {
                    margin: auto;
                    display: grid;
                    justify-items: center;
                }

                h3 {
                    margin-right: 0;
                }

                h4 {
                    margin-bottom: 1em;
                    bottom: 0;
                }

                .wrapper-sub-item-list {
                    grid-template-columns: 1fr 1fr;
                }

                .sub-item:last-child {
                    grid-column: 1/3;
                }
            }

            @media (width <= 560px) {
                .wrapper-sub-item-list {
                    grid-template-columns: 1fr;
                }

                .sub-item {
                    padding-inline: 5em;
                }

                .sub-item:last-child {
                    grid-column: 1/2;
                }
            }
        `}</style>
    </article>
}

export default AboutServiceItem
