const Subtitle = ({ isChatEnabled, programMode }) => {
    return (
        <h2 className="subtitle">
            <span>Motor de</span> Inteligencia Académica

            <style jsx>{`
				.subtitle {
					opacity: ${isChatEnabled || programMode ? '0' : '1'};
					height: ${isChatEnabled || programMode ? '0' : '1.3em'};
					transition: opacity ${isChatEnabled || programMode ? '.3s' : '1s'}, height 1s;
				}
			`}</style>

            <style jsx>{`
                				
				
				.subtitle {
					justify-self: center;
					text-align: center;
					font-size: .7em;
					overflow: hidden;
					white-space: nowrap;
					font-weight: 600;
					animation: animated-text 4s steps(29,end) 1s 1 normal both,
							blink-caret 600ms steps(29,end) infinite;
				}

				.subtitle span {
					color: var(--white);
				}

                @keyframes animated-text{
					from{
						width: 0;
						border-right: solid 3px var(--dark-blue);
					}

					98% {
						border-right: 3px solid var(--dark-blue);
					}

					to {
						width: 18em;
						border-right: 3px solid transparents;
					}
				}

                @keyframes blink-caret {
					from { border-color: transparent }
					50% { border-color: var(--dark-blue) }
					to { border-color: transparent }
				}
            `}</style>
        </h2>
    )
}

export default Subtitle
