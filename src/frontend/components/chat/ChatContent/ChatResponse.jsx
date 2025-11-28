import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import ChatMessageAlert from './ChatMessageAlert'
import ChatRating from './ChatRating'
import ChatSuggestion from './ChatSuggestion'
import NavigatorsSuggestion from './NavigatorsSuggestion'

const ChatResponse = ({
    responseWrapper,
    loading,
    response,
    chatID,
    setRating,
    rating = null,
    suggestionList = [],
    activeSuggestion = () => {},
    isResponding = false,
    isEnableAlert = false,
    setIsEnableAlert = () => { },
    isSuggestNavigators = false,
    chatRate = null
}) => {
    return (
        <div className="response" ref={responseWrapper}>
            <div className="chat-photo-wrapper">
                <img className="chat-photo" src="/img/logo/logo.svg" alt="logo de MIAcademia" />
                <NavigatorsSuggestion isSuggestNavigators={isSuggestNavigators} />
            </div>
            {loading &&
                <span className="loading-request"></span>
            }
            {
                !response && !loading &&
                <p className="text-mia-default-text">
                    ¡Estoy lista para ayudarte a explorar programas académicos!
                    <br />
                    ¿Qué necesitas saber hoy?
                </p>
            }
            <div className="markdown">
                <Markdown rehypePlugins={[rehypeRaw]}>
                    {response}
                </Markdown>
                {response && !isResponding &&
                    <ChatSuggestion
                        suggestiosnList={suggestionList.chatResponse}
                        activeSuggestion={activeSuggestion}
                    />

                }
            </div>
            {isResponding && !loading &&
                <span className="loading-response"></span>
            }
            {response &&
                <div className="wrapper-options-response">
                    <ChatRating
                        chatID={chatID}
                        rating={rating}
                        setRating={setRating}
                        isResponding={isResponding}
                        chatRate={chatRate}
                    />
                </div>
            }
            <ChatMessageAlert isEnableAlert={isEnableAlert} setIsEnableAlert={setIsEnableAlert}/>
            <style jsx>{`
                .response {
                    padding: 0em;
                    padding-right: 0;
                    border-radius: 12px;
                    box-shadow: 0 0px 20px rgba(255, 255, 255, 0.1);
                    position: relative;
                    align-self: flex-start;
                    transition: box-shadow .3s;
                    min-height: 4em;
                }

                .chat-photo-wrapper {
                    position: absolute;
                    top: .3em;
                    left: 0em;
                }

                .chat-photo {
                    height: 2em;
                }

                .text-mia-default-text {
                    margin-left: 2.5em;
                    padding: .3em;
                    transform: translateY(-.5em)
                }
                
                .loading-request {
                    left: 4em;
                    top: 1.2em;
                    transform: translateY(-50%);
                    width: .5em;
                    height: .5em;
                    border-radius: 50%;
                    background-color: var(--dark-blue);
                    box-shadow: 2em 0 var(--dark-blue), -2em 0 var(--dark-blue);
                    position: absolute;
                    animation: flash1 0.5s ease-out infinite alternate;
                }

                .loading-response {
                    display: block;
                    margin: 2em auto;
                    width: .7em;
                    height: .7em;
                    border-radius: 50%;
                    background-color: var(--dark-blue);
                    box-shadow: 2em 0 var(--dark-blue), -2em 0 var(--dark-blue);
                    animation: flash2 0.5s infinite alternate linear;
                }

                .wrapper-options-response {
                    display: grid;
                    justify-content: center;
                    margin: 1.5em;
                    margin-bottom: .5em;
                }

                @keyframes flash1 {
                    0% {
                        background-color: var(--transparent-dark-blue);
                        box-shadow: 1.2em 0 var(--transparent-dark-blue), -1.2em 0 var(--dark-blue);
                    }

                    50% {
                        background-color: var(--dark-blue);
                        box-shadow: 1.2em 0 var(--transparent-dark-blue), -1.2em 0 var(--transparent-dark-blue);
                    }

                    100% {
                        background-color: var(--transparent-dark-blue);
                        box-shadow: 1.2em 0 var(--dark-blue), -1.2em 0 var(--transparent-dark-blue);
                    }
                }

                @keyframes flash2 {
                    0% {
                        background-color: var(--transparent-dark-blue);
                        box-shadow: 1.6em -1em 0 var(--transparent-dark-blue), -1.6em 1em 0 var(--dark-blue);
                    }

                    50% {
                        background-color: var(--dark-blue);
                        box-shadow: 1.6em 0 var(--transparent-dark-blue), -1.6em 0 var(--transparent-dark-blue);
                    }

                    100% {
                        background-color: var(--transparent-dark-blue);
                        box-shadow: 1.6em 1em 0 var(--dark-blue), -1.6em -1em 0 var(--transparent-dark-blue);
                    }
                }

            `}</style>
        </div>
    )
}

export default ChatResponse
