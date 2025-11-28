import { chatActive as chatActiveTemplate } from '@/backend/db/chat.db'
import clientOpenaIA from '../clients/openIA'
import { getProgramsListDB } from '../db/progams.db'
import { openIAGenerateSQLQuery } from './chatCompletions'

export const generateSQLQuery = async ({
    chatActive = chatActiveTemplate,
    SQLGenerator,
    userQuery,
    maxAttempts = 3 // Se puede configurar el máximo de intentos
}) => {
    chatActive.attemptsListSQL = []
    try {
        let attempt = 0
        let data = null

        // Usamos previousAttempt para poder modificar la consulta en cada retry
        const previousAttempt = []

        while (attempt < maxAttempts && !data) {
            attempt++

            // Generamos la consulta SQL con la configuración y el query actual
            const { querySQL, errGenerateSQL } = await openIAGenerateSQLQuery({
                clientIA: clientOpenaIA,
                SQLGeneratorConfig: SQLGenerator,
                userQuery: 'userQuery: ' + JSON.stringify(userQuery) + ' previousAttemptList:' + JSON.stringify(previousAttempt),
                attempt
            })

            // Registramos los detalles del intento actual
            chatActive.attemptsListSQL.push({
                attempt,
                querySQL,
                previousAttempt,
                errGenerateSQL: errGenerateSQL || null
            })

            // Ejecutamos la consulta en la base de datos
            const { data: dbData, errorGetProgramsList } = await getProgramsListDB({ querySQL })
            if (errorGetProgramsList) {
                chatActive.attemptsListSQL[attempt - 1].errorGetProgramsList = errorGetProgramsList

                // Preparamos la consulta para el siguiente intento, indicando la excepción y el error obtenido (si existe)
                previousAttempt.push({
                    attempt,
                    querySQL,
                    errorGetProgramsList
                })
            }

            // muestra las consultas
            // console.log(chatActive.attemptsListSQL[attempt - 1])

            if (dbData) {
                data = dbData
                chatActive.programsList = JSON.parse(data)
                break // Si obtenemos resultados, salimos del ciclo
            }
        }

        // Guardamos el total de intentos realizados
        chatActive.totalAttempts = attempt

        return { attempts: attempt, data }
    } catch (error) {
        chatActive.sqlError = error.message
        return { errorSQL: error.message }
    }
}
