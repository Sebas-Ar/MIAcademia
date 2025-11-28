import { useMenuStore } from '@/frontend/hooks/globalState/useMenuStore'
import { useRouter } from 'next/navigation'

const FavoriteProgram = ({
    programID = '',
    programSlug = '',
    instituteSlug = '',
    programName = '',
    instituteName = '',
    prograType = '',
    urlImg = '',
    isSelected = false
}) => {
    const router = useRouter()

    const toogleMenu = useMenuStore((state) => state.toogleMenu)

    // Construir URL usando slugs si están disponibles, sino usar programID (fallback)
    const programUrl = (programSlug && instituteSlug)
        ? `/${instituteSlug}/programas/${programSlug}?id=${programID}`
        : `/programas/${programID}`

    const handleClick = (e) => {
        e.preventDefault()
        toogleMenu()
        setTimeout(() => {
            router.push(programUrl)
        }, 350)
    }
    return (
        <a onClick={handleClick} href={programUrl}>
            <article className={`favorite-program ${isSelected ? 'selected' : ''}`}>
                <img src={urlImg} alt="" loading='lazy' />
                <div className="content">
                    <h5 className="program-name">{programName}</h5>
                    <h6 className="institute-name">{instituteName}</h6>
                    <ul className="tags-list">
                        <li className="tag">
                            <span>{prograType}</span>
                        </li>
                    </ul>
                </div>
                <style jsx>{`
                    a:active {
                        background: var(--red);
                    }

                    .favorite-program {
                        background: var(--transparent-gray);
                        border-radius: .5em;
                        padding: 1em;
                        display: flex;
                        gap: 1em;
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

                    img {
                        height: 5.8em;
                        aspect-ratio: 1/1;
                        object-fit: contain;
                        border: .25em solid var(--yellow);
                        padding: .3em;
                        background: var(--white);
                        border-radius: .7em;
                    }

                    .content {
                        width: 100%;
                        display: grid;
                        grid-template-rows: auto 1fr auto;
                    }

                    .program-name {
                        font-weight: 600;
                        font-size: .9em;
                        text-transform: capitalize;
                        color: var(--yellow);
                    }

                    .institute-name {
                        font-weight: 400;
                        font-size: .8em;
                        color: var(--white);
                    }

                    .tags-list {
                        margin-top: .5em;
                        display: flex;
                        justify-content: end;
                    }

                    .tag {
                        background: var(--blue);
                        padding: .2em .5em;
                        border-radius: .5em;
                        font-weight: 600;
                        font-size: .8em;
                        color: var(--white);
                        transition: transform .3s;
                    }
                    
                `}</style>
            </article>
        </a>
    )
}

export default FavoriteProgram
