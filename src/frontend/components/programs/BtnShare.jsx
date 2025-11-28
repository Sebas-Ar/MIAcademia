import { useNavigationStore } from '@/frontend/hooks/globalState/useNavigationStore'
import { Share2 } from 'lucide-react'

const BtnShare = () => {
    const toogleShareModal = useNavigationStore((state) => state.toogleShareModal)

    return (
        <div onClick={toogleShareModal}>
            <Share2 height="60%" width="60%" strokeWidth=".19em" fill='white'/>

            <style jsx>{`
                div {
                    z-index: 1;
                    border: .17em solid var(--yellow);
                    color: var(--yellow);
                    border-radius: 50%;
                    height: 3em;
                    width: 3em; 
                    display: grid;
                    place-items: center;
                    background: var(--white);
                    transition: transform .3s, background .3s, color .3s, fill .3s;
                    cursor: pointer;
                }

                div:hover {
                    transform:  scale(1.15);
                }

            `}</style>
        </div>
    )
}

export default BtnShare
