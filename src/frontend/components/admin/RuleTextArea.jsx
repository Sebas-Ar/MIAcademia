import { diffWords } from 'diff'
import { useRef } from 'react'

const RuleTextArea = ({
    removeRule = () => {},
    register = {},
    errors = {},
    initialValue = '',
    setValue = () => {},
    rule = {
        enabled: true,
        id: '',
        rule: ''
    },
    isEditMode = false,
    toggleEditMode = () => {}
}) => {
    const refDiffP = useRef(null)
    const refTextarea = useRef(null)

    const onChange = e => {
        refDiffP.current.innerText = ''
        const { value } = e.target
        const diff = diffWords(initialValue, value)
        diff.forEach(part => {
            const span = document.createElement('span')
            const color = part.added ? 'green' : part.removed ? 'gray' : 'black'
            span.classList.add(color)
            span.innerText = part.value
            refDiffP.current.appendChild(span)
        })
    }

    const resetCurrentValueToInitial = () => {
        setValue(rule.id, initialValue)
        refDiffP.current.innerText = initialValue
    }

    return <div className="wrapper-textarea">
        <pre
            ref={refDiffP}
            className={rule.enabled ? '' : 'disabled'}
        >
            {initialValue}
        </pre>

        <textarea
            ref={refTextarea}
            type="text"
            className={rule.enabled ? '' : 'disabled'}
            disabled={!rule.enabled}
            {...register(rule.id, {
                onChange,
                required: {
                    value: true,
                    message: 'Field is required'
                }
            }
            )}
        />
        {errors[rule.id] &&
        <span className='error'>
            *{errors[rule.id]?.message}
        </span>}

        {rule.enabled &&
        <div className="wrapper-btns">
            {isEditMode
                ? <>
                    <button className="btn-diff" type="button" onClick={() => removeRule(rule.id)}>
                        <svg viewBox="0 0 448 512" fill="currentColor">
                            <path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z"/>
                        </svg>
                    </button>
                    <button className='btn-diff' type="button" onClick={resetCurrentValueToInitial}>
                        <svg viewBox="0 0 512 512" fill="currentColor">
                            <path d="M463.5 224l8.5 0c13.3 0 24-10.7 24-24l0-128c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l119.5 0z"/>
                        </svg>
                    </button>
                    <button className='btn-diff' type="button" onClick={toggleEditMode}>
                        <svg viewBox="0 0 448 512" fill="currentColor">
                            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                        </svg>
                    </button>
                </>
                : <button className='btn-toggle-edit-mode' type="button" onClick={toggleEditMode}>
                    <svg viewBox="-20 -20 550 550" fill="currentColor">
                        <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/>
                    </svg>
                </button>
            }
        </div>}

        <style jsx>{`
            .wrapper-textarea {
                position: relative;
            }

            textarea, pre {
                width: 100%;
                padding: 1em;
                border-radius: .5em;
                background-color: var(--dark-blue);
                color: white;
                field-sizing: content;
                resize: none;
                font-size: 1em;
                font-weight: 300;
                padding-bottom: 2.1em;
                border: .2em solid var(--dark-blue);
            }

            .disabled {
                background-color: var(--gray);
                color: var(--dark-gray);
                border-color: .2em solid var(--dark-blue);
            }

            textarea {
                display: ${isEditMode && rule.enabled ? 'block' : 'none'};
                border-color: var(--yellow);
                background: var(--white);
                color: var(--dark-blue);
            }

            pre {
                display: ${isEditMode && rule.enabled ? 'none' : 'block'};
                white-space: pre-wrap;
            }

            .error {
                position: absolute;
                font-size: .7em;
                color: var(--red);
                top: 100%;
                left: 50%;
                transform: translate(-50%, .2em);
                text-align: center;
                width: 100%;
                font-weight: 400;
            }

            .wrapper-btns {
                width: 100%;
                display: grid;
                justify-content: end;
                padding: 0 .9em;
                position: absolute;
                bottom: .8em;
                right: 50%;
                transform: translate(50%, 0);
                display: flex;
                gap: 1em;
            }

            .btn-diff {
                padding: .2em;
                height: 1.3em;
                width: 1.3em;
                border-radius: .5em;
                background-color: var(--yellow);
                color: var(--white);
                display: grid;
                place-items: center;
                transition: transform .3s;
            }

            .btn-diff:hover {
                transform: scale(1.1);
            }

            .options {
                position: absolute;
                bottom: .5em;
                right: .5em;
                display: flex;
                gap: .5em;
            }

            .btn-toggle-edit-mode {
                padding: .2em;
                height: 1.3em;
                width: 1.3em;
                border-radius: .5em;
                background-color: var(--white);
                color: var(--dark-blue);
                display: grid;
                place-items: center;
                transition: transform .3s;

            }
            .btn-toggle-edit-mode:hover {
                transform: scale(1.1);
            }
        `}</style>
    </div>
}

export default RuleTextArea
