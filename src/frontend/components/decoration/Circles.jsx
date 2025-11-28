
const Circles = ({
    hideCircles = true,
    ciclesColor = 'var(--white)'
}) => {
    return <>
        <div className="wrapper wrapper-circles-1">
            <div className="bola bola1"></div>
            <div className="bola bola2"></div>
            <div className="bola bola3"></div>
            <div className="bola bola4"></div>
            <div className="bola bola5"></div>
            <div className="bola bola6"></div>
        </div>

        <div className="wrapper wrapper-circles-2">
            <div className="bola bola1"></div>
            <div className="bola bola2"></div>
        </div>

        <div className="wrapper wrapper-circles-3">
            <div className="bola bola1"></div>
            <div className="bola bola2"></div>
            <div className="bola bola3"></div>
            <div className="bola bola4"></div>
        </div>

        <style jsx>{`
            .wrapper-circles-1 {
                right: ${hideCircles ? '-20em' : '-1em'};
            }

            .wrapper-circles-2 {
                right: ${hideCircles ? '-20em' : '-1em'};
            }

            .wrapper-circles-3 {
                left: ${hideCircles ? '-20em' : '-4.5em'};
            }
        `}</style>

        <style jsx>{`

            .wrapper {
                position: fixed;
                animation: move 10s infinite alternate;
            }

            
            .wrapper-circles-1 {
                top: 10%;
                height: 8.5em;
                width: 6.8em;
                transition: right 1s ease-in-out;
                animation-delay: .2s;
                view-transition-name: circles-decorations-1;
            }

            .bola {
                position: absolute;
                background: ${ciclesColor};
                border-radius: 50%;
            }

            .bola:nth-child(1n + 2) {
                animation: scale-move 8s infinite alternate;
            }

            .bola:nth-child(2n + 1) {
                animation: scale-move 8s 1s infinite alternate;
            }

            .wrapper-circles-1 .bola1 {
                height: 6em;
                width: 6em;
                bottom: 0;
                right: 0;
            }

            .wrapper-circles-1 .bola2 {
                height: 2em;
                width: 2em;
                left: 40%;
                top: 0;
            }
            
            .wrapper-circles-1 .bola3 {
                height: 2em;
                width: 2em;
                left: 0;
                top: 35%;
            }

            .wrapper-circles-1 .bola4 {
                height: .8em;
                width: .8em;
                left: 1.7em;
                top: 1.7em;
            }

            .wrapper-circles-1 .bola5 {
                height: .7em;
                width: .7em;
                left: .5em;
                top: 2em;
            }    

            .wrapper-circles-2 {
                bottom: calc(46px - 1em);
                height: 15em;
                width: 10em;
                transition: right 1s ease-in-out;
                animation-delay: .4s;
                view-transition-name: circles-decorations-2;
            }

            .wrapper-circles-2 .bola1 {
                height: 10em;
                width: 10em;
                bottom: 0;
                right: 0;
            }

            .wrapper-circles-2 .bola2 {
                height: 7.5em;
                width: 7.5em;
                right: 0;
                top: 0;
            }

            .wrapper-circles-3 {
                bottom: 20%;
                height: 12em;
                width: 10.5em;
                transition: left 1s ease-in-out;
                view-transition-name: circles-decorations-3;
            }

            .wrapper-circles-3 .bola1 {
                height: 10em;
                width: 10em;
                bottom: 0;
                left: 0;
            }

            .wrapper-circles-3 .bola2 {
                height: 2em;
                width: 2em;
                right: 2em;
                top: 0;
            }

            .wrapper-circles-3 .bola3 {
                height: 2em;
                width: 2em;
                right: 0;
                top: 35%;
            }

            .wrapper-circles-3 .bola4 {
                height: 1.5em;
                width: 1.5em;
                right: 0;
                top: 10%;
            }

            .bola1 {
                animation-delay: .1s;
            }

            .bola2 {
                animation-delay: .2s;
            }

            .bola3 {
                animation-delay: .3s;
            }

            .bola4 {
                animation-delay: .4s;
            }
            
            .bola5 {
                animation-delay: .5s;
            }

            .bola6 {
                animation-delay: .6s;
            }

            @keyframes move {
                0% {
                    transform: translate(0, 0);
                }
                25% {
                    transform: translate(-.2em, .1em);
                }
                50% {
                    transform: translate(-.1em, -.1em);
                }
                75% {
                    transform: translate(.1em, -.3em);
                }
                100% {
                    transform: translate(-.1em, 0);
                }
            }

            @keyframes scale-move {
                0% {
                    transform: scale(1) translate(0, 0);
                }
                25% {
                    transform: scale(1.05) translate(-.2em, .1em);
                }
                50% {
                    transform: scale(1.07) translate(-.1em, -.1em);
                }
                75% {
                    transform: scale(1.03) translate(.1em, -.3em);
                }
                100% {
                    transform: scale(0.92) translate(-.1em, 0);
                }
            }
        `}</style>

    </>
}

export default Circles
