'use client'

import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'

import { useHistoryStore } from '@/frontend/hooks/globalState/useHistoryStore'
import { useTransitionRouter } from 'next-view-transitions'
import { useParams, usePathname } from 'next/navigation'
import CouselingBtnLink from './CouselingBtnLink'
import MIABtnLink from './MIABtnLink'
import VocationalBtnLink from './VocationalBtnLink'

const AsideMenu = ({
    hideMIA = false,
    hideCouseling = false,
    hideTestVocacional = false
}) => {
    const pathName = usePathname()
    const router = useTransitionRouter()
    const lastChatID = useHistoryStore((state) => state.lastChatID)
    const { chatID } = useParams()

    const onClickLink = (e, { target, isActive }) => {
        e.preventDefault()
        triggerEvent(eventCategories.GENERAL_INTERACTIONS, eventNames.NAVIGATION, {
            to: target,
            from: pathName,
            type: 'navigation-aside'
        })
        router.push(target)
    }

    // El link está activo si su prop hide es true (significa que estamos en esa página)
    const isMIAActive = hideMIA
    const isCouselingActive = hideCouseling
    const isVocationalActive = hideTestVocacional

    const getLogoHref = () => {
        // Si hay un último chat y es diferente al actual, ir al último chat
        if (lastChatID && chatID !== lastChatID) {
            return `/chats/${lastChatID}?lastChat=enable`
        }

        // De lo contrario, ir a la página principal
        return '/'
    }

    return (
        <aside>
            <nav>
                <ul>
                    <li>
                        <a
                            href={lastChatID ? '/chats/' + lastChatID + '?lastChat=enable' : '/'}
                            onClick={(e) => onClickLink(e, {
                                target: getLogoHref(),
                                isActive: isMIAActive
                            })}
                            className={isMIAActive ? 'active' : ''}
                            aria-current={isMIAActive ? 'page' : undefined}
                        >
                            <MIABtnLink />
                        </a>
                    </li>
                    <li>
                        <a
                            href="/asesoria-vocacional"
                            onClick={(e) => onClickLink(e, {
                                target: '/asesoria-vocacional',
                                isActive: isCouselingActive
                            })}
                            className={isCouselingActive ? 'active' : ''}
                            aria-current={isCouselingActive ? 'page' : undefined}
                        >
                            <CouselingBtnLink />
                        </a>
                    </li>
                    <li>
                        <a
                            href="/test-vocacional"
                            onClick={(e) => onClickLink(e, {
                                target: '/test-vocacional',
                                isActive: isVocationalActive
                            })}
                            className={isVocationalActive ? 'active' : ''}
                            aria-current={isVocationalActive ? 'page' : undefined}
                        >
                            <VocationalBtnLink />
                        </a>
                    </li>
                </ul>
            </nav>

            <style jsx>{`
                aside {
                    position: fixed;
                    z-index: 1111;
                    bottom: 3.5em;
                    right: 1em;
                    border-radius: 3em;
                    padding-right: 0;
                    transition: right .3s;
                    view-transition-name: aside-nav-right;
                }

                ul {
                    display: grid;
                    gap: .8em;
                }

                li {
                }

                a {
                    display: block;
                    transition: opacity 0.2s, transform 0.2s;
                }

                a::hover {
                    transform: scale(1.05);
                    cursor: pointer;
                }

                a::active {
                    transform: scale(0.95);
                }
            `}</style>
        </aside>
    )
}

export default AsideMenu
