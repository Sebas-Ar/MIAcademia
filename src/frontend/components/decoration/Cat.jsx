const Cat = () => {
    return (
        <div
            className="cat-wrapper-decoration group absolute right-[20%] bottom-[-.18em] z-111111111"
            role="img"
            aria-label="Decoración de gato animado"
        >
            <svg
                className="cat-decoration absolute right-0 bottom-[.1em] text-(--dark-gray) w-[7.3em] cursor-pointer"
                viewBox="0 -20 460 180"
                fill="currentColor"
                aria-hidden="true"
            >
                <g>
                    <g>
                        <ellipse cx="200" cy="220" rx="195" ry="180" />
                        <g transform="translate(110 130)">
                            <path
                                className="ear-left-decoration transition-transform duration-1000"
                                transform="rotate(-32)"
                                d="m -85,0 c 0,-5 55,-150 85,-150 c 30,0 85,145 85,150"
                            />
                        </g>
                        <g transform="translate(290 130)">
                            <path
                                className="ear-right-decoration transition-transform duration-1000"
                                transform="rotate( 32)"
                                d="m -85,0 c 0,-5 55,-150 85,-150 c 30,0 85,145 85,150"
                            />
                        </g>
                    </g>
                </g>
            </svg>
            <div
                className="eyes-decoration inline-flex gap-[.6em] absolute bottom-[0.3em] right-[2.9em] z-100 cursor-pointer"
                aria-hidden="true"
            />

        </div>
    )
}

export default Cat
