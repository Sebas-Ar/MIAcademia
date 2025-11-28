import { School, XIcon } from 'lucide-react'
import { Marker } from 'react-map-gl/mapbox'

const ProgramMapMarker = ({
    marker = {},
    index = 0,
    markerSelected = -1,
    setMarkerSelected = () => { }
}) => {
    const selectMarker = () => {
        setMarkerSelected((current) => {
            if (current === index) return -1
            return index
        })
    }

    const deselectMarker = () => {
        setMarkerSelected(-1)
    }

    return <Marker key={index} longitude={marker.location.longitude} latitude={marker.location.latitude}>
        <button onMouseLeave={deselectMarker} onClick={selectMarker} style={{ animationDelay: `${index * 2}s` }}>
            <div className="popup">
                <p>{marker.displayName.text}</p>
                <br />
                <p>{marker.formattedAddress}</p>
                <div className="wrapper-icon">
                    <XIcon strokeWidth=".3em" size="1.2em" />
                </div>
            </div>
            <School strokeWidth=".2em" size="75%" />
        </button>
        <style jsx>{`

            button {
                background: var(--yellow);
                display: grid;
                place-items: center;
                width: 3em;
                height: 3em;
                border-radius: 50%;
                border: .2em solid var(--dark-blue);
                animation: pulse 4s forwards ease-in-out;
                position: relative;
                opacity: ${(markerSelected === index || markerSelected === -1) ? '1' : '0'};
                font-size: ${(markerSelected === index || markerSelected === -1) ? '1em' : '0'};
                transition: opacity .3s, font-size .3s;

                .popup {
                    position: absolute;
                    bottom: calc(100% + .8em);
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--yellow);
                    border: .2em solid var(--dark-blue);
                    padding: 1em 1.5em;
                    border-radius: .5em;
                    font-size: ${markerSelected === index ? '1em' : '0'};
                    width: 20em;
                    transition: font-size .3s;

                    p {
                        font-weight: 600;
                    }

                    .wrapper-icon {
                        position: absolute;
                        right: .35em;
                        top: .4em;
                    }
                }

                .popup::before {
                    content: "";
                    position: absolute;
                    width: 0px;
                    height: 0px;
                    border-style: solid;
                    border-width: .7em .7em .7em 0;
                    transform: translateX(-50%) rotate(-90deg);
                    border-color: transparent var(--yellow) transparent transparent;
                    bottom: 100%;
                    top: calc(100% + -.4em);
                    left: 50%;
                    filter: drop-shadow(-.15em 0 0 var(--dark-blue));
                }
            }

            button:hover {
                transform: scale(1.1);
                transition: transform .3s;
                animation: none;
            }

            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                5% {
                    transform: scale(.9);
                }
                10% {
                    transform: scale(1.1);
                }
                15% {
                    transform: scale(.9);
                }
                20% {
                    transform: scale(1.1);
                }
                25% {
                    transform: scale(.9);
                }
                30% {
                    transform: scale(1);
                }
                100% {
                    transform: scale(1);
                }
            }

        `}</style>
    </Marker>
}

export default ProgramMapMarker
