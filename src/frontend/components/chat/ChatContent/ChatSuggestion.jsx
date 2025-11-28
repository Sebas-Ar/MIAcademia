
const ChatSuggestion = ({
    suggestiosnList = [],
    activeSuggestion = () => Promise.resolve()
}) => {
    return <section>
        <p>Acá te dejo sugerencias de preguntas que podrías realizar:</p>
        <ul>
            {
                suggestiosnList?.map((suggestion) => {
                    return <li key={suggestion._id}>
                        <button type="submit" form="action-bar" onClick={async () => await activeSuggestion({ suggestion, from: 'chat' })}>
                            {suggestion.text}
                            <svg viewBox="0 0 512 512" fill="currentColor">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                            </svg>
                        </button>

                    </li>
                })
            }
        </ul>
        <style jsx>{`

            section {
                
            }

            ul {
                display: grid;
                gap: .8em;
            }

            li {
                position: relative;
            }

            button {
                font-size: 1em;
                display: flex;
                align-items: center;
                gap: .5em;
                background: var(--yellow);
                padding: .5em 1em;
                border-radius: 1em;
                color: var(--dark-blue);
                font-weight: 500;
                transition: transform .3s;
                text-align: left;
            }

            button svg {
                height: 1em;
            }

            button:hover {
                transform: scale(1.02);
            }
        `}</style>
    </section>
}

export default ChatSuggestion
