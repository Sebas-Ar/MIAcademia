import { CircleAlert } from 'lucide-react'

const PropertiesNav = () => {
    return (
        <div className="container">
            <button>
                <CircleAlert size="1.5em" />
            </button>
            <style jsx>{`
                .container {
                    position: fixed;
                    left: 5em; 
                    top: 1em;
                }

                button {
                    background-color: var(--dark-blue);
                    color: var(--white);
                    padding: .5em .7em;
                    border-radius: .5em;
                    font-size: .85em;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    transition: transform .3s;
                    text-transform: capitalize;
                }

                button:hover {
                    transform: scale(1.05);
                }

                svg {
                    height: 1.5em;
                }


            `}</style>
        </div>
    )
}

export default PropertiesNav
