
const Line = ({ isChatEnabled, fixLine }) => {
    return (
        <div className="line">

            <style jsx>{`
                .line {
                    height: ${isChatEnabled || fixLine ? '2px' : '3px'};
                    width: ${isChatEnabled || fixLine ? 'calc(100% - 3em)' : '8em'};
                    margin-top: ${isChatEnabled || fixLine ? '.5em' : '1em'};
                }

            `}</style>

            <style jsx>{`

                .line {
                    background: var(--white);
                    margin-inline: auto;
                    margin-bottom: 1em;
                    border-radius: 1em;
                    transition: width 1s, margin 1s, height 1s;
                    view-transition-name: main-line${fixLine ? '-fix' : ''};
                }
                
            `}</style>
        </div>
    )
}

export default Line
