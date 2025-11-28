'use client'

import { useState } from 'react'

const Banner = ({ children }) => {
    const [showMainAdds, setShowMainAdds] = useState(false)

    const closeAdds = () => setShowMainAdds(false)

    return showMainAdds && (
        <aside>
            <button onClick={closeAdds}>
                <svg viewBox="0 0 384 512" fill="currentColor">
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                </svg>
            </button>
            {children}
            <style jsx>{`

                aside {
                    z-index: 20;
                    position: fixed;
                    bottom: 2.05rem;
                    width: 100%;
                    background: red;
                    display: grid;
                    place-items: center;
                    max-width: 40em;
                    left: 50%;
                    transform: translateX(calc(-50% - 4px));
                }

                button {
                    position: absolute;
                    top: 0;
                    right: 1em;
                    transform: translateY(-40%);
                    background: white;
                    border: .2em solid gray;
                    border-radius: 50%;
                    height: 1.2em;
                    width: 1.2em;
                    display: grid;
                    place-items: center;
                    transition: transform .3s;
                    z-index: 1;
                }

                button:hover {
                    transform: scale(1.15) translateY(-40%);
                }

                button > svg {
                    color: gray;
                    height: .7em;
                }
                
            `}</style>
        </aside>
    )
}

export default Banner
