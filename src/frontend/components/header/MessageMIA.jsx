
const MessageMIA = ({
    toogleChatMode = () => {},
    hideName = false,
    isChatEnabled = false,
    programMode = false,
    mColor = 'var(--white)'
}) => {
    return <div className="help-text">
        <span className="line-one">
					Pulsa aquí para
        </span>
        <span className="line-two">
            {isChatEnabled ? 'cerrar' : 'abrir'} el modo chat
        </span>
        <div className="colita"></div>

        <style jsx>{`
				.help-text {
					z-index: 1;
					position: absolute;
					right: calc(100% + .3em);
					top: 40%;
					margin-right: 1em;
					padding: .4em 1.3em .4em;
					transform: translateY(-50%);
					background-color: var(--white);
					border-radius: 2em;
					opacity: 0;
					box-shadow: 0 0 0 .1em var(--dark-blue);
				}

				.help-text .line-one, .line-two {
					color: var(--dark-blue);
					font-size: .8em;
					font-weight: 500;
					overflow: hidden;
					display: block;
					white-space: nowrap;
				}

				.line-two {
					height: 0;
				}

				.help-text .colita {
					content: "";
					position: absolute;
					width: 0px;
					height: 0px;
					border-style: solid;
					border-width: .8em 1.2em .8em 0;
					transform: translate(-.5em, -50%) rotate(180deg);
					border-color: transparent var(--white) transparent transparent;
					left: calc(100% + .1em);
					top: 50%;
					filter: drop-shadow(-.15em 0 0 var(--dark-blue));
				}

				@keyframes animated-text {
					from{
						border-right: solid 3px var(--black);
					}

					98% {
						border-right: 3px solid var(--black);
					}

					to {
						visibility: 3px solid transparent;
					}
				}

				@keyframes animated-text2 {
					from{
						width: 0;
					}

					to {
						width: 10.5em;
					}
				}

				@keyframes height {
					0% {
						height: 0;
						padding-bottom: 0;
					}

					100% {
						height: 1.4em;
					}
				}

				@keyframes ocultar {
					0% {
						opacity: 0;
					}

					5% {
						opacity: 1;
					}

					95% {
						opacity: 1;
					}

					100% {
						opacity: 0;
					}
				}
            `}</style>

        <style jsx>{`
            .help-text {
                animation: ocultar 10s linear forwards;
            }

            .help-text .line-one, .line-two {
                animation: animated-text2 1s steps(29,end) 1s 1 normal both;
            }

            .line-two {
                animation: animated-text2 1s steps(29,end) 2s 1 normal both,
                            height .3s 2s linear forwards;
            }
        `}</style>

    </div>
}

export default MessageMIA
