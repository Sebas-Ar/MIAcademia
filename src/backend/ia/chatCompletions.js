
import clientClaude from '../clients/claude'
import clientDeepSeek from '../clients/deepseek'
import clientGemini from '../clients/gemini'
import clientGroq from '../clients/groq'
import clientOpenaIA from '../clients/openIA'
import { formatConfig } from './prompts/prompts'

export const openIAGenerateSQLQuery = async ({
    clientIA = {},
    SQLGeneratorConfig = { introduction: '', rules: [] },
    userQuery = '',
    attempt = 1
}) => {
    let message
    try {
        const chatSQLQuery = await clientIA.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [
                { role: 'system', content: formatConfig(SQLGeneratorConfig) },
                { role: 'system', content: `Intento: ${attempt}` },
                { role: 'user', content: userQuery }

            ]
        })

        console.log({ userQuery })
        const { content } = chatSQLQuery.choices[0].message
        console.log({ usage: chatSQLQuery.usage })
        console.log({ sqlResponse: content })
        message = content

        return { querySQL: content }
    } catch (error) {
        return {
            errGenerateSQL: JSON.stringify({
                error: error.message,
                msg: message
            })
        }
    }
}

export const geminiGeneratorSLQQuery = async ({
    clientIA = {},
    SQLGeneratorConfig = { introduction: '', rules: [] },
    userQuery = '',
    attempt = 1
}) => {
    let message
    try {
        const model = clientIA.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })
        // console.log(SQLGeneratorConfig.introduction)

        const geminiResponse = await model.generateContent([
            formatConfig(SQLGeneratorConfig),
            `Intento: ${attempt}`,
            userQuery
        ])

        console.log({ geminiResponse: await geminiResponse.response.text().replace('\n', '') })

        return {
            geminiResponse: await geminiResponse.response.text().replace('\n', '')
        }
    } catch (error) {
        console.log(error)
        return {
            errGenerateSQL: JSON.stringify({
                error: error.message,
                msg: message
            })
        }
    }
}

export const claudeGenerateResponse = async ({ res, clientIA, responseGeneratorConfig, userQuery, data, retryData, totalPrograms = 0 }) => {
    try {
        const claudeResponse = await clientIA.beta.promptCaching.messages.create({
            model: 'claude-3-5-haiku-latest',
            stream: true,
            system: [
                { type: 'text', text: formatConfig(responseGeneratorConfig) },
                { type: 'text', text: JSON.stringify({ data: data || 'no hay programas' }) },
                { type: 'text', text: JSON.stringify({ retryData: retryData || 'no hay programas de respaldo' }) },
                { type: 'text', text: `Total de programas encontrados: ${totalPrograms}. ${totalPrograms > 8 ? 'IMPORTANTE: Debes incluir el botón "Ver más programas" al final de la lista.' : 'NO incluyas el botón "Ver más programas" porque no hay más resultados.'}` }
            ],
            messages: [
                { role: 'user', content: userQuery }
            ],
            max_tokens: 4096,
            temperature: 0
        })

        let response = ''

        for await (const part of claudeResponse) {
            if (part.delta) {
                const text = part?.delta?.text ?? ''
                response += text
                res.write(text)
            }
        }

        return { response }
    } catch (error) {
        console.log({ error: 'error en el chatCompletions de Claude', message: error.message })
        return { errorGenerateResponse: error.message }
    }
}

// Función para limpiar los bloques de código Markdown del HTML
const limpiarBloquesCodigoMarkdown = (texto) => {
    if (!texto) {
        return ''
    }

    const regexInicioBloque = /^\s*(?:```html)\s*/gm
    const regexFinBloque = /^\s*```\s*$/gm
    let textoProcesado = texto.replace(regexInicioBloque, '')
    textoProcesado = textoProcesado.replace(regexFinBloque, '')

    return textoProcesado
}

export const geminiGenerateResponse = async ({ res, clientIA, responseGeneratorConfig, userQuery, data, retryData, totalPrograms = 0 }) => {
    try {
        const model = clientIA.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })

        const geminiResponse = await model.generateContentStream([
            formatConfig(responseGeneratorConfig),
            // JSON.stringify({ querySQL: querySQL || 'no existe querySQL relacionada a la consulta' }),
            JSON.stringify({ programasData: data || 'no hay programas' }),
            JSON.stringify({ retryData: retryData || 'no hay programas de respaldo' }),
            `Total de programas encontrados: ${totalPrograms}. ${totalPrograms > 8 ? 'IMPORTANTE: Debes incluir el botón "Ver más programas" al final de la lista.' : 'NO incluyas el botón "Ver más programas" porque no hay más resultados.'}`,
            userQuery
        ])
        // console.log(chatResponse)

        let response = ''
        for await (const part of geminiResponse.stream) {
            // formato para gemini
            const text = limpiarBloquesCodigoMarkdown(part.text())
            response += text
            res.write(text)
        }

        return { response }
    } catch (error) {
        console.log({ error: 'error en el chatCompletions de gemini', message: error.message })
        return { errorGenerateResponse: error.message }
    }
}

