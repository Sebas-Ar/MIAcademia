import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { useState } from 'react'
import { FlagBtn, flagsList } from './FlagsList'

const SelectCountry = () => {
    const [isExpanded, setisExpanded] = useState('false')
    // state countrySelected
    const [countrySelected, setCountrySelected] = useState('COL')

    const toogleExpanded = () => {
        setisExpanded(currentValue => currentValue === 'true' ? 'false' : 'true')
    }

    const selectCountry = (country) => {
        triggerEvent(eventCategories.CHAT, eventNames.SELECT_COUNTRY, { country })
        setCountrySelected(country)
        toogleExpanded()
    }

    return <div className="container" data-testid="rfs">
        <label>
            Pais de busqueda
        </label>
        <button
            id="country-btn"
            onClick={toogleExpanded}
            aria-expanded={isExpanded}
            aria-labelledby="rfs-btn"
            aria-haspopup="listbox"
            data-testid="rfs-btn"
        >
            <span>
                {
                    flagsList.filter(flag => flag.country === countrySelected)[0].svg
                }
            </span>
        </button>
        <div className="wrapper-flags-list">
            <ul role="listbox" tabIndex="-1">
                {
                    flagsList.map((flag, index) => (
                        <FlagBtn key={flag.country} country={flag.country} selectCountry={selectCountry} disabled={flag.disabled} last={flag.last}>
                            {flag.svg}
                        </FlagBtn>
                    ))
                }

            </ul>
        </div>

        <style jsx>{`
            .container {
                z-index: 1;
                position: relative;
                animation: appear .3s .1s ease-in-out forwards;
                justify-self: start;
            }

            label {
                white-space: nowrap;
                color: var(--white);
                position: absolute;
                left: calc(100% + .7em);
                top: 50%;
                transform: translateY(-54%);
                align-items: center;
                gap: .5em;
                font-weight: 600;
                font-size: .8em;
                letter-spacing: .05em;
            }

            button {
                background-color: var(--dark-blue);
                border-radius: .5em;
                border: .15em solid var(--dark-gray);
                padding: .5em .7em;
                display: flex;
                align-items: center;
                gap: .5em;
            }

            span {
                height: .8em;
                width: 1em;
                display: grid;
                place-items: center;
            }

            button::after {
                content: " ";
                width: 0;
                height: 0;
                display: inline-block;
                margin-left: .3em;
                border-top: .34em solid var(--white);
                border-left: .34em solid transparent;
                border-right: .34em solid transparent;
                border-bottom: 0;
            }

            button[aria-expanded="true"]::after {
                border-top: 0;
                border-bottom: .34em solid var(--white);
            }

            .wrapper-flags-list {
                padding-top: .3em;
                position: absolute;
                bottom: calc(100% + .5em);
                left: 50%;
                transform: translateX(-50%);
            }

            ul {
                background: var(--dark-blue);
                border-radius: .5em;
                justify-content: center;
                padding: .5em .5em;
                max-height: 20em;
                overflow-y: auto;
                border: .15em solid var(--dark-gray);
                display: ${isExpanded === 'true' ? 'grid' : 'none'};
            }

            ul::-webkit-scrollbar {
                width: 0em;
            }

            ul::-webkit-scrollbar-track {
                background-color: var(--light-gray);
            }

            ul::-webkit-scrollbar-thumb {
                background-color: var(--dark-blue);
                border-radius: 5px;
            }

            @supports not selector(::-webkit-scrollbar) {
                ul {
                    scrollbar-color: var(--dark-blue)
                                    var(--light-gray);
                }
            }
        `}</style>
    </div>
}

export default SelectCountry
