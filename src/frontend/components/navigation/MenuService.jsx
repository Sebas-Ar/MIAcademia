import { Link } from 'next-view-transitions'

const MenuService = ({
    name = '',
    icon = <></>,
    href = '',
    background = false,
    border = false
}) => {
    return <Link href={href}>
        <li>
            <div className="wrapper-icon">
                {icon}
            </div>
            <span className="service-name">
                {name}
            </span>
            <style jsx>{`

                li {
                    display: flex;
                    align-items: center;
                    gap: .8em;
                    border-radius: 0 .6em 0 .6em;
                    padding: .5em;
                    background: ${background ? 'var(--transparent-gray)' : 'unset'};
                    border: .15em solid var(--transparent-gray);
                    transform: scale(0.95);
                    transition: transform .3s, background .3s, color .3s;
                }

                .wrapper-icon {
                    height: 2.4em;
                    border-radius: 50%;
                    display: grid;
                    place-items: center;
                    padding: .4em;
                    border: ${border ? '.15em' : '0'} solid var(--yellow);
                    background: var(--dark-blue);
                    color: var(--white);
                }

                .service-name {
                    font-weight: 500;
                }

                li:hover {
                    transform: scale(1);
                    background: var(--yellow);
                    color: var(--dark-blue);
                }
                
            `}</style>
        </li>
    </Link>
}

export default MenuService
