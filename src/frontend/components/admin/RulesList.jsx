import { uid } from 'uid'
import BtnAdd from './BtnAdd'
import Rule from './Rule'

const Rules = ({
    isConfigEnable = true,
    rulesList = [{ id: '1', enabled: false, rule: '' }],
    register = {},
    errors = {},
    toggleRuleState = () => {},
    updateRules = () => {},
    setValue = () => {},
    formData = {}
}) => {
    const addRule = () => {
        const id = uid(24)
        const newRule = {
            id,
            enabled: false,
            rule: 'New rule'
        }
        updateRules([...rulesList, newRule])
    }

    // removeRule removes a rule from the list of rules if the rule text is empty
    const removeRule = (id = '') => {
        updateRules(current => current.filter(rule => {
            if (rule.id === id) {
                if (!formData[id]) {
                    return false
                }
                alert('Text rule must be empty to emove the rule')
            }
            return true
        }))
    }

    return <section className="rules-wrapper">
        <h3>Rules</h3>
        <p>
            In this section, you can define specific rules that dictate how the AI should act in different scenarios, setting limitations and conditions that influence its behavior and responses.
        </p>
        <ul className="rules-list">
            {rulesList.map((rule, index) => {
                return (
                    <Rule
                        key={rule.id}
                        rule={rule}
                        index={index}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        toggleRuleState={toggleRuleState}
                        removeRule={removeRule}
                        updateRules={updateRules}
                        formData={formData}
                    />
                )
            }
            )}
        </ul>

        <BtnAdd onClick={addRule} />

        <style jsx>{`

            .rules-wrapper {
                display: ${isConfigEnable ? 'block' : 'none'};
            }

            .rules-list {
                display: grid;
                gap: 1.5em;
            }

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
    </section>
}

export default Rules
