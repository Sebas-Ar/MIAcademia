import { useState } from 'react'
import RuleTextArea from './RuleTextArea'

const Introduction = ({
    register = {},
    errors = {},
    id = '',
    initialValue = '',
    setValue = () => {}
}) => {
    const [isEditMode, setIsEditMode] = useState(false)

    const toggleEditMode = () => {
        setIsEditMode(current => !current)
    }
    return (
        <>
            <h3>Introduction</h3>
            <p>
                In this section, you can configure the core essence and purpose of the AI, defining its personality and how it interacts with users based on the desired experience.
            </p>
            <RuleTextArea
                register={register}
                errors={errors}
                initialValue={initialValue}
                setValue={setValue}
                rule={{ id, enabled: true }}
                isEditMode={isEditMode}
                toggleEditMode={toggleEditMode}
            />

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

                
            `}</style>
        </>
    )
}

export default Introduction
