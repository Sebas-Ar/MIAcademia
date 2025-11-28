const FormAccessWrapper = ({ children, handleSubmit, sendRequest }) => {
    return <form onSubmit={handleSubmit ? handleSubmit(sendRequest) : sendRequest}>

        { children }

        <style jsx>{`
            form {
                display: grid;
                gap: 1em;
                padding: 1.5em;
                border-radius: .5em;
                background-color: var(--white);
                align-self: flex-start;
                display: grid;
                gap: 1.2em;
                margin-inline: auto;
                margin-bottom: 2em;
                max-width: 25em;
                border: 2px solid var(--dark-blue);
            }
        `}</style>
    </form>
}

export default FormAccessWrapper
