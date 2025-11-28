import { useMenuStore } from '@/frontend/hooks/globalState/useMenuStore'
import { History, Star } from 'lucide-react'

const BtnWrapper = ({
    closeNav = () => { }
}) => {
    const isMenuActive = useMenuStore((state) => state.isMenuActive)
    const selectOpion = useMenuStore((state) => state.selectOpion)
    const toogleMenu = useMenuStore((state) => state.toogleMenu)

    const openHistory = () => {
        closeNav()
        if (!isMenuActive) toogleMenu()
        selectOpion(1)
    }

    const openFavorites = () => {
        closeNav()
        if (!isMenuActive) toogleMenu()
        selectOpion(0)
    }

    return (
        <div className="btn-wrapper">
            <button onClick={openFavorites}>
                <div className="wrapper-icon">
                    <Star size="1.4em" strokeWidth=".16em" />
                </div>
                <span>
                    Favoritos
                </span>
            </button>
            <button onClick={openHistory}>
                <div className="wrapper-icon">
                    <History size="1.4em" strokeWidth=".16em" />
                </div>
                <span>
                    historial
                </span>
            </button>
            <style jsx>{`
                .btn-wrapper {
                    display: flex;
                    margin-bottom: 1em;
                    justify-content: space-between;
                    padding-left: 1em;
                }

                .wrapper-icon {
                    display: grid;
                    place-items: center;
                }

                button {
                    font-size: .9em;
                    border: .1em solid var(--yellow);
                    background: var(--dark-blue);
                    color: var(--white);
                    padding: .5em 1.5em;
                    border-radius: 3em;
                    font-weight: 500;
                    transition: transform .3s;
                    display: flex;
                    align-items: center;
                    gap: .7em;
                    transform: scale(0.95);
                    transition: color .3s, background .3s, transform .3s;
                }

                button:hover {
                    color: var(--dark-blue);
                    background: var(--yellow);
                    transform: scale(1);
                }
            `}</style>
        </div>
    )
}

export default BtnWrapper
