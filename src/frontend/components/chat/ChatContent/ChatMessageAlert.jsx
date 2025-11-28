import { Hourglass, X } from 'lucide-react'
import { useEffect } from 'react'

const ChatMessageAlert = ({
    isEnableAlert = false,
    setIsEnableAlert = () => { }
}) => {
    const disableAlert = () => {
        setIsEnableAlert(false)
    }

    useEffect(() => {
        let timer
        if (isEnableAlert) {
            timer = setTimeout(() => {
                disableAlert()
            }, 5000)
        }

        return () => clearTimeout(timer)
    }, [isEnableAlert])

    return <div className="message-alert">
        <button onClick={disableAlert} className="btn-close">
            <X height="1.3em" />
        </button>
        <div className="icon">
            <Hourglass height="1.3em" />
        </div>
        <p>
            Espera que MIA termine de escribir para acceder a los programas
        </p>
        <style jsx>{`
            .message-alert {
                position: fixed;
                top: 50%;
                right: ${isEnableAlert ? '1em' : '-15em'};
                background-color: var(--yellow);
                border-radius: .5em;
                padding: 1em 1em;
                font-weight: 600;
                transition: transform .3s;
                transform: translateY(-50%);
                width: 15em;
                text-align: center;
                border: .15em solid var(--dark-blue);
                transition: right .3s;
            }

            .icon {
                background: red;
                display: grid;
                margin: auto;
                height: 2.2em;
                width: 2.2em;
                border-radius: 50%;
                display: grid;
                place-items: center;
                background-color: var(--dark-blue);
                color: var(--yellow);
                margin-bottom: .5em;
            }

            .btn-close {
                position: absolute;
                right: .5em;
                top: .5em;
                transition: transform .3s;
            }

            .btn-close:hover {
                transform: scale(1.05);
            }
        `}</style>
    </div>
}

export default ChatMessageAlert
