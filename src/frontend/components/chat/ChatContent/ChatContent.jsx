import ChatQuestion from './ChatQuestion'
import ChatResponse from './ChatResponse'

const ChatContent = ({
    setEnableAutoScroll,
    chat,
    responseWrapper,
    loading,
    response,
    chatID,
    setRating = () => { },
    isChatEnabled,
    isFilterActive,
    textAreaRef,
    rating = null,
    isSuggestinEnable,
    submitButtonRef,
    isResponding,
    suggestionList = [],
    activeSuggestion = () => { },
    isEnableAlert = false,
    prograamMode = false,
    setIsEnableAlert = () => { },
    isSuggestNavigators = false,
    userQuery = '',
    chatRate = null
}) => {
    const editQuery = () => {
        textAreaRef.current.value = userQuery.consulta
        textAreaRef.current.focus()
        submitButtonRef.current.disabled = false
    }

    const reloadQuery = () => {
        textAreaRef.current.value = userQuery.consulta
        submitButtonRef.current.disabled = false
        submitButtonRef.current.click()
        textAreaRef.current.value = ''
        submitButtonRef.current.disabled = true
    }

    const disableAutoScroll = () => setEnableAutoScroll(false)

    return <section className="chat">

        <article
            className="chat-content"
            ref={chat}
            onWheel={disableAutoScroll}
            onTouchMove={disableAutoScroll}
        >
            <div className="wrapper">
                <ChatQuestion
                    userQuery={userQuery}
                    isResponding={isResponding}
                    editQuery={editQuery}
                    reloadQuery={reloadQuery}
                    chatRate={chatRate}
                    chatID={chatID}
                    setRating={setRating}
                    rating={rating}
                />
                <ChatResponse
                    responseWrapper={responseWrapper}
                    loading={loading}
                    response={response}
                    chatID={chatID}
                    setRating={setRating}
                    rating={rating}
                    suggestionList={suggestionList}
                    activeSuggestion={activeSuggestion}
                    isResponding={isResponding}
                    isEnableAlert={isEnableAlert}
                    setIsEnableAlert={setIsEnableAlert}
                    isSuggestNavigators={isSuggestNavigators}
                    chatRate={chatRate}
                />
            </div>
        </article>

        <style jsx>{`
            .chat {
                background: ${isChatEnabled ? 'var(--white)' : 'var(--yellow)'};
            }
            
            .chat-content {
                padding: ${isChatEnabled ? '3.5em 1.5em 1em' : '0 2em'};
                opacity: ${isChatEnabled ? '1' : '0'};
                height: ${isChatEnabled ? 'calc(100dvh - 11.75em)' : '0'};
            }
        `}</style>

        <style jsx>{`
            .vocationl-test {
                height: 100%;
                display: grid;
                place-items: center;
            }

            .link:hover {
                transform: scale(1.05);
            }

            .chat {
                margin: 0 auto;
                width: 100%;
                overflow: hidden;
                transition: height 1s, background 1.5s;
                transition: background .5s;
            }

            .wrapper {
                max-width: 80em;
                margin: auto;
                margin-top: 1em;
            }

            .chat-content {
                overflow-y: auto;
                mask-image: linear-gradient(to top, transparent 0%, black 0%, black 100%, transparent 100%);
                transition: height 1s, background 1s, padding 1s, opacity 1s;
            }

            .chat-content::-webkit-scrollbar {
                width: .5em;
            }

            .chat-content::-webkit-scrollbar-track {
                background-color: var(--light-gray);
            }

            .chat-content::-webkit-scrollbar-thumb {
                background-color: var(--dark-blue);
                border-radius: 5px;
            }

            @supports not selector(::-webkit-scrollbar) {
                .chat-content {
                    scrollbar-color: var(--dark-blue)
                                     var(--light-gray);
                }
            }
        `}</style>
    </section>
}

export default ChatContent
