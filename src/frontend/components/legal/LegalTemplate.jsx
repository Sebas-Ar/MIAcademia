
const LegalTemplate = ({
    title = '',
    date = '',
    generalDescription = '',
    sectionsList = []
}) => {
    return (
        <div className="wrapper-content">
            <section>
                <h1>{title}</h1>
                <span>Última actulización: {date}</span>
                <p className="main-description">{generalDescription}</p>
                <div className="wrapper-sections-list">
                    {
                        sectionsList.map((section, index) => (
                            <article key={index}>
                                <h3>{index + 1}. {section.title}</h3>
                                <div className="content">

                                    <p>{section.description}</p>
                                    {
                                        section.contentSections &&
                                        <ul>
                                            {
                                                section.contentSections.map((contentSection, index) => (
                                                    <li key={index}>
                                                        <h4>{contentSection.title}</h4>
                                                        {
                                                            contentSection?.list &&
                                                            <ul>
                                                                {
                                                                    contentSection?.list?.map((listItem, index) => (
                                                                        <li key={index}>{listItem}</li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        }
                                                        {
                                                            contentSection?.description &&
                                                            <p>{contentSection?.description}</p>
                                                        }
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    }
                                    <p>{section.finalText}</p>
                                </div>
                            </article>
                        ))
                    }
                </div>
            </section>

            <style jsx>{`
                .wrapper-content {
                    position: relative;
                    background: var(--transparent-dark-blue);
                    margin: 0 2em 1.5em;
                    border-radius: .5em;
                    padding: 1.5em;
                    max-width: 70em;
                    justify-self: center;
                }

                h1 {
                    font-size: 1.5em;
                    font-weight: 600;
                    text-transform: uppercase;
                    text-align: center;
                }
                
                span {
                    font-size: .8em;
                    font-weight: 400;
                    text-align: center;
                    display: block;
                    margin-bottom: 2em;
                }

                .main-description {
                    font-weight: 500;
                    text-align: center;
                }

                .wrapper-sections-list {
                    margin-top: 2em;
                    display: grid;
                    gap: 1.5em;
                }

                article {
                    border-top: .15em solid var(--transparent-dark-blue);
                    padding: 1.5em;
                }


                article > h3 {
                    font-size: 1.2em;
                    font-weight: 600;
                    text-transform: uppercase;
                    text-align: center;
                }

                article > .content {
                    display: grid;
                    gap: 1.5em;
                }

                article > .content > p {
                    font-weight: 400;
                    text-align: center;
                }

                article > .content > ul {
                    display: flex;
                    flex-grow: 1;
                    flex-wrap: wrap;
                    gap: 1.5em;
                    justify-content: space-around;
                }

                article > .content > ul > li {
                    flex-basis: 20em;
                    position: relative;
                    list-style: upper-latin;
                    padding-right: 1em;
                    position: relative;
                    left: 1.5em;
                    padding-right: 1em;
                }

                article > .content > ul > li > h4 {
                    font-size: 1em;
                    font-weight: 600;
                    text-transform: capitalize;
                    margin-bottom: .5em;
                }

                article > .content > ul > li > ul {
                    
                }

                article > .content > ul > li > ul > li {
                    position: relative;
                    padding-left: 1em;
                }

                article > .content > ul > li > ul > li:before {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: .5em;
                    width: .5em;
                    height: .5em;
                    border-radius: 50%;
                    background-color: var(--transparent-dark-blue);
                }





            `}</style>
        </div>
    )
}

export default LegalTemplate
