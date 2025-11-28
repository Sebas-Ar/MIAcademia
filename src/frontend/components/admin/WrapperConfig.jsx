
const WrapperConfig = ({ children, title, setNavigation, navigation, paths = [''] }) => {
    const navigate = (path) => {
        setNavigation(currentPath => currentPath === path ? '' : path)
    }

    return (
        <div className="config">
            <header>
                <h2>{title}</h2>
                <button className="btn-close" type="button" onClick={() => setNavigation('')}>
                    <div className="line"></div>
                </button>
                <nav>
                    {
                        paths.map(path => {
                            return (
                                <button
                                    key={path}
                                    type="button"
                                    className="btn-toggle-config"
                                    onClick={() => navigate(path)}
                                >
                                    {path}
                                </button>
                            )
                        })
                    }
                </nav>
            </header>

            {navigation &&
            <section className="wrapper-content">
                {children}
            </section>}

            <style jsx>{`
                .config {
                    border: 1px solid var(--dark-blue);
                    border-radius: 1em;
                    padding: ${navigation ? '.5em' : '.5em'} .4em .4em;
                    margin: 1.5em 1em;
                    background: var(--dark-blue);
                    position: relative;
                }

                header {
                    position: sticky;
                    top: -1.5em;
                    background: var(--dark-blue);
                    z-index: 10;
                    display: flex;
                    justify-content: space-between;
                    padding: .5em .5em;
                }

                h2 {
                    color: var(--white);
                    font-size: 1.25em;
                    font-weight: 500;
                    text-transform: capitalize;
                    padding: 0;
                    align-self: center;
                }

                .btn-close {
                    position: absolute;
                    top: 0em;
                    left: 50%;
                    transform: translateX(-50%);
                    height: .6em;
                    width: 25%;
                    display: ${navigation ? 'block' : 'none'};
                    background: var(--dark-blue);
                    transition: transform .3s;
                }

                .btn-close:hover {
                    transform: translateX(-50%) scale(1.1)
                }

                .line {
                    height: 2px;
                    width: 100%;
                    background-color: var(--white);
                    border-radius: .5em;
                }

                nav {
                    display: flex;
                    gap: .5em;
                }

                .btn-toggle-config {
                    font-size: 1em;
                    text-transform: capitalize;
                    background: var(--yellow);
                    padding: .5em 1em;
                    border-radius: .5em;
                    color: var(--dark-blue);
                    transition: transform .3s;
                }

                .btn-toggle-config:hover {
                    transform: scale(1.05);
                }

                .wrapper-content {
                    position: relative;
                    background: var(--white);
                    padding: 1em;
                    border-radius: .7em;
                    color: var(--dark-blue);
                    margin-top: .5em;
                }
            `}</style>
        </div>
    )
}

export default WrapperConfig
