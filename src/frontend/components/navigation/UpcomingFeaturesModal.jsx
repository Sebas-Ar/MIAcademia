import { useNavigationStore } from '@/frontend/hooks/globalState/useNavigationStore'
import { X } from 'lucide-react'
import WorkingInIt from '../posters/WorkingInIt'

const UpcomingFeaturesModal = () => {
    const toogleUpcomingFeaturesModal = useNavigationStore((state) => state.toogleUpcomingFeaturesModal)
    const isUpcomingFeaturesModalEnable = useNavigationStore((state) => state.isUpcomingFeaturesModalEnable)
    const upconimgFeatureName = useNavigationStore((state) => state.upconimgFeatureName)
    const setUpcomingFeaturesModalName = useNavigationStore((state) => state.setUpcomingFeaturesModalName)
    const toogleisMoreOptionsFeaturesEnable = useNavigationStore((state) => state.toogleisMoreOptionsFeaturesEnable)

    const close = () => {
        toogleUpcomingFeaturesModal()
        setTimeout(() => {
            setUpcomingFeaturesModalName('programas')
            toogleisMoreOptionsFeaturesEnable()
        }, 300)
    }

    return upconimgFeatureName && (
        <div className="wrapper">
            <div className="background" onClick={close}></div>
            <div className="wrapper-content">
                <button className="close-btn" type="button" onClick={close}>
                    <X size="1.4em" strokeWidth=".2em" />
                </button>
                <WorkingInIt
                    title={upconimgFeatureName}
                />
            </div>

            <style jsx>{`
                .wrapper {
                    height: 100dvh;
                    width: 100vw;
                    position: fixed;
                    top: 0;
                    left: ${isUpcomingFeaturesModalEnable ? '0' : '-100%'};
                    display: grid;
                    place-items: center;
                    padding: 2em;
                    z-index: 11111111111;
                    view-transition-name: modal-upcoming-features;
                    opacity: ${isUpcomingFeaturesModalEnable ? '1' : '0'};
                    transition: 0s left ${isUpcomingFeaturesModalEnable ? '0s' : '.3s'},
                                opacity .3s;
                }

                .background {
                    height: 100%;
                    width: 100%;
                    background: var(--transparent-dark-gray);
                    position: absolute;
                    z-index: -1;
                }

                .wrapper-content {
                    background-color: var(--dark-blue);
                    padding: 2.4em;
                    width: 100%;
                    max-width: 40em;
                    border-radius: 1em;
                    overflow: hidden;
                    border: .125em solid var(--yellow);
                    display: grid;
                    justify-items: center;
                    gap: 1em;
                    position: relative;
                    color: white;
                }

                .wrapper-content::-webkit-scrollbar {
                    width: 2em;
                }


                .gap {
                    gap: .8em;
                }

                .close-btn {
                    position: absolute;
                    top: 1em;
                    right: 1em;
                    color: var(--yellow);
                    transition: transform .3s;
                    display: grid;
                    place-items: center;
                }

                h3 {
                    font-size: 1.1em;
                    color: var(--yellow);
                    text-align: center;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                p {
                    color: var(--yellow);
                    font-size: 1em;
                    text-align: center;
                    font-weight: 300;
                    margin-bottom: .7em;
                }

                nav {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2em;
                    color: var(--white);
                }

                .call-action-text {
                    color: var(--dark-gray);
                    font-size: 1em;
                }

                .close-btn:hover {
                    transform: scale(1.1);
                }

                @media (width < 500px) {
                    nav {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>

    )
}

export default UpcomingFeaturesModal
