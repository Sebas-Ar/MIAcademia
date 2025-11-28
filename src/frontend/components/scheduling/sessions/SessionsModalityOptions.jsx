const SessionsModalityOptions = ({
    icon = <></>,
    title = 'virtual',
    description = 'Google Meet',
    isDiabled = false,
    isSelected = false,
    onClick = () => {}
}) => {
    return <li className="option-item">
        <button
            type="button"
            className={`btn-option ${isSelected ? 'selected' : ''}`}
            disabled={isDiabled}
            onClick={onClick}
        >
            <span className="wrapper-icon">
                {icon}
            </span>
            <span className="option-text">
                <strong className="option-title">{title}</strong>
                <p className="option-description">{description}</p>
            </span>
        </button>

        <style jsx>{`
            .option-item {
                list-style: none;
            }

            .btn-option {
                display: flex;
                align-items: center;
                gap: 1em;
                border: .2em solid var(--blue);
                border-radius: .5em;
                padding: 1em;
                cursor: pointer;
                width: 100%;
                text-align: left;
                transition: background .2s ease, border-color .2s ease;

                &:not(:disabled):hover {
                    border-color: var(--dark-yellow);
                    background: var(--transparent-yellow);
                }
            }

            .btn-option:disabled {
                border-color: var(--gray);
                cursor: auto;
            }

            .btn-option.selected {
                border-color: var(--dark-yellow);
                background: var(--transparent-yellow);
            }

            .wrapper-icon {
                display: grid;
                place-items: center;
            }

            .option-text {
                display: grid;
                gap: .25em;
            }

            .option-title {
                font-weight: 600;
            }

            .option-description {
                font-size: .875em;
                color: var(--color-fg-muted);
            }
        `}</style>
    </li>
}

export default SessionsModalityOptions
