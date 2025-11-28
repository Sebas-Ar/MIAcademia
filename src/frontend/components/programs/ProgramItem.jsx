'use client'
import { Info } from 'lucide-react'

const ProgramItem = ({
    icon = <></>,
    propertyName = 'tipo de programa',
    propertyValue = '',
    inverted = false,
    info = null,
    infoOptions = null,
    ariaLabel = ''
}) => {
    const infoContent = info || infoOptions?.find((option) => option.value === propertyValue)?.info

    return (
        <li
            className="relative bg-(--light-blue) border-[0.3em] border-(--yellow) rounded-[1em] grid items-center cursor-pointer z-11 transition-all duration-300 hover:scale-110 focus-within:scale-110 hover:bg-(--yellow) focus-within:bg-(--yellow) group py-[1.3em] px-[2.5em] outline-none"
            role="listitem"
            tabIndex={0}
            aria-label={ariaLabel || `${propertyName}: ${propertyValue}`}
        >
            {/* Ícono principal */}
            <div
                className={`absolute top-0 grid place-items-center bg-(--blue) text-white rounded-full transition-all duration-1000 group-hover:rotate-360 group-focus-within:rotate-360 -translate-y-1/2 h-[2.8em] w-[2.8em] p-[0.5em] ${
                    inverted ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'
                }`}
                aria-hidden="true"
            >
                {icon}
            </div>

            {/* Contenido principal */}
            <div className="grid items-center justify-items-center">
                <strong className="font-bold uppercase text-[.8em]">
                    {propertyName}
                </strong>
                <p className="uppercase font-medium text-[.8em]">
                    {propertyValue}
                </p>
            </div>

            {/* Botón de información */}
            <button
                className={`absolute bottom-[.3em] text-(--transparent-gray) group-hover:text-white group-focus-within:text-white group-hover:animate-[scaleAnimate-programItem_0.4s_infinite_linear_alternate] group-focus-within:animate-[scaleAnimate-programItem_0.4s_infinite_linear_alternate] transition-colors ${
                    inverted ? 'left-[.3em]' : 'right-[.3em]'
                }`}
                aria-label={`Más información sobre ${propertyName}`}
                type="button"
            >
                <Info size="1.4em" />
            </button>

            {/* Tooltip de información */}
            {infoContent && (
                <div
                    className={`absolute z-[-1] bg-(--light-blue) rounded-[1.4em] cursor-auto opacity-0 p-0 transition-all duration-300 group-hover:opacity-100 group-focus-within:opacity-100 group-hover:pt-[1em] group-focus-within:pt-[1em] group-hover:p-0 group-focus-within:p-0 top-[calc(100%+0.3em)] ${
                        inverted ? 'right-0' : 'left-0'
                    }`}
                    role="tooltip"
                >
                    <div
                        className={`relative w-[20em] rounded-2xl bg-(--blue) text-white border-[0.2em] border-(--dark-blue) transition-all duration-300 group-hover:text-[0.8em] group-focus-within:text-[0.8em] group-hover:opacity-100 group-focus-within:opacity-100 group-hover:p-4 group-focus-within:p-4 text-[0em] opacity-0 ${
                            inverted
                                ? 'before:right-[10.8em]'
                                : 'before:left-[10.8em]'
                        } before:absolute before:w-0 before:h-0 before:border-solid before:border-r-[0.7em] before:border-r-(--blue) before:border-t-[0.7em] before:border-t-transparent before:border-b-[0.7em] before:border-b-transparent before:bottom-full before:translate-y-[0.35em] before:rotate-90 before:drop-shadow-[-.15em_0_0_var(--dark-blue)] group-hover:before:content-[''] group-focus-within:before:content-['']`}
                    >
                        <p className="text-center font-semibold">
                            {infoContent}
                        </p>
                    </div>
                </div>
            )}
        </li>
    )
}

export default ProgramItem
