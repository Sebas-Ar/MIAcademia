const Description = ({ isChatEnabled, programMode }) => {
    return (
        <p className="description">
			Tu <span className="dark">asistente experta</span> para explorar los
            <br />
            <span className="bold">programas académicos</span> de educación superior
            <br />
			en <span className="bold">Colombia</span>

            <style jsx>{`

                .description {
					overflow: hidden;
					margin-bottom: 0;
					text-align: center;
					font-weight: 500;
					padding: 0 1em;
					z-index: 1;
				}

				.description .dark {
					color: var(--yellow);
					background: var(--black);
					border-radius: .5em;
					padding: 0 .2em;
				}

				.description .bold {
					font-weight: 700;
				}
            `}</style>

            <style jsx>{`
                .description {
					margin-top: ${isChatEnabled || programMode ? '0' : '1.5em'};
					opacity: ${isChatEnabled || programMode ? '0' : '1'};
					height: ${isChatEnabled || programMode ? '0' : '4.5em'};
					transition: opacity ${isChatEnabled || programMode ? '.3s' : '1s'}, height 1s, margin 1s;
				}
			`}</style>
        </p>
    )
}

export default Description
