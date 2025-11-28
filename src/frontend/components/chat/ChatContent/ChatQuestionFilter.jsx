
const ChatQuestionFilter = ({
    filterName = '',
    filterValue = null,
    icon = <></>
}) => {
    if (!filterValue) return null

    return (
        <li className="tag">
            <span className="value">
                <div className="icon">
                    {icon}
                </div>
                {filterValue}
            </span>
            <span className="property-title">
                {filterName}
            </span>

            <style jsx>{`
                .tag {
                    position: relative;
                    margin-bottom: .5em;
                    cursor: pointer;

                    .property-title {
                        font-size: 0em;
                        text-align: center;
                        position: absolute;
                        bottom: calc(50%);
                        font-weight: 700;
                        width: 100%;
                        border-radius: 1em;
                        background-color: var(--blue);
                        border: .2em solid var(--blue);
                        color: var(--yellow);
                        box-shadow: 0em 0em .5em .5em var(--yellow);
                        transition: font-size .1s, padding .1s;

                    }

                    &:hover .property-title {
                        padding: .5em .5em 2.5em .5em;
                        font-size: .7em;
                        bottom: calc(0%);
                    }

                    .value {
                        position: relative;
                        z-index: 1;
                        display: flex;
                        gap: .1em;
                        align-items: center;
                        font-weight: 700;
                        border: .2em solid var(--blue);
                        background-color: var(--white);
                        color: var(--blue);
                        border-radius: 2em;
                        transition: font-size 1s, padding 1s;
                        padding: .2em .8em .2em .3em;
                        text-transform: capitalize;
                        font-size: .7em;

                        .icon {
                            height: 1.3em;
                        }
                    }
                }


            `}</style>
        </li>
    )
}

export default ChatQuestionFilter
