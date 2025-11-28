
const MenuIcon = ({
    isActive = true,
    color = 'var(--yellow)'
}) => {
    return (
        <div className="menu-icon">
            <div className="center-line"></div>
            <style jsx>{`
                .menu-icon {
                    width: 1.5em;
                    height: 1.5em;
                    border-radius: 50%;
                    position: relative;
                    transition: transform .3s;
                    display: grid;
                    place-items: center;
                }

                .center-line {
                    position: relative;
                    background: ${isActive ? 'unset' : color};
                    height: .2em;
                    width: 100%;
                    border-radius: 1em;
                    transition: background .3s;
                }

                .center-line::after, .center-line::before {
                    content: "";
                    height: .2em;
                    width: 100%;
                    position: absolute;
                    background: ${color};
                    border-radius: 5em;
                    transition: transform .3s, left .3s, top .3s;
                }

                .center-line::before {
                    transform: ${isActive ? 'rotate(45deg)' : 'rotate(0deg)'};
                    left: 0em;
                    top: ${isActive ? '0' : '.46em'};
                }

                .center-line::after {
                    transform: ${isActive ? 'rotate(-45deg)' : 'rotate(0deg)'};
                    left: 0em;
                    bottom: ${isActive ? '0' : '.46em'};
                }
                
            `}</style>
        </div>
    )
}

export default MenuIcon
