const LoadingPage = ({ isLoading }) => {
    return (
        <div className="container">
            <style jsx>{`
                .container {
                    display: ${isLoading ? 'block' : 'none'};
                    position: fixed;
                    top: 0;
                    height: .3em;
                    background: var(--red);
                    animation: loading 1s infinite alternate;
                    border-radius: 5em;
                }

                @keyframes loading {
                    0% {
                        width: 0;
                    }

                    100% {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    )
}

export default LoadingPage
