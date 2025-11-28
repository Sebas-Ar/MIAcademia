'use client'

const InformationIcon = ({
    icon = <></>,
    text = '',
    minWidth = '15em',
    positionText = 'bottom',
    ariaLabel = 'Más información'
}) => {
    const isTop = positionText === 'top'

    return (
        <div className="absolute left-[calc(100%+0.5em)] top-1/2 -translate-y-1/2 grid text-gray-400 cursor-pointer group outline-none">
            <button
                className="transition-colors hover:text-gray-600 group-focus-within:text-gray-600 focus:outline-none rounded outline-none"
                aria-label={ariaLabel}
                type="button"
            >
                {icon}
            </button>

            <div
                className={`absolute right-[-1em] text-[0em] opacity-0 bg-(--blue) py-[0.8em] px-[0.8em] rounded-[1.4em] text-center transition-all duration-300 border-[0.3em] border-(--dark-blue) font-semibold text-white group-hover:text-[0.8em] group-focus-within:text-[0.8em] group-hover:opacity-100 group-focus-within:opacity-100 ${
                    isTop ? 'top-[calc(100%+1em)]' : 'bottom-[calc(100%+1em)]'
                } before:content-[''] before:absolute before:w-0 before:h-0 before:border-solid before:border-r-[0.7em] before:border-r-(--blue) before:border-t-[0.7em] before:border-t-transparent before:border-b-[0.7em] before:border-b-transparent before:right-[1em] before:-translate-x-[0.35em] before:drop-shadow-[-.25em_0_0_var(--dark-blue)] ${
                    isTop
                        ? 'before:top-0 before:-translate-y-[60%] before:rotate-90'
                        : 'before:top-[calc(100%+0.4em)] before:-translate-y-[60%] before:-rotate-90'
                }`}
                style={{ minWidth }}
                role="tooltip"
                aria-hidden="true"
            >
                <p>
                    {text}
                </p>
            </div>
        </div>
    )
}

export default InformationIcon
