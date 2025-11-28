import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { useChatBarStore } from '@/frontend/hooks/globalState/useChatBarStore'

const SelectFilter = ({
    name = '',
    defaultValueName = '',
    placeholder = '',
    optionList = [],
    selectRef = null,
    isActive = false
}) => {
    const toogleFilter = useChatBarStore((state) => state.toogleFilter)

    const onChange = e => {
        console.log(e.target.value)
        toogleFilter({ filterName: name, value: e.target.value })
        triggerEvent(eventCategories.CHAT, eventNames.CHANGE_FILTER, { inputName: name, inputValue: e.target.value })
    }

    return <label className="select">
        <select name={name} ref={selectRef} onChange={onChange} value={isActive}>
            <option value="disable">{defaultValueName}</option>
            {
                optionList.map(option => (
                    <option key={option} value={option.toLowerCase()}>
                        {option}
                    </option>
                ))
            }

        </select>

        <style jsx>{`
			select {
				opacity: ${isActive !== 'disable' ? '1' : '.5'};
			}
		`}</style>

        <style jsx>{`

			.select {
				position: relative;
				color: var(--dark-blue);
				outline: none;
				border-radius: 2em;
				width: 100%;
				display: block;	
				transition: opacity .3s;
			}

			.select:before {
				font-size: .65em;
				content: "${placeholder}";
				padding: 1px 8px;
				border-radius: 2em;
				border: 2px solid var(--yellow);
				position: absolute;
				background: var(--white);
				top: 0;
				left: 1em;
				transform: translateY(-50%);
				padding-bottom: 3px;
				font-weight: 700;
				z-index: 1;
			}

			select {
				border-radius: inherit;
				padding: .5em 1.5em;
				padding-top: .8em;
				background: var(--white);
				border: 2px solid var(--yellow);
				width: 100%;
				cursor: pointer;
				font-weight: 700;
				transition: opacity .3s;
			}

			select:hover {
				opacity: 1;
			}

			option {
				background: var(--white);
				padding: 1em;
				margin: 1em;
			}

		
		`}</style>

    </label>
}

export default SelectFilter
