import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { useEffect, useRef, useState } from 'react'

const SliderWrapper = ({ slidersList = [] }) => {
    const animationSpeed = 7 // seconds
    const [slideSelected, setSlideSelected] = useState(0)
    const [touchStartX, setTouchStartX] = useState(0)
    const [touchEndX, setTouchEndX] = useState(0)

    // refTimer is used to clear the timeout
    const refTimer = useRef(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            setSlideSelected(1)
        }, animationSpeed * 350)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setSlideSelected(current => {
                if (current < slidersList.length - 1) {
                    return current + 1
                } else {
                    return 0 // Reiniciar al primer slide cuando se llegue al final
                }
            })
        }, animationSpeed * 1000)

        refTimer.current = timer

        return () => clearTimeout(timer)
    }, [slideSelected])

    useEffect(() => {
        if (touchStartX > touchEndX) {
            setSlideSelected(current => {
                if (current < slidersList.length - 1) {
                    clearTimeout(refTimer.current)
                    return current + 1
                }
                return current
            })
        } else {
            setSlideSelected(current => {
                if (current > 0) {
                    clearTimeout(refTimer.current)
                    return current - 1
                }
                return current
            })
        }
    }, [touchEndX])

    const goToSlide = (slideIndex) => {
        triggerEvent(eventCategories.CHAT, eventNames.CHANGE_BANNER_VIEW, { slideIndex })
        clearTimeout(refTimer.current)
        setSlideSelected(slideIndex)
    }

    return (
        <div className="wrapper">
            {
                slidersList[slideSelected].title === 'Test Vocacional' &&
                    <h2>{slidersList[slideSelected].title}</h2>
            }
            {
                slidersList[slideSelected].title === 'Asesoría Vocacional' &&
                    <h2>{slidersList[slideSelected].title}</h2>
            }
            <ul onTouchStart={e => setTouchStartX(e.targetTouches[0].clientX)} onTouchEnd={e => setTouchEndX(e.changedTouches[0].clientX)}>
                {
                    slidersList.map(slider => slider.component)
                }
            </ul>
            <div className="btns-wrapper">
                {
                    slidersList.map((slide, index) => (
                        <button
                            key={slide.title}
                            className={`${slideSelected === index ? 'selected' : ''}`}
                            title={`Ir al slide ${index + 1}`}
                            onClick={() => goToSlide(index)}
                        >
                        </button>
                    ))
                }
            </div>

            <style jsx>{`
                h2 {
                    width: 100vw;
                    text-align: center;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 1.2em;
                    animation: opacity-enable ${animationSpeed}s ease-in-out forwards;
                }

                .wrapper {
                    overflow: hidden;
                    height: 100%;
                    width: 100vw;
                    display: grid;
                    grid-template-rows: 1fr auto;
                    align-items: end;
                    padding: 5.5em 0em 1.5em; 
                    gap: .5em;
                    position: relative;
                    z-index: 11111;
                }

                ul {
                    width: ${slidersList.length * 100}vw;
                    display: grid;
                    grid-template-columns: repeat(${slidersList.length}, 1fr);
                    justify-content: center;
                    position: relative;
                    left: -${slideSelected * 100}vw;
                    transition: left .5s ease-in-out;
                }

                .btns-wrapper {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: 0em;
                    display: flex;
                    gap: .8em;
                    padding-bottom: .3em;
                }

                button {
                    background: var(--light-gray);
                    border: .15em solid var(--dark-blue);
                    color: var(--white);
                    border-radius: .5em;
                    transition: transform .3s;
                    height: .8em;
                    width: .8em;

                    &:hover {
                        transform: scale(1.1);
                    }

                    &.selected {
                        background: var(--dark-blue);
                    }
                }
                
                @keyframes opacity-enable {
                    0% {
                        opacity: 0;
                    }

                    10% {
                        opacity: 0;
                    }

                    15% {
                        opacity: 1;
                    }

                    95% {
                        opacity: 1;
                    }

                    100% {
                        opacity: 0;
                    }
                }

            `}</style>
        </div>
    )
}

export default SliderWrapper
