import { useNavigationStore } from '@/frontend/hooks/globalState/useNavigationStore'

const UpcomingFeatures = ({
    label = '',
    modal = null

}) => {
    const toogleUpcomingFeaturesModal = useNavigationStore((state) => state.toogleUpcomingFeaturesModal)
    const setUpcomingFeaturesModalName = useNavigationStore((state) => state.setUpcomingFeaturesModalName)
    const upconimgFeatureName = useNavigationStore((state) => state.upconimgFeatureName)

    const onClick = (e) => {
        e.preventDefault()
        setUpcomingFeaturesModalName(label)
        if (modal) {
            toogleUpcomingFeaturesModal()
        }
    }

    return (
        <button onClick={onClick}>
            {label}
            <style jsx>{`
                button {
                    width: 100%;
                    text-align: center;
                    border: .2em solid var(--white);
                    border-radius: 2em;
                    display: block;
                    padding: .2em .8em;
                    text-transform: uppercase;
                    font-weight: 600;
                    font-size: .8em;
                    background: ${upconimgFeatureName === label ? 'var(--yellow)' : 'var(--white)'};
                    color: ${upconimgFeatureName === label ? 'var(--dark-blue)' : 'var(--yellow)'};
                    transition: background .3s, color .3s, transform .3s;
                    box-shadow: 0 0 0 .1em var(--yellow);
                    cursor: pointer;
                }

                button:hover {
                    background: var(--yellow);
                    color: var(--dark-blue);
                    transform: scale(1.05);
                }
            `}</style>
        </button>
    )
}

export default UpcomingFeatures
