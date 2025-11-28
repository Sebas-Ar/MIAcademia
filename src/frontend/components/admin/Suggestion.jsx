import { useState } from 'react'
import RuleTextArea from './RuleTextArea'

const Suggestion = ({
    register = {},
    errors = {},
    initialValue = '',
    setValue = () => {},
    suggestion = {
        enabled: true,
        id: '',
        rule: '',
        selected: 0
    },
    removeSuggestion = () => { }
}) => {
    const [isEditMode, setIsEditMode] = useState(false)

    const toggleEditMode = () => {
        setIsEditMode(current => !current)
    }

    return (
        <div className="suggestion">
            {/* <textarea key={suggestion._id} {...register(suggestion._id)}></textarea> */}
            <RuleTextArea
                removeRule={removeSuggestion}
                register={register}
                errors={errors}
                initialValue={initialValue}
                setValue={setValue}
                rule={suggestion}
                isEditMode={isEditMode}
                toggleEditMode={toggleEditMode}
                setIsEditMode={setIsEditMode}
            />
            <span>{suggestion.selected}</span>

            <style jsx>{`
                .suggestion {
                    display: grid;
                    grid-template-columns: 1fr 2em;
                    align-items: center;
                    gap: 1em;
                }

                span {
                    text-align: center;
                }
            `}</style>
        </div>
    )
}

export default Suggestion
