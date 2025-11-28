const ProgramTags = ({ program }) => {
    const tagList = [
        {
            propertyName: 'tipo de institución',
            propertyValue: program?.academicType,
            ariaLabel: `Tipo de institución: ${program?.academicType}`
        },
        {
            propertyName: 'sector',
            propertyValue: program?.sector,
            ariaLabel: `Sector: ${program?.sector}`
        }
    ]

    return (
        <ul
            className="grid gap-2 -mt-6 capitalize"
            role="list"
            aria-label="Características del programa"
        >
            {tagList.map((tag, index) => (
                <li
                    key={index}
                    className="grid justify-center text-center"
                    aria-label={tag.ariaLabel}
                >
                    <span
                        className="text-[1em] sm:text-[.7em] font-bold mb-[0.1em] text-gray-700"
                        aria-hidden="true"
                    >
                        {tag.propertyName}
                    </span>
                    <span className="text-[1.1em] sm:text-[.8em] font-medium py-[0.4em] px-[1.4em] border-[0.2em] border-(--yellow) bg-(--transparent-yellow) rounded-full inline-block">
                        {tag.propertyValue}
                    </span>
                </li>
            ))}
        </ul>
    )
}

export default ProgramTags
