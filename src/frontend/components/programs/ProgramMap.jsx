import { getLocationsListService } from '@/frontend/services/programs'
import { formatLocation } from '@/frontend/utils/formatProgramData'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useRef, useState } from 'react'
import Map from 'react-map-gl/mapbox'
import ProgramMapMarker from './ProgramMapMarker'

const ProgramMap = ({ program, onLocationAvailable }) => {
    const [markerSelected, setMarkerSelected] = useState(-1)
    const [instituteLocationsList, setInstituteLocationsList] = useState(null)
    const [initialPosition, setInitialPosition] = useState(null)
    const [isVisible, setIsVisible] = useState(false)
    const mapContainerRef = useRef(null)

    // Intersection Observer para detectar cuando el componente es visible
    useEffect(() => {
        if (!mapContainerRef.current) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect() // Dejar de observar después de cargar
                }
            },
            {
                rootMargin: '100px' // Cargar el mapa 100px antes de que sea visible
            }
        )

        observer.observe(mapContainerRef.current)

        return () => observer.disconnect()
    }, [])

    // Cargar datos del mapa solo cuando sea visible
    useEffect(() => {
        if (!isVisible) return

        if (!program?.location) {
            onLocationAvailable?.(false)
            return
        }
        const [dep, mun] = program.location.split(' - ')
        const getLocationsList = async () => {
            try {
                const { locationsList, errorGetLocationsList } = await getLocationsListService({
                    instituteName: program.instituteName, dep, mun
                })

                // Si hay error del servicio
                if (errorGetLocationsList) {
                    onLocationAvailable?.(false)
                    return
                }

                // Validar si hay ubicaciones disponibles
                if (!locationsList || locationsList.length === 0) {
                    onLocationAvailable?.(false)
                    return
                }

                // Validar si la primera ubicación tiene coordenadas válidas
                if (!locationsList[0]?.location?.longitude || !locationsList[0]?.location?.latitude) {
                    onLocationAvailable?.(false)
                    return
                }

                setInstituteLocationsList(locationsList)
                setInitialPosition({
                    longitude: locationsList[0].location.longitude,
                    latitude: locationsList[0].location.latitude
                })
                onLocationAvailable?.(true)
            } catch (error) {
                console.error(error)
                onLocationAvailable?.(false)
            }
        }
        getLocationsList()
    }, [isVisible, program?.location, program?.instituteName])

    return (
        <div className="map-wrapper" ref={mapContainerRef}>
            <h4>
                <span>
                    <div className="decoration-left"></div>
                    {formatLocation(program?.location)}
                    <div className="decoration-right"></div>
                </span>
            </h4>
            {
                initialPosition &&
                    <Map
                        // https://visgl.github.io/react-map-gl/docs/get-started/mapbox-tokens
                        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                        initialViewState={{
                            ...initialPosition,
                            zoom: 10
                        }}
                        style={{ width: '100%', height: 400, borderRadius: '1em', border: '.3em solid var(--yellow)' }}
                        mapStyle="mapbox://styles/sebas-ar/cmbq8ea1700po01s2ewgjctzm"
                    >
                        {
                            instituteLocationsList?.map((marker, index) => (
                                <ProgramMapMarker
                                    key={index}
                                    marker={marker}
                                    index={index}
                                    markerSelected={markerSelected}
                                    setMarkerSelected={setMarkerSelected}
                                />
                            ))
                        }
                    </Map>
            }
            <style jsx>{`

                .map-wrapper {
                    width: 100%;
                    max-width: 65em;
                }

                h4 {
                    text-align: center;
                    margin: auto;
                    font-weight: 700;
                    display: grid;
                    place-items: center;


                    span {
                        display: grid;
                        place-items: center;
                        background: var(--yellow);
                        padding: .5em 2em;
                        border-radius: 1em 1em 0 0;
                        text-transform: capitalize;
                        position: relative;

                        .decoration-left {
                            position: absolute;
                            height: 100%;
                            aspect-ratio: 1;
                            background: var(--yellow);
                            right: 100%;
                        }

                        .decoration-left::before {
                            content: "";
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            bottom: 0;
                            right: 0;
                            background: var(--light-blue);
                            border-bottom-right-radius: 1em;
                        }

                        .decoration-right {
                            position: absolute;
                            height: 100%;
                            aspect-ratio: 1;
                            background: var(--yellow);
                            left: 100%;
                        }

                        .decoration-right::before {
                            content: "";
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            bottom: 0;
                            left: 0;
                            background: var(--light-blue);
                            border-bottom-left-radius: 1em;
                        }
                    }
                }
            `}</style>
        </div>

    )
}

export default ProgramMap
