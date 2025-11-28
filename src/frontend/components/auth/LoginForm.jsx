
const LoginForm = ({
    title = '',
    errorResponse,
    errors,
    register
}) => {
    return <>
        <h1>Iniciar Sesión</h1>
        <label>
            <span className="label">Nombre de Usuario</span>
            <input
                className="username"
                type="text"
                placeholder="mia_u"
                {...register('username', {
                    required: {
                        value: true,
                        message: 'El nombre de usuario es requerido'
                    }
                })}
            />
            {errors?.username &&
                    <span className='error'>*{errors?.username?.message}</span>
            }
        </label>
        <label>
            <span className="label">Contraseña</span>
            <input
                className="password"
                type="password"
                placeholder="●●●●●●●●●"
                {...register('password', {
                    required: {
                        value: true,
                        message: 'La contraseña es requerida'
                    }
                })}
            />
            {(errors?.password || errorResponse) &&
                    <span className='error'>*{errors?.password?.message || errorResponse}</span>
            }
        </label>

        <button type="submit">Ingresar</button>

        <style jsx>{`

            h1 {
                text-align: center;
                font-size: 1.4em;
                font-weight: 600;
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

            label {
                position: relative;
                display: grid;
            }

            span {
                display: block;
            }

            input {
                padding: .6em;
                border-bottom: 2px solid var(--dark-blue);
            }

            input::-webkit-input-placeholder {
                color: var(--gray);
            }

            input:focus-within {
                animation: scale-input 1s linear alternate;
            }

            input:focus::-webkit-input-placeholder {
                color: transparent;
            }

            .password::-webkit-input-placeholder {
                font-size: .7em;
                position: relative;
                bottom: .1em;
            }


            button {
                padding: .5em;
                border-radius: .5em;
                border: none;
                font-weight: 600;
                letter-spacing: .04em;
                background: var(--yellow);
                color: var(--dark-blue);
                cursor: pointer;
                transition: transform .3s;
                margin-top: .5em;
            }

            button:hover {
                transform: scale(1.03);
            }

            @keyframes scale-input {
                0% {
                    transform: scale(1)
                }

                25% {
                    transform: scale(0.98)
                }

                50% {
                    transform: scale(1.02)
                }

                75% {
                    transform: scale(0.98)
                }

                100% {
                    transform: scale(1)
                }
            }

        `}</style>

    </>
}

export default LoginForm
