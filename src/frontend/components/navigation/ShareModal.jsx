import { useNavigationStore } from '@/frontend/hooks/globalState/useNavigationStore'
import { useCurrentURL } from '@/frontend/hooks/useCurrentURL'
import { LinkIcon, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookMessengerIcon, FacebookMessengerShareButton, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TelegramIcon, TelegramShareButton, ThreadsIcon, ThreadsShareButton, TwitterShareButton, WhatsappIcon, WhatsappShareButton, XIcon } from 'react-share'
import { toast } from 'sonner'
import Line from '../decoration/Line'

const ShareModal = ({
    title = 'chat'
}) => {
    const toogleShareModal = useNavigationStore((state) => state.toogleShareModal)
    const isShareModalEnable = useNavigationStore((state) => state.isShareModalEnable)

    const fullUrl = useCurrentURL()

    const close = useRef(null)

    // this is a hack to close the modal when it is open on refresh
    useEffect(() => {
        if (isShareModalEnable && !close.current) {
            toogleShareModal()
            close.current = true
        } else {
            close.current = true
        }
    }, [isShareModalEnable])

    const copyLinkToClipboard = () => {
        const currentUrl = window.location.href
        if (!navigator?.clipboard?.writeText) {
            return toast('Tu navegador no soporta la función de copiar el link')
        }
        navigator?.clipboard?.writeText(currentUrl)
            .then(() => {
                toast('Link del programa copiado')
            })
            .catch((err) => {
                console.error('Error al copiar la URL:', err)
            })
    }

    return <div className="page">
        <div className="background" onClick={toogleShareModal}></div>
        <div className="filter-wrapper">
            <button type='button' className="btn-close" onClick={toogleShareModal}>
                <X strokeWidth=".2em" />
            </button>
            <h3>Compartir {title}</h3>
            <p className='description'>¡No te lo guardes! Compártelo con quien creas que le puede interesar</p>
            <ul>
                <li onClick={toogleShareModal}>
                    <WhatsappShareButton
                        title='MIAcademia'
                        url={fullUrl}
                        separator=':: '
                    >
                        <WhatsappIcon
                            iconFillColor='var(--dark-blue)'
                            bgStyle={{ fill: 'var(--yellow)' }}
                            round
                            size="3em"
                        />
                        <p className="label">Whatsapp</p>
                    </WhatsappShareButton>

                </li>
                <li onClick={toogleShareModal}>
                    <FacebookShareButton
                        url={fullUrl}
                        quote="MIAcademia"
                        hashtag="#MIAcademia"
                    >
                        <FacebookIcon
                            iconFillColor='var(--dark-blue)'
                            bgStyle={{ fill: 'var(--yellow)' }}
                            round
                            size="3em"
                        />
                        <p className="label">Facebook</p>
                    </FacebookShareButton>
                </li>
                <li onClick={toogleShareModal}>
                    <LinkedinShareButton
                        url={fullUrl}
                        title="MIAcademia"
                        summary="MIAcademia"
                    >
                        <LinkedinIcon
                            iconFillColor='var(--dark-blue)'
                            bgStyle={{ fill: 'var(--yellow)' }}
                            round
                            size="3em"
                        />
                        <p className="label">Linkedin</p>
                    </LinkedinShareButton>

                </li>
                <li onClick={toogleShareModal}>
                    <TwitterShareButton
                        url={fullUrl}
                        title="MIAcademia"
                        via="miacademia"
                        hashtags={['MIAcademia']}
                    >
                        <XIcon
                            iconFillColor='var(--dark-blue)'
                            bgStyle={{ fill: 'var(--yellow)' }}
                            round
                            size="3em"
                        />
                        <p className="label">Twitter</p>
                    </TwitterShareButton>
                </li>
                <li onClick={toogleShareModal}>
                    <FacebookMessengerShareButton
                        url={fullUrl}
                        appId="1234567890"
                    >
                        <FacebookMessengerIcon
                            iconFillColor='var(--dark-blue)'
                            bgStyle={{ fill: 'var(--yellow)' }}
                            round
                            size="3em"
                        />
                        <p className="label">Messenger</p>
                    </FacebookMessengerShareButton>
                </li>
                <li onClick={toogleShareModal}>
                    <TelegramShareButton
                        url={fullUrl}
                        title="MIAcademia"
                    >
                        <TelegramIcon
                            iconFillColor='var(--dark-blue)'
                            bgStyle={{ fill: 'var(--yellow)' }}
                            round
                            size="3em"
                        />
                        <p className="label">Telegram</p>
                    </TelegramShareButton>
                </li>
                <li onClick={toogleShareModal}>
                    <EmailShareButton
                        url={fullUrl}
                        subject="MIAcademia"
                        body="MIAcademia"
                    >
                        <EmailIcon
                            iconFillColor='var(--dark-blue)'
                            bgStyle={{ fill: 'var(--yellow)' }}
                            round
                            size="3em"
                        />
                        <p className="label">Email</p>
                    </EmailShareButton>
                </li>
                <li onClick={toogleShareModal}>
                    <ThreadsShareButton
                        url={fullUrl}
                        title="MIAcademia"
                    >
                        <ThreadsIcon
                            iconFillColor='var(--dark-blue)'
                            bgStyle={{ fill: 'var(--yellow)' }}
                            round
                            size="3em"
                        />
                        <p className="label">Threads</p>
                    </ThreadsShareButton>
                </li>
                <li onClick={toogleShareModal}>
                    <button onClick={copyLinkToClipboard} className="link-icon-wrapper">
                        <div className="icon">
                            <LinkIcon
                                height="75%"
                                strokeWidth=".22em"
                            />
                        </div>
                        <p className="label">Copiar <br /> enlace</p>
                    </button>
                </li>
            </ul>
            <Line fixLine />
        </div>

        <style jsx>{`
            .page {
                height: 100dvh;
                width: 100vw;
                position: fixed;
                top: 0;
                display: grid;
                justify-content: center;
                align-items: end;
                padding: 2em;
                padding-bottom: 0;
                z-index: 11111111111;
                background: var(--transparent-dark-gray);
            }

            .background {
                height: 100%;
                width: 100%;
                position: absolute;
            }

            .filter-wrapper {
                background-color: var(--dark-blue);
                padding: 1.5em 1.5em 1em;
                width: 100%;
                border-radius: 1em 1em 0 0;
                border: .125em solid var(--white);
                border-bottom: none;
                color: var(--white);
                display: grid;
                gap: 1em;
                position: relative;
                transition: top .3s;
                max-width: 31em;
            }

            .btn-close {
                position: absolute;
                top: 1em;
                right: 1em;
                color: var(--yellow);
                display: grid;
                place-items: center;
                padding: .1em;
                cursor: pointer;
                transition: transform .3s;

                &:hover {
                    transform: scale(1.1);
                }
            }

            h3 {
                text-align: center;
                font-weight: 700;
                text-transform: uppercase;
                font-size: 1.2em;
            }

            .description {
                font-size: 1em;
                text-align: center;
                margin: auto;
                margin-bottom: 1em;
                max-width: 26em;
                padding: 0 1em;
            }

            ul {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 1em;
                justify-content: center;
                justify-self: center;
                padding: 0 2em;
            }

            li {
                transition: transform .3s;
            }

            li:hover {
                transform: scale(1.1);
            }

            .link-icon-wrapper {
                border-radius: 50%;
                display: grid;
                gap: .4em;
                place-items: center;
                color: var(--white);
                cursor: pointer;
            }

            .icon {
                background: var(--yellow);
                color: var(--dark-blue);
                height: 3em;
                width: 3em;
                border-radius: 50%;
                display: grid;
                place-items: center;
            }

            .label {
                font-size: .8em;
                text-transform: uppercase;
                font-weight: 500;
                text-align: center;
            }

        `}</style>

        {/* animations */}
        <style jsx>{`
            .page {
                opacity: ${isShareModalEnable ? '1' : '0'};
                left: ${isShareModalEnable ? '0' : '100%'};
                transition: left ${isShareModalEnable ? '0s 0s' : '0s .3s'},
                            opacity .3s;
            }

            .filter-wrapper {
                top: ${isShareModalEnable ? '0%' : '100%'};
            }
        `}</style>

    </div>
}

export default ShareModal
