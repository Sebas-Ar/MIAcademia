import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { ChartNoAxesCombined, ChevronDown, ExternalLink, Eye, HandHeart, NotebookPen, Palette, ShieldCheck } from 'lucide-react'
import { useRef, useState } from 'react'

const ResultPercentualScore = ({
    minPercentage = 0,
    maxPercentage = 100,
    category = '',
    percentualScore = {},
    index = 0,
    interpretationProfile = '',
    strengthsDescription = '',
    testID = '',
    recommendedProgramList = {}
}) => {
    const [isTextExpanded, setIsTextExpanded] = useState(index === 0)
    const [programType, setProgramType] = useState('universitario')

    const selectProgramType = (e) => {
        triggerEvent(eventCategories.TEST_VOCACIONAL, eventNames.CHANGE_PROGRAM_TYPE_RECOMMENDED, {
            programType: e.target.value
        })
        setProgramType(e.target.value)
    }

    const getOpacity = () => {
        console.log('se ejecuta getOpacity')
        const minOpacity = 0.4
        const maxOpacity = 1.0

        if (maxPercentage === minPercentage) {
            console.warn('maxPercentage === minPercentage, devolviendo opacidad máxima')
            return maxOpacity
        }

        const normalized = (percentualScore - minPercentage) / (maxPercentage - minPercentage)
        const opacity = minOpacity + normalized * (maxOpacity - minOpacity)
        const clamped = Math.max(minOpacity, Math.min(maxOpacity, opacity))

        return clamped
    }

    const opacity = useRef(getOpacity())

    const onClick = async ({ program }) => {
        triggerEvent(eventCategories.TEST_VOCACIONAL, eventNames.SELECT_PROGRAM_RECOMMENDED, {
            program: program,
            programType: programType
        })

        const response = await fetch(`/api/vocational-test/${testID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                programName: program
            })
        })

        if (!response.ok) {
            console.log(response)
        }
    }

    return (
        <li
            onClick={() => !isTextExpanded && setIsTextExpanded(current => !current)}
            className="container"
        >
            <div className="name">
                <button onClick={() => isTextExpanded && setIsTextExpanded(current => !current)}>
                    <span className="title-btn">
                        Ver análisis del perfil
                    </span>
                    <div className="wrapper-icon">
                        <div className="icon">
                            <ChevronDown strokeWidth=".25em" />
                        </div>
                    </div>
                </button>

                <span className="category-name">Perfil {category}</span>

                {category.toLowerCase() === 'investigador' && <NotebookPen color="var(--yellow)" size="1.8em" />}
                {category.toLowerCase() === 'artístico' && <Palette color="var(--yellow)" size="1.8em" />}
                {category.toLowerCase() === 'social' && <HandHeart color="var(--yellow)" size="1.8em" />}
                {category.toLowerCase() === 'emprendedor' && <ChartNoAxesCombined color="var(--yellow)" size="1.8em" />}
                {category.toLowerCase() === 'convencional' && <ShieldCheck color="var(--yellow)" size="1.8em" />}
                {category.toLowerCase() === 'realista' && <Eye color="var(--yellow)" size="1.8em" />}
            </div>

            <div className="percentual-score"></div>

            <div className="description-wrapper">
                <h4 className="section-title">
                    ¿Qué dice este perfil sobre ti?
                </h4>

                <p>
                    {interpretationProfile}
                </p>
                {
                    index < 3 &&
                    <>
                        <h4 className="section-title">
                            Habilidades que destacan en ti
                        </h4>

                        <p>
                            {strengthsDescription}
                        </p>
                    </>
                }

                <label>
                    <span className="section-title">
                        Carreras que van contigo
                    </span>
                    <select onChange={selectProgramType}>
                        <option value="universitario">Universitarias</option>
                        <option value="técnico">Técnicas</option>
                    </select>
                </label>

                <ul>
                    {
                        recommendedProgramList[programType === 'universitario' ? 'universityPrograms' : 'technicalPrograms'].map((program, index) => (
                            <li key={index} className="program-name">
                                <a onClick={() => onClick({ program })} href={`/?program=${encodeURI(program)}&programType=${encodeURI(programType)}&testID=${encodeURI(testID)}`} target="_blank" rel="noopener noreferrer">
                                    {program}
                                    <div className="icon">
                                        <ExternalLink height=".8em" width=".8em" strokeWidth=".2em" />
                                    </div>
                                </a>
                            </li>
                        ))
                    }
                </ul>
            </div>

            <style jsx>{`
                .container {
                    align-items: center;
                    cursor: ${isTextExpanded ? 'auto' : 'pointer'};
                    border-radius: .5em;
                    padding: 1.5em;
                    background: ${isTextExpanded ? 'var(--blue)' : 'var(--transparent-dark-blue)'};
                    border: .15em solid var(--yellow);
                    transition: background .3s;
                }

                .container:hover {
                    background: var(--blue);
                }

                .name {
                    display: flex;
                    align-items: center;
                    gap: .7em;
                }

                .category-name {
                    font-weight: 400;
                }

                .percentual-score {
                    position: relative;
                    background-color: var(--transparent-dark-blue);
                    width: 100%;
                    border-radius: .5em;
                    height: 1.7em;
                    margin-top: 1em;
                    margin-bottom: ${isTextExpanded ? '1em' : '0'};
                    transition: margin .3s;
                    border: .15em solid var(--transparent-dark-blue);
                }

                .percentual-score::before {
                    content: "${percentualScore.toFixed(1)}%";
                    position: absolute;
                    display: grid;
                    align-items: center;
                    width: ${percentualScore}%;
                    height: 100%;
                    border-radius: .5em;
                    background-color: rgb(255, 201, 0, ${opacity.current});
                    text-align: right;
                    padding-right: .5em;
                    box-sizing: border-box;
                    color: var(--dark-blue); 
                    min-width: 3.5em;
                    font-weight: 600;
                }

                .description-wrapper {
                    display: grid;
                    gap: ${isTextExpanded ? '.65lh' : '0'};
                    opacity: ${isTextExpanded ? '1' : '0'};
                    transition: opacity .3s, gap .3s;
                }

                .description-wrapper .section-title {
                    font-size: ${isTextExpanded ? '1.1em' : '0'};
                    font-weight: 700;
                    transition: font-size .3s;
                    color: var(--yellow);
                    padding-left: 1.5em;
                    position: relative;
                }

                .description-wrapper .section-title::before {
                    content: "";
                    position: absolute;
                    width: .7em;
                    height: .7em;
                    background-color: var(--yellow);
                    left: .35em;
                    top: 50%;
                    transform: translateY(-50%);
                    border-radius: 50%;

                }

                .description-wrapper p {
                    font-size: ${isTextExpanded ? '1em' : '0'};
                    font-weight: 500;
                    transition: font-size .3s;
                    padding-inline: 1.7em 1em;
                }

                button {
                    color: var(--yellow);
                    padding: 0;
                    display: flex;
                }

                .wrapper-icon {
                    transition: transform .3s;
                    transform: rotate(${isTextExpanded ? '180' : '0'}deg);
                }

                .icon {
                    display: grid;
                    position: relative;
                    animation: ${isTextExpanded ? '' : 'bounce'} 1s 0.${index * 3}s infinite alternate ease-in-out;
                }

                .title-btn {
                    font-size: 0;
                    align-self: center;
                    opacity: 0;
                    padding-right: .4em;
                    transition: font-size .3s, opacity .3s, padding .3s;
                }

                ul {
                    font-size: ${isTextExpanded ? '1em' : '0'};
                    gap: .8em 1em;
                    padding-left: 1.8em;
                }

                .program-name {
                    display: inline-block;
                    margin-top: .5em;
                    margin-right: .5em;
                }

                a:link {
                    background-color: var(--blue);
                }
                
                a {
                    display: flex;
                    gap: .5em;
                    align-items: center;
                    border-radius: .5em;
                    padding: .3em .7em .3em 1em;
                    border: .15em solid var(--yellow);
                    color: var(--yellow);
                    font-weight: 600;
                    text-transform: capitalize;
                    transition: transform .3s, background .3s, color .3s, font-size .3s;
                }


                a:visited {
                    color: var(--dark-blue);
                    background-color: var(--yellow);
                }

                a:hover {
                    color: var(--dark-blue);
                    background-color: var(--yellow);
                    transform: scale(1.05);
                }

                .icon {
                    display: grid;
                    align-self: start;
                    justify-items: end;
                }

                @keyframes bounce {
                    0% {
                        bottom: .15em;
                        transform: scale(1.15); 
                    }

                    20% {
                        bottom: -.15em;
                        transform: scale(1.15);
                    }

                    40% {
                        bottom: 0;
                        transform: scale(1);
                    }

                    100% {
                        bottom: 0;
                        transform: scale(1);
                    }
                }

                label {
                    display: flex;
                    justify-items: center;
                    gap: .7em;
                    align-items: center;
                    font-weight: 500;
                }

                select {
                    font-size: ${isTextExpanded ? '1em' : '0'};
                    padding: .3em 1em;
                    border-radius: 5em;
                    cursor: pointer;
                    background: #2b3c68;
                    color: var(--white);
                    border: .15em solid var(--yellow);
                    color: var(--yellow);
                    transition: font-size .3s;
                }
            `}</style>
        </li>
    )
}

export default ResultPercentualScore
