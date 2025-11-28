
const SubmenuWrapper = ({
    subtitle = '',
    number = 0,
    border = false,
    children = <></>
}) => {
    return (
        <nav className="menu-services-list">
            <h3>{subtitle} {number !== 0 && <span className="number">{number}</span>}</h3>
            <ul>
                {children}
            </ul>
            <style jsx>{`
                .menu-services-list {
                    display: grid;
                    gap: .5em;
                    margin-bottom: 1em;
                }    

                h3 {
                    position: relative;
                    font-size: 1.1em;
                    display: flex;
                    align-items: center;
                    gap: .5em;
                    justify-content: center;
                    margin-left: 1em;
                    margin-top: 1.5em;
                    margin-bottom: .4em;
                    font-weight: 600;
                }

                h3::before {
                    content: '';
                    position: absolute;
                    top: -1em;
                    left: 50%;
                    transform: translateX(-50%);
                    height: .2em;
                    width: 70%;
                    background: var(--dark-gray);
                    border-radius: 2em;
                }

                h3 .number {
                    background: var(--yellow);
                    color: var(--dark-blue);
                    padding: .1em .5em;
                    border-radius: .4em;
                    font-size: .65em;
                    font-weight: 700;
                }

                ul {
                    border: ${border ? '.2em solid var(--transparent-gray)' : 'none'};
                    border-radius: .5em;
                    display: grid;
                    gap: ${border ? '1em' : '.2em'};
                    padding: ${border ? '1em' : '0'};
                }
            `}</style>
        </nav>
    )
}

export default SubmenuWrapper
