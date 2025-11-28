import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { uid } from 'uid'
import BtnAdd from './BtnAdd'
import BtnSubmit from './BtnSubmit'
import Suggestion from './Suggestion'

const Suggestions = () => {
    const [suggestionList, setsuggestionList] = useState([])
    const [initValues, setInitValues] = useState([])
    const [isFormUpdated, setIsFormUpdated] = useState(false)
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        defaultValues: async () => {
            const response = await fetch('/api/suggestions')
            const { suggestionsList } = await response.json()
            const sortedsuggestionsList = suggestionsList.sort((suggA, suggB) => suggB.selected - suggA.selected)
            setsuggestionList(sortedsuggestionsList)
            setInitValues(sortedsuggestionsList)
            const dafultValues = {}
            sortedsuggestionsList.forEach(suggestion => {
                dafultValues[suggestion._id] = suggestion.text
            })
            return dafultValues
        }
    })

    const formData = watch(undefined)

    useEffect(() => {
        if (suggestionList.length > 0) {
            const formDataSuggestions = mapFormDataToSuggestions(suggestionList, formData)

            const isDiff = verifyDiff(initValues, formDataSuggestions) ||
                           initValues.length !== formDataSuggestions.length
            setIsFormUpdated(isDiff)
        }
    }, [formData])

    const verifyDiff = (initialSuggestions = [], currentSuggestion = []) => {
        return initialSuggestions.some((initSugg, index) => {
            if (initSugg.text !== currentSuggestion[index]?.text) {
                return true
            }
            return false
        })
    }

    const mapFormDataToSuggestions = (suggestionList, suggestionsFormData) => {
        return suggestionList.map((suggestion) => {
            return {
                _id: suggestion._id,
                text: suggestionsFormData[suggestion._id],
                selected: suggestion.selected
            }
        })
    }

    const updateSuggestionList = async (formData) => {
        setLoading(true)

        const newSuggestionList = mapFormDataToSuggestions(suggestionList, formData)

        try {
            const response = await fetch('/api/suggestions', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newSuggestionList })
            })
            await response.json()
            setInitValues(newSuggestionList)
            setsuggestionList(newSuggestionList)
        } catch (error) {
            console.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const addSuggestion = () => {
        const _id = uid(24)
        const newSuggestion = {
            _id,
            enabled: true,
            text: 'New rule',
            selected: 0
        }
        setsuggestionList([...suggestionList, newSuggestion])
    }

    const removeSuggestion = (id = '') => {
        setsuggestionList(current => current.filter(sugg => {
            if (sugg._id === id) {
                if (!formData[id]) {
                    return false
                }
                alert('Text rule must be empty to emove the rule')
            }
            return true
        }))
    }

    return (
        <div className="container">
            <h3>Introduction</h3>
            <p>
                In this section you can configure the suggestions showes to inser in the input bar and chat response. This es aleatory and the most selected suggestions are shown first.
            </p>

            <form onSubmit={handleSubmit(updateSuggestionList)}>
                <ul>
                    {
                        suggestionList.map((suggestion) => (
                            <Suggestion
                                key={suggestion._id}
                                register={register}
                                errors={errors}
                                initialValue={suggestion.text}
                                setValue={setValue}
                                suggestion={{
                                    enabled: true,
                                    id: suggestion._id,
                                    rule: suggestion.text,
                                    selected: suggestion.selected
                                }}
                                removeSuggestion={removeSuggestion}
                            />
                        ))
                    }
                </ul>
                <BtnAdd onClick={addSuggestion} />
                <BtnSubmit
                    loading={loading}
                    isFormUpdated={isFormUpdated}
                />
            </form>

            <style jsx>{`

                h3 {
                    font-size: 1.2em;
                    text-align: center;
                    font-weight: 500;
                    text-transform: capitalize;
                    margin-bottom: .5em;
                }

                p {
                    font-weight: 400;
                    font-size: .9em;
                    margin-bottom: 1em
                }

                ul {
                    display: grid;
                    gap: 1em;
                }
            `}</style>
        </div>
    )
}

export default Suggestions
