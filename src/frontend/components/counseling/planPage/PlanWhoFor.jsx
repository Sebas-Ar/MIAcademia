const PlanWhoFor = ({
    entities = [
        'Estudiantes que buscan orientación vocacional',
        'Personas en transición laboral',
        'Profesionales que desean redirigir su carrera',
        'Cualquier persona interesada en descubrir su propósito profesional'
    ]
}) => {
    return <ul>
        {entities.map((entity, index) => (
            <li key={index}>{entity}</li>
        ))}

        <style jsx>{`
            ul {
                list-style-type: disc;
                padding-left: 2em;
                margin: 0;
            }

            li {
                margin-bottom: 0.5em;
                font-size: 1.2em;
                color: var(--dark-gray);
                position: relative;
            }

            li::before {
                content: '';
                position: absolute;
                left: -1.15em;
                top: .35lh;
                width: 0.5em;
                height: 0.5em;
                background-color: var(--blue);
                border-radius: 50%;
            }
        `}</style>
    </ul>
}
export default PlanWhoFor
