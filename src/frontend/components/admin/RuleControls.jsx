
const RuleControls = ({
    register = () => {},
    index = -1,
    toggleRuleState = () => {},
    rule = {},
    updateRules = () => {},
    disalbeEditMode = () => {},
    formData = {}
}) => {
    return <div className="control">
        <h4>● Rule {index + 1}</h4>
        <div className="checkbox-wrapper">
            <input
                type="checkbox"
                className="check skewed"
                onFocus={() => toggleRuleState(rule.id, updateRules, disalbeEditMode)}
                id={'check' + rule.id}
                {...register(`${rule.id}Enable`, {
                    checked: rule.enabled
                })}
            />
            <label
                className="check-label"
                data-tg-off="OFF"
                data-tg-on="ON"
                htmlFor={'check' + rule.id}
            >

            </label>
        </div>

        <style jsx>{`

            .control {
                display: flex;
                align-items: center;
                gap: 1em;
                margin-bottom: .4em;
                position: relative;
                padding: 0 1em;
            }

            h4 {
                font-weight: 400;
                font-size: 1em;
                text-transform: capitalize;
            }

            

            .checkbox-wrapper .check {
                position: absolute;
                height: 0;
                width: 0;
                overflow: hidden;
            }
            
            .checkbox-wrapper .check,
            .checkbox-wrapper .check:after,
            .checkbox-wrapper .check:before,
            .checkbox-wrapper .check *,
            .checkbox-wrapper .check *:after,
            .checkbox-wrapper .check *:before,
            .checkbox-wrapper .check + .check-label {
                box-sizing: border-box;
            }
            .checkbox-wrapper .check::-moz-selection,
            .checkbox-wrapper .check:after::-moz-selection,
            .checkbox-wrapper .check:before::-moz-selection,
            .checkbox-wrapper .check *::-moz-selection,
            .checkbox-wrapper .check *:after::-moz-selection,
            .checkbox-wrapper .check *:before::-moz-selection,
            .checkbox-wrapper .check + .check-label::-moz-selection,
            .checkbox-wrapper .check::selection,
            .checkbox-wrapper .check:after::selection,
            .checkbox-wrapper .check:before::selection,
            .checkbox-wrapper .check *::selection,
            .checkbox-wrapper .check *:after::selection,
            .checkbox-wrapper .check *:before::selection,
            .checkbox-wrapper .check + .check-label::selection {
                background: none;
            }
            .checkbox-wrapper .check + .check-label {
                outline: 0;
                display: block;
                width: 4em;
                height: 1.6em;
                position: relative;
                cursor: pointer;
                -webkit-user-select: none;
                -moz-user-select: none;
                    -ms-user-select: none;
                        user-select: none;
            }
            .checkbox-wrapper .check + .check-label:after,
            .checkbox-wrapper .check + .check-label:before {
                position: relative;
                display: block;
                content: "";
                width: 50%;
                height: 100%;
            }
            .checkbox-wrapper .check + .check-label:after {
                left: 0;
            }
            .checkbox-wrapper .check + .check-label:before {
                display: none;
            }
            .checkbox-wrapper .check:checked + .check-label:after {
                left: 50%;
            }

            .checkbox-wrapper .skewed + .check-label {
                overflow: hidden;
                transform: skew(-10deg);
                -webkit-backface-visibility: hidden;
                        backface-visibility: hidden;
                transition: all 0.2s ease;
                font-family: sans-serif;
                background: var(--gray);
            }

            .checkbox-wrapper .skewed + .check-label:after,
            .checkbox-wrapper .skewed + .check-label:before {
                transform: skew(10deg);
                display: inline-block;
                transition: all 0.2s ease;
                width: 100%;
                text-align: center;
                position: absolute;
                line-height: 1.7em;
                font-weight: bold;
                color: var(--dark-blue);
                text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
            }
            .checkbox-wrapper .skewed + .check-label:after {
                left: 100%;
                content: attr(data-tg-on);
            }
            .checkbox-wrapper .skewed + .check-label:before {
                color: var(--dark-gray);
                left: 0;
                content: attr(data-tg-off);
            }
            .checkbox-wrapper .skewed + .check-label:active {
                background: var(--gray);
            }
            .checkbox-wrapper .skewed + .check-label:active:before {
                left: -10%;
            }
            .checkbox-wrapper .skewed:checked + .check-label {
                background: var(--yellow);
            }
            .checkbox-wrapper .skewed:checked + .check-label:before {
                left: -100%;
            }
            .checkbox-wrapper .skewed:checked + .check-label:after {
                left: 0;
            }
            .checkbox-wrapper .skewed:checked + .check-label:active:after {
                left: 10%;
            }
        `}</style>
    </div>
}

export default RuleControls
