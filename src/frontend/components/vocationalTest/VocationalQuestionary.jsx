// components
import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { useState } from 'react'
import LoadingTest from '../loading/loadingTest'
import VocationalQuestion from './VocationalQuestion'
import VocationalQuestionaryCtrl from './VocationalQuestionaryCtrl'
import VocationalHeader from './VocationlHeader'

// getCurrentNumberQuestionAnswered
const getCurrentNumberQuestionAnswered = (questionaryStoraged = []) => {
    let count = 0
    questionaryStoraged.forEach((question) => {
        if (question.value !== null) count++
    })
    return count
}

const VocationalQuestionary = ({
    test = {},
    router = null,
    enableExitModal = () => { }
}) => {
    const [selectedQuestion, setSelectedQuestion] = useState(getCurrentNumberQuestionAnswered(test.questionsListAleatory))
    const [questionsList, setQuestionsList] = useState(test.questionsListAleatory)
    const [isLoading, setIsLoading] = useState(false)
    const [isShowError, setIsShowError] = useState(false)

    const answerQuestion = async (questionIndex, answer) => {
        triggerEvent(eventCategories.TEST_VOCACIONAL, eventNames.ANSWER, {
            questionNumber: questionIndex + 1
        })
        let questionListUpdated = []
        setQuestionsList(current => {
            questionListUpdated = current.map((question, index) => {
                if (index === questionIndex) {
                    return {
                        ...question,
                        value: answer
                    }
                }
                return question
            })

            localStorage.setItem('questionsList', JSON.stringify(questionListUpdated))

            return questionListUpdated
        })
        // if (selectedQuestion % 2 === 0) {
        fetch('/api/vocational-test/' + test._id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                testData: {
                    questionsListAleatory: questionListUpdated
                }
            })
        })
        // }

        setSelectedQuestion(current => {
            if (current < questionsList.length - 1) return current + 1
            return current
        })
    }

    const finishTest = async () => {
        triggerEvent(eventCategories.TEST_VOCACIONAL, eventNames.FINISH_TEST)
        setIsLoading(true)

        // group questions by type
        const orderedQuestionary = Object.groupBy(questionsList, item => item.type)

        const percentages = []

        // calculate percentages and delete type
        for (const key in orderedQuestionary) {
            let afirmativeCount = 0
            orderedQuestionary[key].forEach(question => {
                afirmativeCount += question.value === 'Sí' ? 1 : 0
                delete question.type
            })
            percentages.push({
                name: key,
                percentage: (afirmativeCount / orderedQuestionary[key].length) * 100
            })
        }

        const body = {
            questionary: orderedQuestionary,
            percentages,
            testID: test._id,
            completedAt: new Date(),
            duration: new Date() - new Date(localStorage.getItem('startedAt'))
        }

        try {
            const response = await fetch('/api/vocational-test', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })

            if (!response.ok) {
                throw new Error('Something went wrong')
            }
        } catch (error) {
            console.log(error)
            setIsShowError(true)
        }

        localStorage.removeItem('questionsList')
        // localStorage.setItem('testResult', JSON.stringify(data.testResult))
        // setQuestionaryResult(data.testResult)

        router.push('/test-vocacional/holland/' + test._id + '/result')
    }

    if (isLoading) return <LoadingTest />
    if (isShowError) return <p>Algo salió mal, intenta nuevamente</p>

    return (
        <article className="container">
            <VocationalHeader
                selectedQuestion={selectedQuestion}
                questionsList={questionsList}
                enableExitModal={enableExitModal}
            />

            {
                questionsList?.map((question, index) => (
                    <VocationalQuestion
                        key={index}
                        selecetedQuestion={selectedQuestion}
                        numberQuestion={index}
                        question={question.question}
                        response={question.value}
                        answerQuestion={answerQuestion}
                    />
                ))
            }

            <VocationalQuestionaryCtrl
                questionsList={questionsList}
                selectedQuestion={selectedQuestion}
                setSelectedQuestion={setSelectedQuestion}
                finishTest={finishTest}
            />
            <style jsx>{`
                .container {
                    height: 100%;
                    width: 100%;
                    display: grid;
                    grid-template-rows: auto 1fr auto;
                    max-width: 80em;
                    padding-bottom: 1.5em;
                }
            `}</style>
        </article>

    )
}

export default VocationalQuestionary
