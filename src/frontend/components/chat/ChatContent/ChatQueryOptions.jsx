import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { useNavigationStore } from '@/frontend/hooks/globalState/useNavigationStore'
import { Pencil, RefreshCw, Share2, ThumbsDown, ThumbsUp } from 'lucide-react'

const ChatQueryOptions = ({
    reloadQuery = () => { },
    editQuery = () => { },
    isResponding = false,
    chatRate = null,
    chatID = '',
    setRating = () => { },
    rating = null
}) => {
    console.log({ chatRate })
    const toogleShareModal = useNavigationStore((state) => state.toogleShareModal)

    const likeChat = async () => {
        const response = await fetch('/api/mia/' + chatID, {
            method: 'PATCH',
            body: JSON.stringify({
                rating: true
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        setRating(true)

        await response.json()

        triggerEvent(eventCategories.CHAT, eventNames.RATE_RESPONSE, { rate: true })
    }

    const dislikeChat = async () => {
        console.log('first')
        const response = await fetch('/api/mia/' + chatID, {
            method: 'PATCH',
            body: JSON.stringify({
                rating: false
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        setRating(false)

        await response.json()

        triggerEvent(eventCategories.CHAT, eventNames.RATE_RESPONSE, { rate: false })
    }

    return (
        <div className="wrapper-options">
            <button onClick={reloadQuery} type="submit" disabled={isResponding} title="Repetir Consulta">
                <RefreshCw height="100%" width="100%" strokeWidth=".17em" />
            </button>
            <button onClick={editQuery} type="button" disabled={isResponding} title="Editar Consulta">
                <Pencil height="100%" width="100%" strokeWidth=".17em" />
            </button>
            <button onClick={likeChat} className='btn-like' disabled={isResponding} title="Me gusta esta respuesta">
                <ThumbsUp height="100%" width="100%" strokeWidth=".17em" fill="inherit" />
            </button>
            <button onClick={dislikeChat} className='btn-dislike' disabled={isResponding} title="No me gusta esta respuesta">
                <ThumbsDown height="100%" width="100%" strokeWidth=".17em" fill="inherit" />
            </button>
            <button onClick={toogleShareModal} type="button" disabled={isResponding} title="Compartir">
                <Share2 height="100%" width="100%" strokeWidth=".17em" />
            </button>

            <style jsx>{`

                .wrapper-options {
                    display: flex;
                    gap: .8em;
                    height: 2.3em;
                    padding-top: .5em;
                    border-top: .15em solid var(--white);
                    justify-content: start;
                    margin-bottom: .3em;
                }

                .btn-like {
                    fill: ${rating === true ? 'var(--blue)' : 'transparent'};
                }


                .btn-like:hover {
                    fill: transparent;
                }
                
                .btn-like:focus {
                    animation: scale-btn .3s linear forwards;
                }

                @keyframes scale-btn {
                    0% {
                        transform: scale(1)
                    }

                    15% {
                        transform: scale(1.2)
                    }

                    50% {
                        transform: scale(1)
                    }

                    85% {
                        transform: scale(1.2)
                    }

                    100% {
                        transform: scale(1)
                    }
                }

                .btn-dislike {
                    fill: ${rating === false ? 'var(--red)' : 'transparent'}
                }

                .btn-dislike:hover {
                    fill: transparent;
                }

                .btn-dislike:focus {
                    animation: scale-btn .3s linear forwards;
                }

                button {
                    padding: .25em;
                    display: grid;
                    place-items: center;
                    border-radius: .4em;
                    transition: background .3s;
                    height: 100%;
                    position: relative;
                    color: var(--dark-blue);
                }

                button::after {
                    content: '';
                    position: absolute;
                    top: calc(100% + .1em);
                    left: 0;
                    width: 100%;
                    height: .16em;
                    border-radius: 2em;
                    background: var(--dark-blue); 
                    transition: background .3s;
                }

                button:hover {
                    background: var(--dark-blue);
                    color: var(--yellow);
                }

                button:disabled, button:disabled::after {
                    opacity: .5;
                }

                button:disabled:hover {
                    cursor: auto;
                }
                
            `}</style>
        </div>
    )
}

export default ChatQueryOptions
