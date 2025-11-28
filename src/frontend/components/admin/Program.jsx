const Program = ({ program }) => {
    return <li>
        <div className="program" id={program[0]}>
            <img src={program[9]} alt="logo de {instituteName}" />
            <div className="program-info">
                <h3>{program[8]}</h3>
                <h2>{program[2]}</h2>
                <ul>
                    <li><strong>Tipo de programa:</strong> {program[1]}</li>
                    <li><strong>Modalidad:</strong> {program[3]}</li>
                    <li><strong>Duración:</strong> {program[4]}</li>
                    <li><strong>Ubicación:</strong> {program[5]}</li>
                    <li><strong>Precio:</strong> {program[6]}</li>
                </ul>
                <div className="ver">
                    Ver Más
                </div>
            </div>
        </div>
    </li>
}

export default Program
