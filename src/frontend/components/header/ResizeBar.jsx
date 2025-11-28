
const ResizeBar = ({
    isMenuActive = false,
    asideRef = null,
    asideSize = 0,
    setAsideSize = () => { }
}) => {
    return (
        <div className="resize" onMouseDown={e => setAsideSize(e.clientX)} onMouseUp={e => setAsideSize(0)}>

            <style jsx>{`
                .resize {
                    position: absolute;
                    top: 0;
                    left: 100%;
                    width: .1em;
                    height: 100%;
                    background: ${isMenuActive ? 'var(--yellow)' : 'transparent'};
                    z-index: 11111;
                }
            `}</style>
        </div>
    )
}

export default ResizeBar
