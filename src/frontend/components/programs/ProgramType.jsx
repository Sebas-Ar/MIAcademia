const ProgramType = ({ program }) => {
    return (
        <div className="grid place-items-center">
            <div className="grid">
                {/* Academic Level Badge */}
                <div className="relative grid gap-2 items-center justify-items-center m-auto justify-self-center py-[0.3em] px-[1.5em] pb-0 font-bold text-center tracking-wide capitalize bg-(--yellow) rounded-t-lg">
                    {/* Left decoration */}
                    <div className="absolute h-full aspect-square bg-(--yellow) right-full before:content-[''] before:absolute before:w-full before:h-full before:bottom-0 before:right-0 before:bg-(--light-blue) before:rounded-br-[1em]" aria-hidden="true"></div>

                    <span className="text-sm sm:text-base">
                        {program?.academicLevel}
                    </span>

                    {/* Right decoration */}
                    <div className="absolute h-full aspect-square bg-(--yellow) left-full before:content-[''] before:absolute before:w-full before:h-full before:bottom-0 before:left-0 before:bg-(--light-blue) before:rounded-bl-[1em]" aria-hidden="true"></div>
                </div>

                {/* Program Name - Using h1 for SEO */}
                <h1 className="text-[1.7em] font-semibold capitalize max-w-[30em] min-w-[12em] text-center border-t-[0.15em] border-b-[0.15em] border-(--yellow) py-[0.5em] px-[2em] rounded-sm">
                    {program?.programName}
                </h1>

                {/* Program Type Badge */}
                <div className="relative grid gap-2 items-center justify-items-center m-auto justify-self-center py-[0.3em] px-[1.5em] pt-0 font-bold text-center tracking-wide capitalize border-[0.3em] border-(--yellow) border-t-[0.3em] border-t-(--light-blue) rounded-b-lg bottom-[0.25em]">
                    {/* Left decoration with top corner */}
                    <div className="absolute h-full aspect-square bg-(--yellow) right-full -top-[0.28em] rounded-[0.3em] before:content-[''] before:absolute before:w-full before:h-full before:rounded-none before:rounded-tr-[0.3em] before:right-[0.3em] before:top-[0.25em] before:bg-(--light-blue)" aria-hidden="true"></div>

                    <span className="text-sm sm:text-base">
                        {program?.programType}
                    </span>

                    {/* Right decoration with top corner */}
                    <div className="absolute h-full aspect-square bg-(--yellow) left-full -top-[0.28em] rounded-[0.3em] before:content-[''] before:absolute before:w-full before:h-full before:rounded-none before:rounded-tl-[0.3em] before:left-[0.3em] before:top-[0.25em] before:bg-(--light-blue)" aria-hidden="true"></div>
                </div>
            </div>
        </div>
    )
}

export default ProgramType
