import clientProgramsDB from '../clients/programsDB'

export const getProgramDB = async ({ programID = '', programSlug = '', instituteSlug = '', filtersList = { program: [], institute: [] } }) => {
    let result
    try {
        if (filtersList.program.length === 0 && filtersList.institute.length === 0) {
            let query
            if (programID) {
                // Búsqueda por programID (query param ?id=)
                query = `SELECT programs.programID, programs.programSlug, programs.instituteSlug, programs.isPrimaryVariant, programs.variantType, programs.programType, programs.programName, programs.programDescription, programs.accreditation, programs.academicLevel, programs.modality, programs.credits, programs.duration, programs.location, programs.price, institutes.instituteName, institutes.sector, institutes.academicType, institutes.urlImg, institutes.urlWeb FROM institutes JOIN programs ON programs.instituteID = institutes.instituteID WHERE programs.programID =${programID}`
            } else if (programSlug && instituteSlug) {
                // Búsqueda por instituteSlug + programSlug (URL completa)
                query = `SELECT programs.programID, programs.programSlug, programs.instituteSlug, programs.isPrimaryVariant, programs.variantType, programs.programType, programs.programName, programs.programDescription, programs.accreditation, programs.academicLevel, programs.modality, programs.credits, programs.duration, programs.location, programs.price, institutes.instituteName, institutes.sector, institutes.academicType, institutes.urlImg, institutes.urlWeb FROM institutes JOIN programs ON programs.instituteID = institutes.instituteID WHERE programs.programSlug = '${programSlug}' AND programs.instituteSlug = '${instituteSlug}' LIMIT 1`
            } else if (programSlug) {
                // Búsqueda por programSlug solo (compatibilidad)
                query = `SELECT programs.programID, programs.programSlug, programs.instituteSlug, programs.isPrimaryVariant, programs.variantType, programs.programType, programs.programName, programs.programDescription, programs.accreditation, programs.academicLevel, programs.modality, programs.credits, programs.duration, programs.location, programs.price, institutes.instituteName, institutes.sector, institutes.academicType, institutes.urlImg, institutes.urlWeb FROM institutes JOIN programs ON programs.instituteID = institutes.instituteID WHERE programs.programSlug = '${programSlug}' LIMIT 1`
            } else {
                throw new Error('Se requiere programID, programSlug+instituteSlug, o programSlug')
            }
            result = await clientProgramsDB.execute(query)
        } else {
            const queryWithFilters = `SELECT ${filtersList.program.map(filter => `programs.${filter},`).join(' ')} ${filtersList.institute.map(filter => `institutes.${filter},`).join(' ')} programs.programID, programs.programSlug FROM institutes JOIN programs ON programs.instituteID = institutes.instituteID WHERE programs.programID =${programID}`
            result = await clientProgramsDB.execute(queryWithFilters)
        }

        return { program: result.rows[0] }
    } catch (error) {
        return { errorGetProgram: error.message }
    }
}

export const getProgramsListDB = async ({ querySQL }) => {
    if (!querySQL) return { errorGetProgramsList: 'No querySQL' }

    try {
        const result = await clientProgramsDB.execute(querySQL)
        if (result?.rows?.length === 0) throw new Error('No results')

        return { data: JSON.stringify(result) }
    } catch (error) {
        return { errorGetProgramsList: error.message }
    }
}

export const getProgramVariantsDB = async ({ programSlug, instituteSlug }) => {
    if (!programSlug) return { errorGetVariants: 'No programSlug provided' }
    if (!instituteSlug) return { errorGetVariants: 'No instituteSlug provided' }

    try {
        // Obtener todas las variantes por programSlug + instituteSlug (múltiples registros = tiene variantes)
        const query = `SELECT programs.programID, programs.programSlug, programs.instituteSlug, programs.isPrimaryVariant, programs.variantType, programs.programName, programs.location, programs.modality, programs.accreditation, programs.duration, programs.price FROM programs WHERE programs.programSlug = '${programSlug}' AND programs.instituteSlug = '${instituteSlug}' ORDER BY programs.isPrimaryVariant DESC, programs.programID ASC`
        const result = await clientProgramsDB.execute(query)

        if (result?.rows?.length === 0) {
            return { variants: [] }
        }

        return { variants: result.rows }
    } catch (error) {
        return { errorGetVariants: error.message }
    }
}

export const getSimilarProgramsDB = async ({ programID, limit = 6, random = false }) => {
    if (!programID) return { errorGetSimilarPrograms: 'No programID provided' }

    try {
        // 1. Obtener el campo similarPrograms del programa actual
        const query = `SELECT similarPrograms FROM programs WHERE programID = ${programID}`
        const result = await clientProgramsDB.execute(query)

        if (result?.rows?.length === 0 || !result.rows[0]?.similarPrograms) {
            return { similarPrograms: [] }
        }

        // 2. Parsear el JSON de IDs similares
        const similarProgramIDs = JSON.parse(result.rows[0].similarPrograms)

        if (similarProgramIDs.length === 0) {
            return { similarPrograms: [] }
        }

        // 3. Seleccionar programas: aleatorios o primeros N
        let limitedIDs
        if (random) {
            // Mezclar array aleatoriamente (Fisher-Yates shuffle)
            const shuffled = [...similarProgramIDs]
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
            }
            limitedIDs = shuffled.slice(0, Math.min(limit, shuffled.length))
        } else {
            // Tomar los primeros N (ya ordenados por score)
            limitedIDs = similarProgramIDs.slice(0, Math.min(limit, similarProgramIDs.length))
        }

        // 4. Obtener datos completos de los programas similares
        const similarQuery = `
            SELECT 
                programs.programID, 
                programs.programSlug, 
                programs.instituteSlug, 
                programs.programName, 
                programs.programType, 
                programs.accreditation, 
                programs.academicLevel, 
                programs.modality, 
                programs.price,
                institutes.instituteName,
                institutes.urlImg
            FROM programs
            JOIN institutes ON programs.instituteID = institutes.instituteID
            WHERE programs.programID IN (${limitedIDs.join(',')})
        `

        const similarResult = await clientProgramsDB.execute(similarQuery)

        // 5. Ordenar resultados según el orden de limitedIDs (mantiene orden de relevancia o aleatorio)
        const orderedResults = limitedIDs
            .map(id => similarResult.rows.find(row => row.programID === id))
            .filter(Boolean) // Filtrar nulls por si algún ID no existe

        return { similarPrograms: JSON.parse(JSON.stringify(orderedResults)) }
    } catch (error) {
        console.error('Error en getSimilarProgramsDB:', error)
        return { errorGetSimilarPrograms: error.message }
    }
}