export const openIAGenerateResponse = async ({ res, clientIA, responseGeneratorConfig, userQuery, data, totalPrograms = 0 }) => {
    try {
        const resopnseIA = await clientIA.chat.completions.create({
            model: 'gpt-4.1-nano',
            stream: true,
            stream_options: { include_usage: true },
            messages: [
                { role: 'system', content: formatConfig(responseGeneratorConfig) },
                { role: 'system', content: JSON.stringify({ data: data || 'no hay programas' }) },
                { role: 'system', content: `Total de programas encontrados: ${totalPrograms}. ${totalPrograms > 8 ? 'IMPORTANTE: Debes incluir el botón "Ver más programas" al final de la lista.' : 'NO incluyas el botón "Ver más programas" porque no hay más resultados.'}` },
                { role: 'user', content: userQuery }
            ]
        }, { responseType: 'stream' })

        let response = ''

        for await (const part of resopnseIA) {
            if (part.usage) console.log(part.usage)
            const text = part.choices?.[0]?.delta?.content ?? ''
            response += text
            res.write(text)
        }

        return { response }
    } catch (error) {
        console.log({ error: 'error en el chatCompletions de OpenIA', message: error.message })
        return { errorGenerateResponse: error.message }
    }
}

export const deepSeekGenerateResponse = async ({ res, clientIA, responseGeneratorConfig, userQuery, data, retryData, totalPrograms = 0 }) => {
    try {
        const resopnseIA = await clientIA.chat.completions.create({
            model: 'deepseek-chat',
            stream: true,
            messages: [
                { role: 'system', content: formatConfig(responseGeneratorConfig) },
                { role: 'system', content: JSON.stringify({ data: data || 'no hay programas' }) },
                { role: 'system', content: JSON.stringify({ retryData: retryData || 'no hay programas de respaldo' }) },
                { role: 'system', content: `Total de programas encontrados: ${totalPrograms}. ${totalPrograms > 8 ? 'IMPORTANTE: Debes incluir el botón "Ver más programas" al final de la lista.' : 'NO incluyas el botón "Ver más programas" porque no hay más resultados.'}` },
                { role: 'user', content: userQuery }
            ]
        }, { responseType: 'stream' })

        let response = ''

        for await (const part of resopnseIA) {
            const text = part.choices[0].delta.content ?? ''
            response += text
            res.write(text)
        }

        return { response }
    } catch (error) {
        console.log({ error: 'error en el chatCompletions de deepSeek', message: error.message })
        return { errorGenerateResponse: error.message }
    }
}

export const groqGenerateResponse = async ({ res, clientIA, responseGeneratorConfig, userQuery, data, retryData, totalPrograms = 0 }) => {
    try {
        const resopnseIA = await clientIA.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            stream: true,
            messages: [
                { role: 'system', content: formatConfig(responseGeneratorConfig) },
                { role: 'system', content: JSON.stringify({ data: data || 'no hay programas' }) },
                { role: 'system', content: JSON.stringify({ retryData: retryData || 'no hay programas de respaldo' }) },
                { role: 'system', content: `Total de programas encontrados: ${totalPrograms}. ${totalPrograms > 8 ? 'IMPORTANTE: Debes incluir el botón "Ver más programas" al final de la lista.' : 'NO incluyas el botón "Ver más programas" porque no hay más resultados.'}` },
                { role: 'user', content: userQuery }
            ]
        }, { responseType: 'stream' })

        let response = ''

        for await (const part of resopnseIA) {
            const text = part.choices[0].delta.content ?? ''
            response += text
            res.write(text)
        }

        return { response }
    } catch (error) {
        console.log({ error: 'error en el chatCompletions de Groq', message: error.message })
        return { errorGenerateResponse: error.message }
    }
}

export const modelFunctions = {
    deepseek: {
        generateResponse: deepSeekGenerateResponse,
        clientIA: clientDeepSeek
    },
    openAI: {
        generateResponse: openIAGenerateResponse,
        clientIA: clientOpenaIA
    },
    gemini: {
        generateResponse: geminiGenerateResponse,
        clientIA: clientGemini
    },
    groq: {
        generateResponse: groqGenerateResponse,
        clientIA: clientGroq
    },
    claude: {
        generateResponse: claudeGenerateResponse,
        clientIA: clientClaude
    }
}
