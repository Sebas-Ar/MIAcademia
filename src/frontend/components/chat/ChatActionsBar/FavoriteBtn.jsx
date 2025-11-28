import { useFavoritesStore } from '@/frontend/hooks/globalState/useFavoriteStore'
import { useMenuStore } from '@/frontend/hooks/globalState/useMenuStore'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const FavoriteBtn = ({
    programID = '',
    userEmail = '',
    anonimousUserID = ''
}) => {
    const addFavoriteToUser = useFavoritesStore((state) => state.addFavoriteToUser)
    const userFavoritesList = useFavoritesStore((state) => state.userFavoritesList)
    const deleteFavoriteToUser = useFavoritesStore((state) => state.deleteFavoriteToUser)

    const isMenuActive = useMenuStore((state) => state.isMenuActive)
    const toogleMenu = useMenuStore((state) => state.toogleMenu)
    const selectOpion = useMenuStore((state) => state.selectOpion)

    const [isFavorite, setIsFavorite] = useState(false)
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false)

    useEffect(() => {
        const isFavorite = userFavoritesList.find(favorite => String(favorite.programID) === programID)
        setIsFavorite(isFavorite)
    }, [userFavoritesList])

    const addFavorite = async () => {
        setIsFavoriteLoading(true)
        !isMenuActive && toogleMenu()
        selectOpion(0)
        if (anonimousUserID) {
            setIsFavoriteLoading(false)
            return
        }

        toast.promise(addFavoriteToUser({ userEmail, programID }), {
            loading: 'Guardando',
            success: ({ program }) => <p>
                Añadido a tus favoritos:
                <br />
                {program.programName}
            </p>,
            error: 'Error al guardar'
        })
        setIsFavoriteLoading(false)
    }

    const removeFavorite = async () => {
        setIsFavoriteLoading(true)
        toast.promise(deleteFavoriteToUser({
            userEmail,
            program: {
                programID
            }
        }), {
            loading: 'Eliminando',
            success: 'Favorito eliminado',
            error: 'Error al eliminar'
        })
        setIsFavoriteLoading(false)
    }

    useEffect(() => {
        const isFavorite = userFavoritesList.find(favorite => String(favorite.programID) === programID)
        setIsFavorite(isFavorite)
    }, [userFavoritesList])

    return (
        <label onClick={isFavorite ? removeFavorite : addFavorite}>
            <Star height="65%" width="65%" strokeWidth=".15em" fill='inherit' />

            <style jsx>{`
                label {
                    z-index: 1;
                    border: .17em solid var(--yellow);
                    color: var(--yellow);
                    border-radius: 50%;
                    height: 3em;
                    width: 3em;
                    display: grid;
                    place-items: center;
                    background: var(--white);
                    fill: ${isFavorite ? 'var(--yellow)' : 'var(--white)'};
                    transition: transform .3s, background .3s, color .3s, fill .3s;
                    cursor: pointer;
                    animation: ${isFavoriteLoading ? 'spin 1s linear infinite' : 'none'};
                }

                label:hover {
                    transform:  scale(1.15);
                }

                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </label>
    )
}

export default FavoriteBtn
