import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { ExternalLink } from 'lucide-react'

const ChatSuggestion = ({
    isResponding,
    isChatEnabled,
    toggleSugestion,
    activeSuggestion = () => Promise.resolve(),
    isSuggestinEnable,
    suggestiosnList = []
}) => {
    const clickBtnSuggestion = () => {
        if (!isSuggestinEnable) {
            triggerEvent(eventCategories.CHAT, eventNames.OPEN_SUGGESTIONS)
        } else {
            triggerEvent(eventCategories.CHAT, eventNames.CLOSE_SUGGESTIONS)
        }
        toggleSugestion()
    }

    return <div className="suggestion-padding">

        <div className="suggestion-wrapper">
            <h3>Sugerencias</h3>
            <button className='button-active-suggetion' title={isSuggestinEnable ? 'Cerrar Sugerenecias' : 'Abrir Sugerencias'} type="button" onClick={clickBtnSuggestion}>
            </button>
            <section className="suggestion-list">
                {
                    suggestiosnList?.map((suggestion) => (
                        <button
                            type="submit"
                            key={suggestion._id}
                            className='suggestion'
                            onClick={(async () => await activeSuggestion({ suggestion, from: 'action-bar' }))}
                            disabled={isResponding}
                        >
                            {suggestion.text}
                            <span className="icon">
                            	<ExternalLink height="100%" />
                            </span>
                        </button>
                    ))
                }
            </section>

        </div>
        <style jsx>{`
			.suggestion-padding {
				padding: 0 3.5em;
				width: 100%;
				position: absolute;
				top: 100%;
				left: 0;
				display: grid;
				justify-content: center;
				viwe-transition-name: suggestion;
			}

			h3 {
				text-align: center;
				transition: font-size .3s;
				margin-bottom: .5em;
			}
			
			.suggestion-wrapper {
				max-width: 34em;
				background-color: var(--yellow);
				padding: 1em;
				border-radius: 0 0 1em 1em;
				border: 2px solid var(--dark-blue);
				border-top: none;
			}

			.button-active-suggetion {
				position: absolute;
				left: 50%;
				bottom: 0;
				width: 2em;
				height: 1.2em;
				padding: .8em 1.9em;
				border-radius: 0 0 1em 1em;
				transition: transform .7s, top .7s;
			}

			.button-active-suggetion::after, .button-active-suggetion::before {
				content: "";
				height: 1em;
				width: .3em;
				position: absolute;
				background: var(--dark-blue);
				border-radius: 1em;
				top: .1em;
				transition: transform .7s, left .7s, right .7s;
			}

			.suggestion-list {
				display: grid;
				grid-gap: 1em;
				max-width: 37em;
				margin-inline: auto;
				grid-template-columns: 1fr 1fr 1fr;
			}

			.suggestion {
				position: relative;
				font-size: .7em;
				text-align: center;
				overflow: hidden;
				color: var(--white);
				background-color: var(--dark-blue);
				border: none;
				border-radius: 1em;
				box-shadow: -2px -2px 5px 0px #0002;
				transition: padding .7s,
							opacity ${isSuggestinEnable ? '.7s .4s' : '.2s'}, 
							font-size .5s,
							transform .3s;
			}

			.suggestion:hover {
				transform: scale(1.05);
			}

			.icon {
				position: absolute;
				right: 0em;
				top: .4em;
				height: 1.2em;
			}

			@media (width < 550px) {
				.suggestion-list {
					display: flex;
					flex-wrap: wrap;
					justify-content: center;
				}

				.suggestion {
					max-width: 15em;
				}
			}

			@media (width < 390px) {
				.button-active-suggetion::after, .button-active-suggetion::before {
					top: .05em;
				}
			}

			@media (width < 365px) {
				.button-active-suggetion::after, .button-active-suggetion::before {
					height: .7em;
					width: .2em;
				}
			}
		`}</style>

        <style jsx>{`
			.suggestion-wrapper {
				padding: ${isSuggestinEnable && suggestiosnList[0] ? '.5em 1em 1.5em' : ' .6em .5em'};
			}

			h3 {
				font-size: ${isSuggestinEnable && isChatEnabled && suggestiosnList[0] ? '1em' : '0'};
			}

			.button-active-suggetion {
				opacity: ${isChatEnabled ? '1' : '0'};
				transform: translate(-50%);
				top: ${isSuggestinEnable && suggestiosnList[0] ? 'calc(100% - 1.5em)' : '0em'};
			}

			.button-active-suggetion:hover {
				transform: translate(-50%) scale(1.1);
			}

			.button-active-suggetion::after {
				transform: ${isSuggestinEnable && suggestiosnList[0] ? 'rotate(-45deg)' : 'rotate(-55deg)'};
				left: ${isSuggestinEnable && suggestiosnList[0] ? '1.75em' : '1.45em'};
			}

			.button-active-suggetion::before {
				transform: ${isSuggestinEnable && suggestiosnList[0] ? 'rotate(45deg)' : 'rotate(55deg)'};
				right: ${isSuggestinEnable && suggestiosnList[0] ? '1.75em' : '1.45em'};
			}

			.suggestion {
				font-size: ${isSuggestinEnable && isChatEnabled && suggestiosnList[0] ? '.7em' : '0'};
				opacity: ${isSuggestinEnable && isChatEnabled && suggestiosnList[0] ? '1' : '0'};
				padding: ${isSuggestinEnable && isChatEnabled && suggestiosnList[0] ? '1.2em' : '0'};
			}

			@media (width < 365px) {
				.button-active-suggetion::after {
					left: ${isSuggestinEnable && suggestiosnList[0] ? '1.8em' : '1.56em'};
				}

				.button-active-suggetion::before {
					right: ${isSuggestinEnable && suggestiosnList[0] ? '1.8em' : '1.56em'};
				}

				.button-active-suggetion::after, .button-active-suggetion::before {
					top: ${isSuggestinEnable && suggestiosnList[0] ? '.45em' : '.15em'};
				}
			}
		`}</style>
    </div>
}

export default ChatSuggestion
