import { Chrome } from 'lucide-react'

const NavigatorsSuggestion = ({
    isSuggestNavigators = false
}) => {
    return <div className="navigators-suggestion">
        <h6>¿Quieres ver cómo la IA escribe en tiempo real?</h6>
        <p>Te recomiendo usar un navegador basado en Chrome.</p>
        <div className="icon">
            <Chrome size="1.5em" />
        </div>

        <style jsx>{`

                .navigators-suggestion {
                    position: absolute;
                    top: calc(100% + .5em);
                    min-width: 20em;
                    background: var(--dark-blue);
                    padding: 1em;
                    border-radius: .5em;
                    color: var(--yellow);
                    display: grid;
                    gap: .5em;
                    justify-items: center;
                    font-size: ${isSuggestNavigators ? '1em' : '0'};
                    transition: font-size .3s;
                    text-align: center;
                }

                .navigators-suggestion::before {
                    content: "";
                    position: absolute;
                    width: 0px;
                    height: 0px;
                    border-style: solid;
                    border-width: .7em .7em .7em 0;
                    transform: translate(-.5em, -50%) rotate(90deg);
                    border-color: transparent var(--dark-blue) transparent transparent;
                    left: 1.2em;
                    top: -.3em;
                }

                h6 {
                    font-weight: 600;
                }

                p {
                    font-weight: 300;
                }

                .icon {
                    background: var(--yellow);
                    display: grid;
                    place-items: center;
                    padding: .3em;
                    border-radius: 50%;
                    color: var(--dark-blue);
                }
            `}</style>

    </div>
}

export default NavigatorsSuggestion
