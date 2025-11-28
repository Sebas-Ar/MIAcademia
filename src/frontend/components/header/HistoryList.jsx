import { useHistoryStore } from '@/frontend/hooks/globalState/useHistoryStore'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import QueryHistory from './QueryHistory'
import Skeleton from './Skeleton'

const HistoryList = ({
    isMenuActive = false,
    anonimousUserID = '',
    userEmail = '',
    optionNumber = 0,
    optionSelected = 0
}) => {
    const fetchHistory = useHistoryStore((state) => state.fetchHistory)
    const historyList = useHistoryStore((state) => state.historyList)
    const isLoadingHistory = useHistoryStore((state) => state.isLoadingHistory)

    const [page, setPage] = useState(10)

    const nextPage = () => {
        setPage(current => current + 10)
    }

    const { chatID } = useParams()

    useEffect(() => {
        fetchHistory({ userEmail, anonimousUserID })
    }, [anonimousUserID, userEmail])

    return (
        <ul className="history-list">
            <div className="wrapper-list">
                {
                    historyList?.length > 0
                        ? historyList.slice(0, page).map(chat => (
                            <li key={chat._id}>
                                <QueryHistory
                                    chatID={chat._id}
                                    query={chat?.userQuery?.consulta}
                                    date={chat.date}
                                    isSelected={chatID === chat._id}
                                />
                            </li>
                        ))
                        : isLoadingHistory
                            ? <Skeleton />
                            : <span className="alert-message">Realiza una consulta para verla aquí</span>
                }
                {
                    historyList?.length > 10 && page < historyList?.length &&
                    <button onClick={nextPage} className="btn-load-more">
                        ver más
                    </button>
                }
            </div>

            <style jsx>{`

                .history-list {
                    overflow: auto;
                    width: ${isMenuActive && optionNumber === optionSelected ? '100%' : '0'};
                    height: ${isMenuActive && optionNumber === optionSelected ? '100%' : '0'};
                    transition: width .3s;
                    justify-self: end;
                }

                .alert-message {
                    color: var(--gray);
                    display: block;
                    text-align: center;
                    height: 100%;
                    margin-left: 1em;
                    display: grid;
                    place-items: center;
                }

                .wrapper-list {
                    padding-right: 1em;
                    display: grid;
                    gap: .5em;

                    .btn-load-more {
                        color: var(--yellow);
                        text-decoration: underline;
                        font-weight: 600;
                        letter-spacing: .03em;
                        cursor: pointer;
                        margin: 1em auto;
                        transition: transform .3s;

                        &:hover {
                            transform: scale(1.1);
                        }
                    }
                }

                .history-list::-webkit-scrollbar {
                    width: .4em;
                }

                .history-list::-webkit-scrollbar-track {
                    background-color: unset;
                }

                .history-list::-webkit-scrollbar-thumb {
                    background-color: var(--yellow);
                    border-radius: 5px;
                }

                @supports not selector(::-webkit-scrollbar) {
                    .history-list {
                        scrollbar-color: var(--yellow)
                                        unset;
                    }
                }
            `}</style>
        </ul>
    )
}

export default HistoryList
