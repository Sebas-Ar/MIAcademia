const VocationalOption = ({ optionText = '', answerQuestion = () => { }, numberQuestion = 0, response = '', isFinishText = false }) => {
    return (
        <button onClick={() => answerQuestion(numberQuestion, optionText)} disabled={!isFinishText}>
            {optionText}

            <style jsx>{`
                button {
                    border-radius: .5em;
                    text-align: center;
                    padding: ${isFinishText ? '.4em' : '0'} 1em;
                    width: 100%;
                    max-width: 10em;
                    transition: border .3s, color .3s;
                    min-width: 5em;
                    color: ${response === optionText ? 'var(--yellow)' : 'var(--white)'};
                    border: .15em solid  ${response === optionText ? 'var(--yellow)' : 'var(--light-gray)'};
                    background-color: ${response === optionText ? 'unset' : 'var(--transparent-dark-blue)'};
                    transition: border .3s, color .3s, opacity .3s, background .3s, font-size .3s, padding .3s;
                    font-size: ${isFinishText ? '1em' : '0'};
                    user-select: none;
                }

                button:hover {
                    opacity: 1;
                    border-color: var(--yellow);
                    color: var(--yellow);
                    background-color: var(--transparent-yellow);
                }

                button:disabled {
                    cursor: auto;
                }
            `}</style>
        </button>
    )
}

export default VocationalOption
