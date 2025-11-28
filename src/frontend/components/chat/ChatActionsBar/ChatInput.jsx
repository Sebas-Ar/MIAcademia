import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { Filter } from 'lucide-react'
import ChatSuggestion from './ChatSuggestion'
import ModalChatFilters from './ModalChatFilters'

const ChatInput = ({
    textAreaRef,
    submitButtonRef,
    value,
    setValue,
    isResponding,
    setIsFilterActive,
    filterEnables,
    isChatEnabled,
    programMode,
    activeSuggestion = () => { },
    isSuggestinEnable = false,
    toggleSugestion = () => { },
    suggestionList = { input: [] },
    isFilterActive = false,
    programTypeRef = null,
    modalityRef = null,
    sectorRef = null,
    cleanFilter = () => {}
}) => {
    const updateTextAreaValue = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            submitButtonRef.current.click()
        }

        if (e.target.value) {
            triggerEvent(eventCategories.CHAT, eventNames.WRITE_QUESTION, { question: e.target.value })
        }

        setValue(e.target.value)
    }

    const toogleFilter = () => {
        if (!isFilterActive) {
            triggerEvent(eventCategories.CHAT, eventNames.OPEN_FILTERS)
        }
        setIsFilterActive(filterActive => !filterActive)
    }

    const updateValue = (e) => {
        setValue(e.target.value)
    }

    return (
        <div className="wrapper-input-chat">

            <div className="chat-bar">
                <button type="button" title='Abrir Filtros' className="button-toggle-filter" onClick={toogleFilter}>
                    <Filter height="1.7em" fill={filterEnables.filterActive > 0 ? 'var(--blue)' : 'var(--gray)'} />
                    {
                        filterEnables.filterActive > 0 &&
                        <span className="number-filter-active">{filterEnables.filterActive}</span>
                    }
                </button>
                <textarea
                    rows="1"
                    ref={textAreaRef}
                    className="textarea-query"
                    onKeyDown={e => updateTextAreaValue(e)}
                    name="question" type="text"
                    placeholder="Consulta a MIA por tu programa de interés"
                    onPaste={updateValue}
                />
                <button
                    title="Enviar Consulta"
                    ref={submitButtonRef}
                    className="send-button"
                    type="submit"
                    disabled={!value || isResponding}
                >
                    <svg className="responding-icon" viewBox="0 0 512 512" fill="currentColor">
                        <path d="M208.5 62.3l28.1-36.9C248.8 9.4 267.8 0 288 0c28.5 0 53.6 18.7 61.8 46l17.8 59.4c10.3 34.4 36.1 62 69.8 74.6l39.8 14.9c20.9 7.9 34.8 27.9 34.8 50.2c0 16.9-7.9 32.8-21.5 42.9l-67.3 50.5c-24.3 18.2-37.2 47.9-33.8 78.1l2.5 22.7c4.3 38.7-26 72.6-65 72.6c-14.8 0-29.3-5.1-40.8-14.3l-55.4-44.3c-4.5-3.6-9.3-6.7-14.5-9.2c-15.8-7.9-33.7-10.4-51-7.3L82.4 451.9C47.8 458.2 16 431.6 16 396.5c0-13.2 4.7-26 13.1-36.2l11.2-13.4c14.6-17.4 22.6-39.4 22.6-62.1c0-18.8-5.5-37.2-15.8-53L8.8 173.5C3.1 164.7 0 154.4 0 143.9c0-33.4 30.1-58.8 63-53.2l51.3 8.7c35.9 6.1 72.2-8.2 94.2-37.1z"/>
                    </svg>
                    <svg className="send-icon" viewBox="0 0 35.83 35.84" fill="currentColor">
                        <path d="m25.24,10.48c-.51.35-1.03.71-1.54,1.06-3.08,2.14-6.17,4.28-9.25,6.43-.44.31-.81.4-1.34.22-3.77-1.28-7.55-2.53-11.33-3.79C.59,14.01,0,13.29,0,12.28c0-1.02.6-1.71,1.81-2.1C12.14,6.84,22.47,3.51,32.8.17c.89-.29,1.71-.26,2.4.42.71.7.75,1.54.45,2.46-3.35,10.35-6.68,20.71-10.02,31.06-.04.11-.07.22-.11.33-.35.88-1.09,1.4-1.98,1.4-.89,0-1.67-.52-1.97-1.41-1.36-4.02-2.7-8.04-4.02-12.07-.08-.25.04-.64.2-.87,2.36-3.42,4.75-6.81,7.12-10.22.16-.23.31-.46.46-.69-.04-.04-.07-.07-.11-.11Z"/>
                    </svg>
                </button>
            </div>

            <ModalChatFilters
                filterEnables={filterEnables}
                isFilterActive={isFilterActive}
                toogleFilter={toogleFilter}
                programTypeRef={programTypeRef}
                modalityRef={modalityRef}
                sectorRef={sectorRef}
                cleanFilter={cleanFilter}
            />

            <ChatSuggestion
                isResponding={isResponding}
                isChatEnabled={isChatEnabled || !programMode}
                activeSuggestion={activeSuggestion}
                isSuggestinEnable={isSuggestinEnable}
                toggleSugestion={toggleSugestion}
                suggestiosnList={suggestionList.input}
                programMode={programMode}
            />

            <style jsx>{`
                
                .wrapper-input-chat {
                    transition: opacity 1s, height 1s;
                    width: 100%;
                    padding: 0 2em;
                    position: relative;
                }

                .wrapper-input-chat::before {
                    width: 100%;
                    content: "";
                    position: absolute;
                    height: 50%;
                    left: 0;
                    z-index: -1;
                    background: var(--yellow);
                    transition: background .7s;
                }

                .chat-bar {
                    margin: auto;
                    max-width: 37em;
                    display: flex;
                    align-items: center;
                    background-color: var(--white);
                    width: 100%;
                    border-radius: 1.5em;
                    transition: border 1s;
                    overflow: hidden;
                    view-transition-name: chat-bar;
                }

                .chat-bar:focus-within {
                    animation: scale-input 1s linear alternate;
                }

                .button-toggle-filter {
                    display: flex;
                    padding: 0 .5em 0 1em;
                    transition: transform .3s;
                    position: relative;
                    color: var(--blue);

                    &:hover {
                        transform: scale(1.1);
                    }

                    .number-filter-active {
                        background: var(--blue);
                        position: absolute;
                        display: grid;
                        place-items: center;
                        top: -.5em;
                        right: 0;
                        width: 1.7em;
                        height: 1.7em;
                        border-radius: 50%;
                        font-size: .6em;
                        font-weight: 600;
                        color: white;
                        border: .2em solid var(--white);
                        line-height: 1.46em;
                    }
                }

                .icon-filter {
                    transform: translate(0px, 2px);
                    transition: transform .3s, height 1s;
                }

                .button-toggle-filter:hover .icon-filter {
                    transform: translate(0px, 2px) scale(1.1);
                }

                .textarea-query {
                    min-height: 2.75em;
                    align-self: center;
                    max-height: 4em;
                    width: 100%;
                    scrollbar-width: none;
                    resize: none;
                    font-family: inherit;
                    background: var(--white);
                    transition: padding 1s, font-size 1s, height .5s;
                    display: grid;
                    align-items: end;
                }

                .textarea-query::-webkit-input-placeholder {
                    color: #16293766;
                    font-weight: 600;
                    font-family: inherit;
                    transition: color .2s;
                    position: relative;
                }
                

                .textarea-query:focus::-webkit-input-placeholder {
                    color: transparent;
                }

                .send-button {
                    position: relative;
                    align-self: stretch;
                    background-color: var(--dark-blue);
                    cursor: pointer;
                    display: grid;
                    place-items: center;
                    padding: 0 .7em;
                    color: var(--white);
                    transition: opacity .3s;
                }

                .send-button:hover .send-icon {
                    transform: scale(1.15) translate(-.1em, .1em);
                }

                .send-button:disabled {
                    opacity: .75;
                    cursor: auto;
                }

                .send-button:disabled .send-icon {
                    transform: scale(1) translate(-.1em, .1em);
                }

                .send-icon {
                    transform: translate(-.1em, .1em);
                    transition: height 1s, transform .3s;;
                }

                .responding-icon {
                    height: 1.5em;
                    animation: rotate-star 1s infinite ease-in-out alternate;
                }

                @keyframes scale-input {
                    0% {
                        transform: scale(1)
                    }

                    25% {
                        transform: scale(0.98)
                    }

                    50% {
                        transform: scale(1.02)
                    }

                    75% {
                        transform: scale(0.98)
                    }

                    100% {
                        transform: scale(1)
                    }
                }

                @keyframes rotate-star {
                    0% {
                        transform: scale(1) rotate(0deg)
                    }

                    25% {
                        transform: scale(0.98) rotate(15deg)
                    }

                    50% {
                        transform: scale(1.02) rotate(-15deg)
                    }

                    75% {
                        transform: scale(0.98) rotate(15deg)
                    }

                    100% {
                        transform: scale(1) rotate(0deg)
                    }
                }
            `}</style>

            {/* animations */}
            <style jsx>{`
                .wrapper-input-chat::before {
                    background: ${isChatEnabled ? 'var(--yellow)' : 'transparent'};
                }

                .wrapper-input-chat {
                    opacity: ${isChatEnabled || !programMode ? '1' : '0'};
                }
                
                .chat-bar {
                    border: ${isChatEnabled || !programMode ? '2px' : '0px'} solid var(--dark-blue);
                }

                .icon-filter {
                    height: ${isChatEnabled || !programMode ? '1.3em' : '0em'};
                }

                .textarea-query {
                    padding: ${isChatEnabled || !programMode ? '.7em .6em .6em .6em' : '0'};
                    font-size: ${isChatEnabled || !programMode ? '.8em' : '0'};
                }

                .textarea-query::-webkit-input-placeholder {
                    font-size: ${isChatEnabled || !programMode ? '1em' : '0'};
                }
                
                .send-icon {
                    height: ${isChatEnabled || !programMode ? '1.1em' : '0'};
                    display: ${isResponding ? 'none' : 'block'};
                }
                
                .responding-icon {
                    display: ${isResponding ? 'block' : 'none'};
                }
            `}</style>
        </div>
    )
}

export default ChatInput
