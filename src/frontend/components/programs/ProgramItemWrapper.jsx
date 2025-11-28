
const ProgramItemWrapper = ({
    icon = <></>,
    titleLine1 = '',
    titleLine2 = '',
    titleLine3 = '',
    description = '',
    children = <></>,
    isFullWidth = false
}) => {
    // Construir el título completo para aria-label
    const fullTitle = [titleLine1, titleLine2, titleLine3].filter(Boolean).join(' ')

    return (
        <section
            className="grid place-items-center px-[2em] w-full my-[3em]"
            aria-labelledby="section-title"
        >
            <div
                className={`h-full ${
                    isFullWidth ? 'w-full' : 'w-auto'
                } max-w-[65em] relative pt-[3em] px-[2em] pb-[2em] bg-(--light-blue) rounded-[2em]`}
            >
                {/* Ícono circular */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center mx-auto mb-4">
                    <div
                        className="bg-(--blue) text-white rounded-full w-[4.5em] h-[4.5em] grid place-items-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                        aria-hidden="true"
                    >
                        {icon}
                    </div>
                </div>

                {/* Título */}
                <h3
                    id="section-title"
                    className="text-center text-[2em] font-medium mb-[0.5em]"
                    aria-label={fullTitle}
                >
                    {titleLine1}
                    {titleLine2 && (
                        <>
                            <br />
                            {titleLine2}
                        </>
                    )}
                    {titleLine3 && (
                        <>
                            <br />
                            {titleLine3}
                        </>
                    )}
                </h3>

                {/* Descripción */}
                {description && (
                    <p className="text-center mb-[1.5em] text-gray-700">
                        {description}
                    </p>
                )}

                {/* Contenido hijo */}
                {children}
            </div>
        </section>
    )
}

export default ProgramItemWrapper
