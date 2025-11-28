
const Skeleton = () => {
    return (
        <div className="skeleton-container">
            <div className="skeleton-item"></div>
            <div className="skeleton-item"></div>
            <div className="skeleton-item"></div>
            <div className="skeleton-item"></div>
            <div className="skeleton-item"></div>

            <style jsx>{`

                .skeleton-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1em;
                }

                .skeleton-item {
                    background-color: var(--transparent-gray);
                    height: 4em;
                    border-radius: .5em;
                    opacity: 0;
                    animation: wave 1.6s linear infinite;
                }

                .skeleton-item:nth-child(1) {
                    animation-delay: 0s;
                }

                .skeleton-item:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .skeleton-item:nth-child(3) {
                    animation-delay: 0.4s;
                }

                .skeleton-item:nth-child(4) {
                    animation-delay: 0.6s;
                }

                .skeleton-item:nth-child(5) {
                    animation-delay: 0.8s;
                }

                @keyframes wave {
                    0%, 100% {
                        opacity: .1;
                    }
                    50% {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    )
}

export default Skeleton
