import { uniqueValues } from '@/utils/uniquesValues'
import { X } from 'lucide-react'
import SelectFilter from './SelectFilter'

const ModalChatFilters = ({
    filterEnables,
    isFilterActive = false,
    toogleFilter = () => { },
    programTypeRef = null,
    modalityRef = null,
    sectorRef = null,
    cleanFilter = () => {}
}) => {
    return <div className="page">
        <div className="background" onClick={toogleFilter}></div>
        <div className="filter-wrapper">
            <button type='button' className="btn-close" onClick={toogleFilter}>
                <X strokeWidth=".2em" />
            </button>
            <h3>Filtros</h3>
            <p>Mejora tu consulta con los siguientes filtros opcionales</p>
            <div className="wrapper-selects">

                <SelectFilter
                    name="programType"
                    placeholder="Tipo de Programa"
                    defaultValueName="Todos los programas"
                    optionList={uniqueValues.programType}
                    isActive={filterEnables.programType}
                    selectRef={programTypeRef}
                />
                {/* <SelectFilter
                    placeholder="Tipo de Institución"
                    name="academicType"
                    optionList={uniqueValues.academicType}
                    isActive={filterEnables.academicType}
                    disabled
                    /> */}
                <SelectFilter
                    name="modality"
                    placeholder="Modalidad"
                    defaultValueName="Todas las modalidades"
                    optionList={uniqueValues.modality}
                    isActive={filterEnables.modality}
                    selectRef={modalityRef}
                />
                <SelectFilter
                    name="sector"
                    placeholder="Sector"
                    defaultValueName="Todos los sectores"
                    optionList={uniqueValues.sector}
                    isActive={filterEnables.sector}
                    selectRef={sectorRef}
                />
            </div>
            <button
                type="button"
                className="btn-clean-filters"
                onClick={cleanFilter}
                disabled={!filterEnables.filterActive}
            >
                    Limpiar filtros
            </button>
        </div>

        <style jsx>{`
            .page {
                height: 100dvh;
                width: 100vw;
                position: fixed;
                top: 0;
                display: grid;
                justify-content: center;
                align-items: end;
                padding: 2em;
                padding-bottom: 0;
                z-index: 1;
            }

            .background {
                height: 100%;
                width: 100%;
                position: absolute;
            }

            .filter-wrapper {
                background-color: var(--dark-blue);
                padding: 1.5em 1.5em 1em;
                width: 100%;
                max-width: 37em;
                border-radius: 1em 1em 0 0;
                border: .125em solid var(--white);
                border-bottom: none;
                color: var(--white);
                display: grid;
                gap: 1em;
                position: relative;
                transition: top .3s;
            }

            .btn-close {
                position: absolute;
                top: 1em;
                right: 1em;
                color: var(--yellow);
                display: grid;
                place-items: center;
                padding: .1em;
                cursor: pointer;
                transition: transform .3s;

                &:hover {
                    transform: scale(1.1);
                }
            }


            .wrapper-selects {
                display: grid;
                gap: 1.8em;
            }

            h3 {
                text-align: center;
                font-weight: 700;
                text-transform: uppercase;
                font-size: 1.2em;
            }

            p {
                font-size: 1em;
                text-align: center;
                margin: auto;
                margin-bottom: 1em;
                max-width: 26em;
                padding: 0 1em;
            }

            .btn-clean-filters {
                margin-top: .5em;
                color: var(--yellow);
                text-decoration: underline;
                font-weight: 600;
                letter-spacing: .03em;

                &:disabled {
                    opacity: .5;
                    color: var(--yellow);
                    cursor: auto;
                }
            }

        `}</style>

        {/* animations */}
        <style jsx>{`
            .page {
                left: ${isFilterActive ? '0' : '100%'};
                transition: left ${isFilterActive ? '0s 0s' : '0s .3s'};
            }

            .filter-wrapper {
                top: ${isFilterActive ? '-2.3em' : '100%'};
            }
        `}</style>

    </div>
}

export default ModalChatFilters
