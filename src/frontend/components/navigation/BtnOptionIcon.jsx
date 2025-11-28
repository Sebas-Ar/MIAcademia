
const BtnOptionIcon = ({
    onClick = () => { },
    icon = null,
    text = '',
    directionOpen = 'right',
    isActive = false
}) => {
    return (
        <button onClick={onClick}>
            <div className="icon">
                {icon}
            </div>
            <span>{text}</span>

            <style jsx>{`
                button {
                    text-align: center;
                    border: .15em solid var(--black);
                    border-radius: 2em;
                    padding: ${isActive ? '.2em .5em' : '.2em'};
                    text-transform: uppercase;
                    font-weight: 600;
                    font-size: .8em;
                    background: ${isActive ? 'var(--yellow)' : 'var(--white)'};
                    color: ${isActive ? 'var(--dark-blue)' : 'var(--yellow)'};
                    transform: ${isActive ? 'scale(1.05)' : 'scale(1)'};
                    box-shadow: 0 0 0 .1em var(--yellow);
                    display: grid;
                    grid-template-columns: auto auto;
                    gap: ${isActive ? '.5em' : '0'};
                    align-items: center;
                    transition: background .3s, color .3s, transform .3s, gap .3s, padding .3s;
                }

                span {
                    font-size: ${isActive ? '.9em' : '0'};
                    padding-right: ${directionOpen === 'right' ? '.5em' : '0'};
                    padding-left: ${directionOpen === 'left' ? '.5em' : '0'};
                    font-weight: 600;
                    white-space: nowrap;
                    grid-column: ${directionOpen === 'left' ? '1/2' : '2/3'};
                    grid-row: 1/2;
                    transition: font-size .3s, padding-right .3s;
                }

                .icon {
                    color: var(--black);
                    display: grid;
                    place-items: center;
                    grid-column: ${directionOpen === 'left' ? '2/3' : '1/2'};
                    grid-row: 1/2;
                    margin: .1em;
                }

                button:hover {
                    background: var(--yellow);
                    color: var(--dark-blue);
                    transform: scale(1.05);
                    gap: .5em;
                    padding: .2em .5em;

                    span {
                        font-size: .9em;
                    }
                }
            `}</style>
        </button>
    )
}

export default BtnOptionIcon
