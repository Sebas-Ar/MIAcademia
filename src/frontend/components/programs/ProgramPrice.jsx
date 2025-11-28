import currency from 'currency.js'

const ProgramPrice = ({
    program
}) => {
    const hasPrice = program?.price && program?.price !== 0
    const formattedPrice = hasPrice
        ? currency(program?.price, { precision: 0, separator: '.' }).format()
        : 'Precio no disponible'

    const duration = program?.duration?.split('X')[1]

    return (
        <div
            className="z-10 relative mx-2 font-extrabold rounded-full -translate-y-1/2 uppercase text-center min-w-[4em] text-[3.5em] leading-none py-[0.5em] px-[1em] bg-(--dark-yellow) before:content-[''] before:absolute before:w-full before:h-full before:rounded-full before:top-[-0.13em] before:left-[-0.13em] before:z-[-1] before:bg-(--yellow)"
            role="region"
            aria-label="Precio del programa"
        >
            <h3
                className={`relative top-[-0.13em] ${
                    !hasPrice ? 'bottom-[0.13em] text-[0.6em] capitalize' : ''
                }`}
                aria-label={
                    hasPrice
                        ? `Precio: ${formattedPrice}${duration ? `, valor ${duration}` : ''}`
                        : 'Precio no disponible'
                }
            >
                <span className={!hasPrice ? 'relative bottom-[0.13em] text-[0.6em] capitalize' : ''}>
                    {formattedPrice}
                </span>
                {Boolean(hasPrice && duration) && <span
                    className="absolute top-full right-[1em] font-semibold whitespace-nowrap text-[0.3em]"
                    aria-hidden="true"
                >
                        valor {duration}
                </span>
                }
            </h3>
        </div>
    )
}

export default ProgramPrice
