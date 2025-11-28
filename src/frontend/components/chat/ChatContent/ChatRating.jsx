import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { X } from 'lucide-react'
import { useState } from 'react'

const ChatRating = ({
    rating = null,
    setRating = () => { },
    chatID = '',
    isResponding = false
}) => {
    const [rate, setRate] = useState(rating)

    const rateChat = async (rate) => {
        const body = {
            rating: rate
        }

        setRating(rate)
        if (!chatID) return
        const response = await fetch('/api/mia/' + chatID, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        })

        response.json()

        triggerEvent(eventCategories.CHAT, eventNames.RATE_RESPONSE, { rate })
        setTimeout(() => setRate(true), 2000)
    }

    return <article className="rating">
        <button onClick={() => setRate(true)} className="btn-close">
            <X strokeWidth=".3em" size="1.1em" />
        </button>
        <h6 className="title">
            ¿Te ayudó esta respuesta?
        </h6>
        <p className="rating-text">
            Tu opinión nos ayuda a mejorar
        </p>
        <div className="rating-response">
            <button className='button-like' onClick={() => rateChat(true)} disabled={rating === true || rating === false}>
                <svg className='like-icon' viewBox="0 -100 512 750" fill="currentColor">
                    <path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2l144 0c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48l-97.5 0c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3l0-38.3 0-48 0-24.9c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32L0 224c0-17.7 14.3-32 32-32z"/>
                </svg>
            </button>
            <div className="line-vertical"></div>
            <button className='button-dislike' onClick={() => rateChat(false)} disabled={rating === true || rating === false}>
                <svg className='dislike-icon' viewBox="0 -120 512 680" fill="currentColor">
                    <path d="M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2l144 0c26.5 0 48-21.5 48-48c0-18.5-10.5-34.6-25.9-42.6C497 236.6 504 223.1 504 208c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48l-97.5 0c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7l0 38.3 0 48 0 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 384l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32L32 96C14.3 96 0 110.3 0 128L0 352c0 17.7 14.3 32 32 32z"/>
                </svg>
            </button>
        </div>

        {
            (rating === true || rating === false) &&
            <p className="rating-result-text">
                ¡Gracias por tu feedback!
            </p>
        }

        <style jsx>{`
            .like-icon {
                color: ${rating === true ? 'var(--blue)' : 'var(--white)'}
            }

            .dislike-icon {
                color: ${rating === false ? 'var(--red)' : 'var(--white)'}
            }
        `}</style>

        <style jsx>{`


            .rating-result-text {
                animation: appear .3s linear forwards;
            }
        
            .rating {
                z-index: 1;
                background: var(--yellow);
                border-radius: .5em;
                padding: .6em 2em;
                left: 50%;
                bottom: ${!isResponding && rate === null ? '4em' : '-15em'}; 
                position: fixed;
                display: grid;
                justify-content: center;
                gap: .5em;
                border: .15em solid var(--dark-blue);
                transform: translateX(-50%);
                transition: bottom ${rating ? '.3s 1s' : '.3s'};
                max-width: 21em;
                text-align: center;
                view-transition-name: modal-rate-chat;
            }

            .btn-close {
                position: absolute;
                right: .4em;
                top: .5em;
                display: grid;
                place-items: center;
                transition: transform .3s;
            }

            .btn-close:hover {
                transform: scale(1.2);
            }

            .title {
                font-weight: 600;
            }

            .rating-text, .rating-result-text {
                font-weight: 400;
                color: var(--dark-blue);
            }

            .rating-response {
                justify-self: center;
                display: grid;
                grid-template-columns: auto auto auto;
                align-items: center;
            }

            .rating-response button {
                padding: 0 1em;
            }

            .line-vertical {
                height: 70%;
                align-self: center;
                width: 3px;
                border-radius: 1em;
                background: var(--dark-blue);
            }

            .like-icon, .dislike-icon {
                width: 1.5em;
                transition: color .3s, transform .3s;
            }

            .button-like:hover .like-icon,
            .button-dislike:hover .dislike-icon {
                transform: scale(1.2);
            }

            .button-like:hover .like-icon {
                color: var(--blue);
            }

            .button-dislike:hover .dislike-icon {
                color: var(--red);
            }

            @keyframes appear {
                0% {
                    opacity: 0;
                    font-size: 0;
                }

                100% {
                    opacity: 1;
                    font-size: 1em;
                }
            }
        `}</style>

    </article>
}

export default ChatRating
