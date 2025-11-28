import Markdown from 'react-markdown'

const ProgramDescription = ({ program }) => {
    return (
        <section
            className="mx-6 mb-4 text-[1em] max-w-[50em] text-justify [text-align-last:center]"
            aria-labelledby="program-description-title"
        >
            {/* Título oculto visualmente pero disponible para lectores de pantalla */}
            <h2 id="program-description-title" className="sr-only">
                Descripción del programa
            </h2>

            <div>
                <Markdown>
                    {program?.programDescription}
                </Markdown>
            </div>

            <footer className="mt-2">
                <em
                    className="font-light text-[0.8em] text-(--dark-gray) italic block"
                    aria-label="Esta descripción fue generada por inteligencia artificial"
                >
                    — Descripción generada por IA
                </em>
            </footer>
        </section>
    )
}

export default ProgramDescription
