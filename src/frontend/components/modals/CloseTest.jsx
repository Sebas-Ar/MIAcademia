import { AlertCircle, X } from 'lucide-react'
import LoginGoogle from '../login/LoginGoogle'

const CloseTest = ({
    isConfirmModalEnable = false,
    setIsConfirmModalEnable = () => { },
    enableCloseBtn = false,
    title = '',
    secondaryBtnAction = () => { },
    secondaryBtnText = 'Salir',
    enableLoggingBtn = false,
    text = '',
    enablePrimaryBtn = false,
    primaryBtnText = ''

}) => {
    return (
        <section className="confirm-page">
            <div className="background" onClick={() => setIsConfirmModalEnable(false)}></div>
            <div className="wrapper">
                {
                    enableCloseBtn && <button className="btn-cancel" onClick={() => setIsConfirmModalEnable(false)}>
                        <X strokeWidth=".2em" size="1.6em" />
                    </button>
                }
                <h4>
                    <AlertCircle />
                    {title}
                </h4>
                <p>
                    {text}
                </p>
                <div className="options">

                    {enableLoggingBtn &&
                    <LoginGoogle
                        locationBtn='modal-close-vocacional-test'
                    />}

                    {enablePrimaryBtn &&
                    <button onClick={() => setIsConfirmModalEnable(false)}>
                        {primaryBtnText}
                    </button>
                    }
                    <button className="btn-exit" onClick={secondaryBtnAction}>
                        {secondaryBtnText}
                    </button>
                </div>
            </div>

            <style jsx>{`
                
                .confirm-page {
                    position: fixed;
                    top: 0;
                    left: ${isConfirmModalEnable ? '0' : '-100%'};
                    width: 100%;
                    height: 100%;
                    display: grid;
                    place-items: center;
                    opacity: ${isConfirmModalEnable ? '1' : '0'};
                    z-index: 1111111111111111111111111111111111111111111111111111;
                    transition: left ${isConfirmModalEnable ? '0s' : '0s .3s'},
                                opacity .3s;
                }

                .background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: var(--transparent-dark-gray);
                }

                .wrapper {
                    display: grid;
                    gap: 1.5em;
                    max-width: 40em;
                    border-radius: 1em;
                    padding: 3em 4em;
                    background-color: var(--dark-blue);
                    color: var(--white);
                    border: .2em solid var(--yellow);
                    position: relative;
                    text-align: center;
                    margin: 2em;
                }

                .btn-cancel {
                    position: absolute;
                    right: 1em;
                    top: 1em;
                    padding: 0;
                    color: var(--white);
                    border-radius: .5em;
                    font-weight: 600;
                    transition: transform .3s;
                }

                .btn-cancel:hover {
                    transform: scale(1.1);
                }

                h4 {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: .5em;
                    font-size: 1.4em;
                    font-weight: 600;
                    color: var(--yellow);
                }

                p {
                    font-size: 1em;
                    display: flex;
                    align-items: center;
                }

                .options {
                    display: grid;
                    justify-content: center;
                    gap: 1em;
                }

                .options button {
                    background-color: var(--yellow);
                    color: var(--dark-blue);
                    border-radius: .5em;
                    padding: .7em 2em;
                    font-weight: 600;
                    transition: transform .3s;
                }

                .options button:hover {
                    transform: scale(1.05);
                }

                .options .btn-exit {
                    background-color: var(--dark-blue);
                    font-weight: 300;
                    letter-spacing: .05em;
                    padding: 0;
                    color: var(--yellow);
                    justify-self: center;
                    text-decoration: underline;
                    font-size: .9em;
                }

            `}</style>
        </section>
    )
}

export default CloseTest
