import { useMenuStore } from '@/frontend/hooks/globalState/useMenuStore'
import { getTimeAgo } from '@/frontend/utils/time'
import { History } from 'lucide-react'
import { useTransitionRouter } from 'next-view-transitions'

const QueryHistory = ({
    chatID = '',
    query = '',
    date = '',
    isSelected = false
}) => {
    const router = useTransitionRouter()

    const toogleMenu = useMenuStore((state) => state.toogleMenu)

    const handleClick = (e) => {
        e.preventDefault()
        toogleMenu()
        setTimeout(() => {
            router.push(`/chats/${chatID}`)
        }, 350)
    }
    return (
        <a onClick={handleClick} href={`/chats/${chatID}`}>
            <article className={`query-history ${isSelected ? 'selected' : ''}`}>
                <div className="icon">
                    <History strokeWidth=".15em" size="1.5em" />
                </div>
                <div className="query">
                    <h6>{query}</h6>
                    <p>{getTimeAgo(date?.replace('Z', '-05:00'))}</p>
                </div>
            </article>

            <style jsx>{`
                .query-history {
                    background: var(--transparent-gray);
                    border-radius: .5em;
                    padding: .6em 1em;
                    display: grid;
                    gap: .5em;
                    grid-template-columns: auto 1fr;
                    transition: border .2s, padding .2s;
                    border: .1em solid var(--transparent-gray);
                    transition: transform .3s;
                    transform: scale(.97);

                    &:hover {
                        transform: scale(1);
                        border-color: var(--yellow);
                    }
                }


                .selected {
                    border: .1em solid var(--yellow);
                    transform: scale(1);
                }

                .icon {
                    color: var(--gray);
                    padding: .2em;
                    border-radius: 0 .5em .5em 0;
                    display: grid;
                    place-items: center;
                    padding-right: .5em;
                }

                .query {
                }

                h6 {
                    font-weight: 600;
                    font-size: .9em;
                    text-transform: capitalize;
                    color: var(--yellow);
                }

                p {
                    font-weight: 400;
                    font-size: .8em;
                    color: var(--gray);
                }
            `}</style>

        </a>

    )
}

export default QueryHistory
