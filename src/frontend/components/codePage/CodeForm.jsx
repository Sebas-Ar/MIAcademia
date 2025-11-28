import OTPInput from 'react-otp-input'

const CodeForm = ({
    errorResponse,
    setOtp,
    otp
}) => {
    return (
        <>
            <h1>Acceso Beta</h1>
            <p>Ingresa tu código de acceso para continuar</p>
            <label>
                <OTPInput
                    placeholder='------'
                    value={otp}
                    onChange={setOtp}
                    renderSeparator={<span className="point"></span>}
                    numInputs={6}
                    inputStyle={{ width: '1.3em' }}
                    renderInput={(props) => <input {...props} />}
                />
                <span className="error">{errorResponse}</span>
            </label>

            <button>Ingresar</button>

            <style jsx>{`
                h1 {
                    text-align: center;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                p {
                    text-align: center;
                }

                label {
                    margin: .5em auto;
                    position: relative;
                }

                input {
                    border: 2px solid var(--dark-blue);
                    border-radius: .5em;
                    margin: 0 .3em;
                    font-size: 1.2em;
                }

                .point {
                    background: var(--dark-blue);
                    background: var(--dark-blue);
                    height: .35em;
                    width: .35em;
                    border-radius: 50%;

                }

                .error {
                    position: absolute;
                    font-size: .7em;
                    color: var(--red);
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    text-align: center;
                    width: 100%;
                    font-weight: 400;
                }

                button {
                    background: var(--dark-blue);
                    color: var(--white);
                    border: none;
                    padding: .5em 1em;
                    border-radius: .5em;
                    cursor: pointer;
                    transition: transform .3s;
                    margin: auto;
                }

                button:hover {
                    transform: scale(1.05);
                }
                
            `}</style>
        </>
    )
}

export default CodeForm
