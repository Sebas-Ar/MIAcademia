import { useChatBarStore } from '@/frontend/hooks/globalState/useChatBarStore'
import { X } from 'lucide-react'
import { useEffect } from 'react'

const modelsList = [
    { name: 'gemini', value: 'gemini', status: 'enabled' },
    { name: 'chatGPT', value: 'openAI', status: 'enabled' },
    { name: 'deepseek', value: 'deepseek', status: 'disabled' },
    { name: 'groq', value: 'groq', status: 'disabled' },
    { name: 'claude', value: 'claude', status: 'disabled' }
]

const SelectModel = () => {
    const isModalModelSelectEnable = useChatBarStore((state) => state.isModalModelSelectEnable)
    const toogleModalModelSelectEnable = useChatBarStore((state) => state.toogleModalModelSelectEnable)
    const modelSelected = useChatBarStore((state) => state.modelSelected)
    const selectModel = useChatBarStore((state) => state.selectModel)

    useEffect(() => {
        console.log(isModalModelSelectEnable)
    }, [isModalModelSelectEnable])

    return (
        <article className="page">
            <div onClick={toogleModalModelSelectEnable} className="background"></div>

            <div className="filter-wrapper">
                <button onClick={toogleModalModelSelectEnable} className="btn-close">
                    <X size="1.4em" strokeWidth=".2em" />
                </button>

                <h3>¿Quién te guiará en tu búsqueda académica?</h3>
                <p>Escoge el modelo de IA que mejor te ayude a responder tus preguntas.</p>
                <div className="wrapper-options">
                    {
                        modelsList.map(({ name, value, status }) => (
                            <button
                                key={value}
                                className={`button-model ${modelSelected === value ? 'active' : ''}`}
                                onClick={() => selectModel({ modelSelected: value })}
                                disabled={status === 'disabled'}
                            >
                                {name}
                            </button>
                        ))
                    }
                </div>

            </div>

            <style jsx>{`
                .page {
                    left: ${isModalModelSelectEnable ? '0%' : '100%'};
                    opacity: ${isModalModelSelectEnable ? '1' : '0'};
                }
            `}</style>

            <style jsx>{`
                .page {
                    height: 100dvh;
                    width: 100vw;
                    position: fixed;
                    top: 0;
                    display: grid;
                    place-items: center;
                    padding: 2em;
                    z-index: 11111111111;
                    transition: opacity .3s, left 0s ${isModalModelSelectEnable ? '0s' : '.3s'};
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
                }

                .btn-close:hover {
                    transform: scale(1.2);
                }

                .background {
                    height: 100%;
                    width: 100%;
                    background: var(--transparent-dark-gray);
                    position: absolute;
                    z-index: -1;
                }

                .filter-wrapper {
                    background-color: var(--dark-blue);
                    padding: 2.4em;
                    width: 100%;
                    max-width: 37em;
                    border-radius: 1em;
                    overflow: hidden;
                    border: .125em solid var(--yellow);
                    display: grid;
                    gap: 1em;
                    position: relative;
                }

                h3 {
                    font-size: 1.1em;
                    color: var(--yellow);
                    text-align: center;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                p {
                    color: var(--yellow);
                    font-size: 1em;
                    text-align: center;
                    font-weight: 300;
                    margin-bottom: .7em;
                }

                .wrapper-options {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 1em;
                    justify-content: center;
                    max-width: 23em;
                    justify-self: center;
                }

                .button-model {
                    background: var(--transparent-white);
                    padding: .5em 1em;
                    border-radius: .5em;
                    font-size: .85em;
                    font-weight: 600;
                    color: var(--white);
                    transition: transform .3s;
                    border: .15em solid var(--yellow);
                    text-transform: capitalize;
                    opacity: .8;
                    transition: transform .3s, background .3s, color .3s, border .3s, opacity .3s;
                }

                .button-model:hover {
                    transform: scale(1.1);
                    background: var(--yellow);
                    color: var(--dark-blue);
                    border: .15em solid var(--dark-yellow);
                    opacity: 1;
                }

                .button-model.active {
                    background: var(--yellow);
                    color: var(--dark-blue);
                    border: .15em solid var(--dark-yellow);
                    opacity: 1;
                }

                .button-model:disabled {
                    cursor: auto;
                    opacity: .3;
                }

                .button-model:disabled:hover {
                    background: var(--transparent-white);
                    transform: none;
                    color: var(--white);
                    border-color: var(--yellow);
                    
                }
                
            `}</style>
        </article>
    )
}

export default SelectModel
