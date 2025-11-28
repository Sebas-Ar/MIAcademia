import { useFavoritesStore } from '@/frontend/hooks/globalState/useFavoriteStore'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoginGoogle from '../login/LoginGoogle'
import FavoriteProgram from './FavoriteProgram'
import Skeleton from './Skeleton'

const FavoriteList = ({
    isMenuActive = false,
    userEmail = '',
    optionNumber = 0,
    optionSelected = 0
}) => {
    const fetchFavorites = useFavoritesStore((state) => state.fetchFavorites)
    const userFavoritesList = useFavoritesStore((state) => state.userFavoritesList)
    const isLoading = useFavoritesStore((state) => state.isLoading)

    const [page, setPage] = useState(10)

    const nextPage = () => {
        setPage(current => current + 10)
    }

    const { programID } = useParams()

    useEffect(() => {
        fetchFavorites({ userEmail })
    }, [userEmail])

    return (
        <ul className="favorite-list">
            <div className="wrapper-list">
                {
                    isLoading
                        ? <Skeleton />
                        : !userEmail
                            ? <div className="wrapper-alert">
                                <LoginGoogle />
                                <span className="alert-message">
                                    Inicia sesión para poder guardar tus programas como favoritos
                                </span>
                            </div>
                            : userFavoritesList?.length > 0
                                ? userFavoritesList.slice(0, page).map((program, index) => (
                                    <li key={program.programID + index}>
                                        <FavoriteProgram
                                            programID={program.programID}
                                            programSlug={program.programSlug}
                                            instituteSlug={program.instituteSlug}
                                            programName={program.programName}
                                            instituteName={program.instituteName}
                                            prograType={program.programType}
                                            urlImg={program.urlImg}
                                            isSelected={programID === String(program.programID)}
                                        />
                                    </li>
                                ))
                                : <div className="wrapper-alert">
                                    <span className="alert-message">
                                        No tienes programas favoritos guardados.
                                    </span>
                                </div>
                }
                {
                    userFavoritesList?.length > 10 && page < userFavoritesList?.length &&
                    <button onClick={nextPage} className="btn-load-more">
                        ver más
                    </button>
                }
            </div>

            <style jsx>{`
                .favorite-list {
                    overflow-y: auto;
                    width: ${isMenuActive && optionNumber === optionSelected ? '100%' : '0'};
                    height: ${isMenuActive && optionNumber === optionSelected ? '100%' : '0'};
                    transition: width .3s;
                    justify-self: start;
                }

                .wrapper-alert {
                    display: grid;
                    gap: 1em;
                    justify-items: center;
                    align-items: end;

                    .alert-message {
                        margin-top: .5em;
                        color: var(--gray);
                        display: block;
                        text-align: center;
                        height: 100%;
                        margin-left: 1em;
                        line-height: 1.8em;
                    }
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

                .favorite-list::-webkit-scrollbar {
                    width: .4em;
                }

                .favorite-list::-webkit-scrollbar-track {
                    background-color: unset;
                }

                .favorite-list::-webkit-scrollbar-thumb {
                    background-color: var(--yellow);
                    border-radius: 5px;
                }

                @supports not selector(::-webkit-scrollbar) {
                    .favorite-list {
                        scrollbar-color: var(--yellow)
                                        unset;
                    }
                }
            `}</style>
        </ul>
    )
}

export default FavoriteList
