const dbDescription = `
<DBName>miacademy-db</DBName>

<Table>
    <tableName>institutes</tableName>
    <columns>
        <column>
            <columnName>instituteID</columnName>
            <columnDescription>es el id unico que identifica a institucion educativa</columnDescription>
        </column>
        <column>
            <columnName>instituteName</columnName>
            <columnDescription>es el nombre de la institucion</columnDescription>
        </column>
        <column>
            <columnName>sector</columnName>
            <columnDescription>identifica el sector de la institucion</columnDescription>
            <columnValues>
                <columnValue>público</columnValue>
                <columnValue>privado</columnValue>
            </columnValues>
        </column>
        <column>
            <columnName>academicType</columnName>
            <columnDescription>identifica el tipo de institucion</columnDescription>
            <columnValues>
                <columnValue>universidad</columnValue>
                <columnValue>universidad / tecnológica</columnValue>
                <columnValue>tecnológico</columnValue>
                <columnValue>técnica profesional</columnValue>
            </columnValues>
        </column>
        <column>
            <columnName>urlWeb</columnName>
            <columnDescription>es la url de la pagina web de la institucion</columnDescription>
        </column>
        <column>
            <columnName>urlImg</columnName>
            <columnDescription>es la url del logo de la institucion</columnDescription>
        </column>
    </columns>
</Table>


<Table>
    <tableName>programs</tableName>
    <columns>
        <column>
            <columnName>programID</columnName>
            <columnDescription>es el id unico que identifica a cada programa academico</columnDescription>
        </column>
        <column>
            <columnName>programSlug</columnName>
            <columnDescription>es el slug SEO-friendly del programa basado en el nombre del programa. Se usa para las URLs amigables junto con instituteSlug</columnDescription>
        </column>
        <column>
            <columnName>instituteSlug</columnName>
            <columnDescription>es el slug SEO-friendly de la institución basado en el nombre del instituto. Se usa para las URLs amigables junto con programSlug</columnDescription>
        </column>
        <column>
            <columnName>isPrimaryVariant</columnName>
            <columnDescription>indica si este programa es la variante principal (1) o una variante secundaria (0) de un grupo de programas similares del mismo instituto</columnDescription>
            <columnValues>
                <columnValue>0</columnValue>
                <columnValue>1</columnValue>
            </columnValues>
        </column>
        <column>
            <columnName>variantType</columnName>
            <columnDescription>indica el tipo de variación cuando hay múltiples versiones del mismo programa en el mismo instituto</columnDescription>
            <columnValues>
                <columnValue>location</columnValue>
                <columnValue>modality</columnValue>
                <columnValue>duration</columnValue>
                <columnValue>accreditation</columnValue>
                <columnValue>multiple</columnValue>
                <columnValue>NULL</columnValue>
            </columnValues>
        </column>
        <column>
            <columnName>instituteID</columnName>
            <columnDescription>es la llave foránea que relaciona el programa con su institución educativa</columnDescription>
        </column>
        <column>
            <columnName>programName</columnName>
            <columnDescription>es el nombre del programa academico</columnDescription>
        </column>
        <column>
            <columnName>programDescription</columnName>
            <columnDescription>es la descripción detallada del programa académico</columnDescription>
        </column>
        <column>
            <columnName>programType</columnName>
            <columnDescription>es el tipo de programa academico</columnDescription>
            <columnValues>
                <columnValue>técnico</columnValue>
                <columnValue>tecnológico</columnValue>
                <columnValue>universitario</columnValue>
                <columnValue>especialización técnica</columnValue>
                <columnValue>especialización tecnológica</columnValue>
                <columnValue>especialización universitaria</columnValue>
                <columnValue>especialización médica</columnValue>
                <columnValue>maestría</columnValue>
                <columnValue>doctorado</columnValue>
            </columnValues>
        </column>
        <column>
            <columnName>accreditation</columnName>
            <columnDescription>es el tipo de acreditacion que tiene el programa academico</columnDescription>
            <columnValues>
                <columnValue>alta calidad</columnValue>
                <columnValue>registro calificado</columnValue>
                <columnValue>previa</columnValue>
                <columnValue>n/a</columnValue>
            </columnValues>
        </column>
        <column>
            <columnName>academicLevel</columnName>
            <columnDescription>es el nivel educativo que tiene el programa academico</columnDescription>
            <columnValues>
                <columnValue>pregrado</columnValue>
                <columnValue>posgrado</columnValue>
            </columnValues>
        </column>
        <column>
            <columnName>modality</columnName>
            <columnDescription>es la modalidad del programa academico</columnDescription>
            <columnValues>
                <columnValue>virtual</columnValue>
                <columnValue>presencial</columnValue>
                <columnValue>a distancia</columnValue>
                <columnValue>híbrido</columnValue>
            </columnValues>
        </column>
        <column>
            <columnName>credits</columnName>
            <columnDescription>es el numero de creditos del programa academico</columnDescription>
        </column>
        <column>
            <columnName>duration</columnName>
            <columnDescription>es la duracion del programa academico</columnDescription>
        </column>
        <column>
            <columnName>location</columnName>
            <columnDescription>es la ciudad/lugar donde se da el programa academico</columnDescription>
        </column>
        <column>
            <columnName>price</columnName>
            <columnDescription>es el precio de matricula de cada programa academico</columnDescription>
        </column>
    </columns>
</Table>
`

export default dbDescription
