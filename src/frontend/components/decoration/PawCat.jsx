const PawCat = () => {
    const hidePawCat = () => {
        const pawCat = document.querySelector('.wrapper-paw-cat')
        pawCat.style.top = '-15em'
        pawCat.style.animation = 'paw-cat-rotate .5s linear infinite'
        setTimeout(() => {
            pawCat.style.top = '-3.5em'
            pawCat.style.animation = 'none'
        }, 2000)
    }

    return (
        <div onMouseEnter={hidePawCat} onMouseDown={hidePawCat} className="wrapper-paw-cat">
            <div className="paw-cat">
                <div className="paw paw-left"></div>

                <div className="paw paw-right"></div>

                <div className="finger finger-1"></div>
                <div className="finger finger-2 finger-big"></div>
                <div className="finger finger-3 finger-big"></div>
                <div className="finger finger-4"></div>
                <div className="finger-pad finger-pad-1"></div>
                <div className="finger-pad finger-pad-2 finger-pad-big"></div>
                <div className="finger-pad finger-pad-3 finger-pad-big"></div>
                <div className="finger-pad finger-pad-4"></div>

                <div className="pad"></div>
            </div>

            <style jsx>{`
                .wrapper-paw-cat {
                    font-size: .32em;
                    position: relative;
                    position: absolute;
                    top: -3.5em;
                    left: 21em;
                    z-index: 1;
                    transition: transform .4s, top 1s;
                    transform-origin: center;
                }

                .wrapper-paw-cat:hover {
                    transform: scale(1.1);
                }

                .paw-cat {
                    transform: rotate(150deg);
                    cursor: pointer;
                    display: flex;

                }

                .paw-cat:hover {

                }

                @keyframes paw-cat-rotate {
                    0% {
                        transform: rotate(0deg);
                    }
                    25% {
                        transform: rotate(25deg);
                    }
                    75% {
                        transform: rotate(-25deg);
                    }
                    100% {
                        transform: rotate(0deg);
                    }
                }


                .paw {
                    position: relative;
                    width: 4em;
                    height: 12em;
                    background: var(--dark-gray);

                }

                .paw-left {
                    border-radius: 100% 0 0 0;
                    transform: translateX(.1em);s
                }

                .paw-right {
                    border-radius: 0 100% 0 0;
                    transform: translateX(-.1em);s
                }

                .pad {
                    position: absolute;
                    width: 1.6em;
                    height: 1.6em;
                    background: var(--gray);
                    border-radius: 50%;
                    top: 2em;
                    left: 50%;
                    transform: translateX(-50%);
                }

                .pad::before {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: var(--gray);
                    border-radius: 50%;
                    top: .9em;
                    left: 45%;
                    transform: rotate(40deg);
                }

                .pad::after {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: var(--gray);
                    border-radius: 50%;
                    top: .9em;
                    right: 45%;
                    transform: rotate(-40deg);
                }


                .finger {
                    position: absolute;
                    width: 3.8em;
                    height: 4.5em;
                    background: var(--dark-gray);
                    border-radius: 50%;
                }

                .finger-1 {
                    top: 0;
                    right: -.6em;
                    transform: rotate(44deg);
                }

                .finger-2 {
                    top: -2em;
                    right: 1em;
                    transform: rotate(34deg);
                }

                .finger-3 {
                    top: -2em;
                    left: 1em;
                    transform: rotate(-34deg);
                }

                .finger-4 {
                    top: 0;
                    left: -.6em;
                    transform: rotate(-44deg);
                }

                .finger-big {
                    width: 3.9em;
                    height: 5em;
                }


                .finger-pad {
                    content: "";
                    position: absolute;
                    width: 1.7em;
                    height: 1.4em;
                    background: var(--gray);
                    border-radius: 50%;
                }

                .finger-pad-1 {
                    top: 1.6em;
                    right: .4em;
                    transform: rotate(-45deg);
                }

                .finger-pad-2 {
                    top: -.7em;
                    right: 1.65em;
                    transform: rotate(-45deg);
                }

                .finger-pad-3 {
                    top: -.7em;
                    left: 1.65em;
                    transform: rotate(45deg);
                }

                .finger-pad-4 {
                    top: 1.6em;
                    left: .4em;
                    transform: rotate(45deg);
                }

                .finger-pad-big {
                    width: 2.1em;
                    height: 1.7em;
                }
            `}</style>
        </div>
    )
}

export default PawCat
