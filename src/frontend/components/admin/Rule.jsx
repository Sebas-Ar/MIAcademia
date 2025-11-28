import { useState } from 'react'
import RuleControls from './RuleControls'
import RuleTextArea from './RuleTextArea'

const Rule = ({
    rule = {
        id: '',
        rule: ''
    },
    register = {},
    errors = {},
    setValue = () => {},
    index = 0,
    toggleRuleState = () => {},
    removeRule = () => {},
    updateRules = () => {},
    formData = {}
}) => {
    const [isEditMode, setIsEditMode] = useState(false)

    const toggleEditMode = () => {
        setIsEditMode(current => !current)
    }

    const disalbeEditMode = () => {
        setIsEditMode(false)
    }

    return <li className="rule">
        <RuleControls
            register={register}
            index={index}
            toggleRuleState={toggleRuleState}
            rule={rule}
            updateRules={updateRules}
            disalbeEditMode={disalbeEditMode}
            formData={formData}
        />
        <RuleTextArea
            removeRule={removeRule}
            register={register}
            errors={errors}
            initialValue={rule.rule}
            setValue={setValue}
            rule={rule}
            isEditMode={isEditMode}
            toggleEditMode={toggleEditMode}
            setIsEditMode={setIsEditMode}
        />

        <style jsx>{`
            .rule {
                position: relative;
            }
        `}</style>
    </li>
}

export default Rule
