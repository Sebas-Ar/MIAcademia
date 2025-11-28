import clientOpenaIA from '@/backend/clients/openIA'
import { addProgramSelectedToVocationalTestDB, asignEmailToVocationalTestDB, createVocationalTestDB, deleteAllVocationalTestWithAnonimousUserID, getVocationalTestListDB, updateVocationalTestDB } from '../db/vocationalTests.db'

import { z } from 'zod'
import hollandTest from '../ia/prompts/hollandTest'

import { shuffleArray } from '@/frontend/utils/array'
import { technicalPrograms } from '@/utils/technicalPrograms'
import { univeristyPrograms } from '@/utils/universitaryPrograms'
import { zodResponseFormat } from 'openai/helpers/zod'

export const getVocationalTestList = async (req, res) => {
    const { start, end, day, month, year } = req.query

    const rangeStart = new Date(`${year}-${month}-${day}T${start}:00.000Z`)
    const rangeEnd = new Date(`${year}-${month}-${day}T${end}:59.999Z`)

    try {
        const { testList } = await getVocationalTestListDB({ rangeStart, rangeEnd })
        if (testList) res.json({ testList })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: error.message
        })
    }
}

export const generateVocationalTestResult = async (req, res) => {
    const { questionary, testID, percentages, completedAt, duration } = req.body

    const enablePrograms = {
        univeristyPrograms: {},
        technicalPrograms: {}
    }
    // recorre univeristyPrograms y por cada clave recorre el array de programas
    for (const key in univeristyPrograms) {
        const programList = univeristyPrograms[key]
        // aleatoriza el array de programas y solo devuelve los primeros 15
        const aleatoryPrograms = shuffleArray(programList).slice(0, 15)
        enablePrograms.univeristyPrograms[key] = aleatoryPrograms
    }

    // recorre technicalPrograms y por cada clave recorre el array de programas
    for (const key in technicalPrograms) {
        const programList = technicalPrograms[key]
        // aleatoriza el array de programas y solo devuelve los primeros 15
        const aleatoryPrograms = shuffleArray(programList).slice(0, 15)
        enablePrograms.technicalPrograms[key] = aleatoryPrograms
    }

    const type = z.object({
        name: z.string(),
        percentualScore: z.number(),
        interpretationProfile: z.string(),
        recommendedProgramList: z.object({
            universityPrograms: z.array(z.string()),
            technicalPrograms: z.array(z.string())
        }),
        strengthsDescription: z.string()
    })

    const testResultJSONFormat = z.array(type)

    const dominantProfile = z.object({
        acronym: z.string(),
        descriptionAcronym: z.string()
    })

    let testResult = {}

    try {
        const chatResultTest = await clientOpenaIA.chat.completions.create({
            model: 'gpt-4.1-nano',
            messages: [
                { role: 'system', content: hollandTest },
                { role: 'system', content: JSON.stringify({ percentages }) },
                { role: 'system', content: JSON.stringify({ enablePrograms }) },
                { role: 'user', content: JSON.stringify(questionary) }
            ],
            response_format: zodResponseFormat(z.object({ testResult: testResultJSONFormat, dominantProfile }), 'test_result')
        })

        const { content } = chatResultTest.choices[0].message
        testResult = JSON.parse(content)

        const testData = {
            result: testResult,
            questionary,
            completedAt: new Date(completedAt.replace('Z', '+05:00')),
            duration
        }

        const { errorUpdateTest } = await updateVocationalTestDB({ testID, testData })
        if (errorUpdateTest) throw new Error(errorUpdateTest)
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }

    res.status(200).json({
        testResult
    })
}

export const updateVocationalTest = async (req, res) => {
    const { testID } = req.query
    const { testData, programName } = req.body

    try {
        if (programName) {
            const { errorAddProgram } = await addProgramSelectedToVocationalTestDB({ testID, programName })
            if (errorAddProgram) throw new Error(errorAddProgram)
        } else {
            const { errorUpdateTest } = await updateVocationalTestDB({ testID, testData })
            if (errorUpdateTest) throw new Error(errorUpdateTest)
        }

        res.status(200).json({ message: 'success' })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: error.message
        })
    }
}

export const assignEmailToVocationalTest = async (req, res) => {
    const { userID, email } = req.body

    try {
        if (!userID || !email) {
            throw new Error('no anonimousUserID or email')
        }
        const { error } = await asignEmailToVocationalTestDB({ userID, email })
        if (error) throw new Error(error)

        res.status(200).json({ message: 'success' })
    } catch (error) {
        console.log(error.message)
        res.status(200).json({
            error: error.message
        })
    }
}

export const intializeVocationalTest = async (req, res) => {
    const { userID, startedAt, userEmail, questionsListAleatory, anonimousUserID, questionsNumber } = req.body
    try {
        if (anonimousUserID) await deleteAllVocationalTestWithAnonimousUserID({ anonimousUserID })

        const { testSaved, error } = await createVocationalTestDB({ userID, startedAt, userEmail, questionsListAleatory, anonimousUserID, questionsNumber })
        if (error) throw new Error(error)

        res.status(200).json({ testSaved })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: error.message
        })
    }
}
