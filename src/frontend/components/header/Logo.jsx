import { useHistoryStore } from '@/frontend/hooks/globalState/useHistoryStore'
import { useIdentifyUser } from '@/frontend/hooks/useIdentifyUser'
import { Link } from 'next-view-transitions'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

const Logo = ({
    hideName = false,
    isChatEnabled = false,
    programMode = false,
    mColor = 'var(--white)',
    isMIAMessageActive = false
}) => {
    const { anonimousUserID, userEmail } = useIdentifyUser()

    const { chatID } = useParams()

    const fetchLastChat = useHistoryStore((state) => state.fetchLastChat)
    const lastChatID = useHistoryStore((state) => state.lastChatID)
    const isLoadingLastChat = useHistoryStore((state) => state.isLoadingLastChat)

    useEffect(() => {
        fetchLastChat({ userEmail, anonimousUserID })
    }, [anonimousUserID, userEmail, lastChatID])

    // Determinar la URL de destino
    const getLogoHref = () => {
        if (isLoadingLastChat) return '#'

        // Si hay un último chat y es diferente al actual, ir al último chat
        if (lastChatID && chatID !== lastChatID) {
            return `/chats/${lastChatID}?lastChat=enable`
        }

        // De lo contrario, ir a la página principal
        return '/'
    }

    const logoHref = getLogoHref()
    const isNavigable = !isLoadingLastChat

    return (
        <div className="mia">

            <Link
                href={logoHref}
                className="logo-link"
                aria-label={lastChatID && chatID !== lastChatID
                    ? 'Volver al último chat'
                    : 'Ir a la página principal de MIA'
                }
                title={lastChatID && chatID !== lastChatID
                    ? 'Volver a tu último chat'
                    : 'Página principal - MIA'
                }
                onClick={(e) => {
                    if (!isNavigable) {
                        e.preventDefault()
                    }
                }}
            >
                {
                    !hideName &&
					<h1><span className="m">M </span>I A</h1>
                }
                <img
                    className="logo"
                    src="/img/logo/logo.svg"
                    alt="MIA - Asistente de Inteligencia Artificial para orientación vocacional"
                    width={isChatEnabled || programMode ? 48 : 118}
                    height={isChatEnabled || programMode ? 48 : 118}
                    loading="eager"
                />
            </Link>
            {/* {
                isMIAMessageActive &&
				<MessageMIA />

            } */}

            <style jsx>{`
                .mia {
					position: relative;
					left: 50%;
					transition:  width 1s, left 1s, margin 1s, transform 1s;
					z-index: 1
				}

				.logo {
					cursor: pointer;
					transition: filter .3s, transform .3s, height 1s, margin 1s, width 1s, opacity .3s;
					view-transition-name: logo;
					display: block;
				}

				.logo:hover, h1:hover ~ :global(.logo-link) .logo {
					transform: scale(1.05)
				}

				h1 {
					position: absolute;
					margin-top: -.40em;
					white-space: nowrap;
					font-weight: 700;
					text-align: center;
					cursor: pointer;
					view-transition-name: MIA-title;
				}

				.m {
					color: ${mColor};
					transition: color 1s;
				}

				@keyframes animated-text {
					from{
						border-right: solid 3px var(--black);
					}

					98% {
						border-right: 3px solid var(--black);
					}

					to {
						visibility: 3px solid transparent;
					}
				}

				@keyframes animated-text2 {
					from{
						width: 0;
					}

					to {
						width: 10.5em;
					}
				}

				@keyframes height {
					0% {
						height: 0;
						padding-bottom: 0;
					}

					100% {
						height: 1.4em;
					}
				}

				@keyframes ocultar {
					0% {
						opacity: 0;
					}

					5% {
						opacity: 1;
					}

					95% {
						opacity: 1;
					}

					100% {
						opacity: 0;
					}
				}

				@keyframes blink-caret {
					from, to { border-color: transparent }
					50% { border-color: var(--dark-blue) }
				}
            `}</style>

            <style jsx>{`
                .mia {
					transform: translate(${!hideName && !programMode && isChatEnabled ? '-140%' : !isChatEnabled && programMode ? 'calc(-50% - 4px) ' : 'calc(-50%)'});
					margin-bottom: ${(isChatEnabled || programMode) ? '0' : '2.5em'};
					width: ${isChatEnabled || programMode ? '2.8em' : '8.3em'};
				}

				.logo {
					height: ${isChatEnabled || programMode ? '3em' : '9em'};
					filter: drop-shadow(${isChatEnabled || programMode ? '-3px 3px' : '-5px 5px'} ${isChatEnabled || programMode ? '3px' : '8px'} #0005);
				}

				.logo:hover, h1:hover ~ :global(.logo-link) .logo {
					filter: drop-shadow(${isChatEnabled || programMode ? '-3px 3px' : '-5px 5px'} ${isChatEnabled || programMode ? '3px' : '8px'} #0008);
				}

				.logo.loading:hover {
					transform: none;
					filter: drop-shadow(${isChatEnabled || programMode ? '-3px 3px' : '-5px 5px'} ${isChatEnabled || programMode ? '3px' : '8px'} #0005);
				}

				h1 {
					font-size: ${isChatEnabled || programMode ? '2.5em' : '3.3em'};
					letter-spacing: ${isChatEnabled || programMode ? '-.1em' : '0'};
					left: ${isChatEnabled || programMode ? '110%' : '50%'};
					top: ${isChatEnabled || programMode ? '56%' : '100%'};
					transform: translate(${isChatEnabled || programMode ? '0%, -30%' : '-50%'});
					transition: left ${isChatEnabled || programMode ? '' : '.25s'} .5s linear, top ${isChatEnabled || programMode ? '.25s' : ''} .5s linear, transform .5s linear, font-size 1s, letter-spacing 1s;
				}
			`}</style>

        </div>
    )
}

export default Logo
