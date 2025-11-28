'use client'

// react
// next
// auth
// components
import LoginGoogle from '../login/LoginGoogle'
import VocationalPropertie from './VocationalPropertie'
import VocatinalResultList from './VocationalResultList'
// icons
import { CircleAlert, ClipboardList, Clock, GraduationCap, NotebookPen, Save, Sparkles } from 'lucide-react'
// vocational test
import { artistico, convencional, emprendedor, investigador, realista, social } from './questionary'
// array utils
import { shuffleArray } from '@/frontend/utils/array'
// user utils
import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { useIdentifyUser } from '@/frontend/hooks/useIdentifyUser'
import { useTransitionRouter } from 'next-view-transitions'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Markdown from 'react-markdown'
import InformationIcon from '../information/InformationIcon'
import VocatinalInProgressList from './VocatinalInProgressList'

const VocationalIntroduction = ({
    testsList = null
}) => {
    // hook
    const { anonimousUserID, userEmail, isLogging } = useIdentifyUser()
    const { register, handleSubmit } = useForm()
    const [isShowError, setIsShowError] = useState(false)

    const router = useTransitionRouter()

    const startTest = async ({ questionsNumber }) => {
        const questionsNumberByType = questionsNumber / 6
        const testData = {
            userEmail,
            anonimousUserID,
            startedAt: new Date(),
            questionsListAleatory: shuffleArray([
                ...shuffleArray(artistico).slice(0, questionsNumberByType),
                ...shuffleArray(convencional).slice(0, questionsNumberByType),
                ...shuffleArray(emprendedor).slice(0, questionsNumberByType),
                ...shuffleArray(investigador).slice(0, questionsNumberByType),
                ...shuffleArray(realista).slice(0, questionsNumberByType),
                ...shuffleArray(social).slice(0, questionsNumberByType)
            ]),
            questionsNumber
        }

        localStorage.setItem('startedAt', testData.startedAt)

        try {
            const response = await fetch('/api/vocational-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testData)
            })

            if (!response.ok) {
                throw new Error('Something went wrong')
            }

            const data = await response.json()
            router.push(`/test-vocacional/holland/${data.testSaved.insertedId}/questionary`)
        } catch (error) {
            setIsShowError(true)
        }
        triggerEvent(eventCategories.TEST_VOCACIONAL, eventNames.START_TEST)
    }

    if (isShowError) return <p>Algo salió mal, intenta nuevamente</p>

    return (
        <div className="test-introduction">
            <div className="wrapper">
                <hgroup>
                    <h1>
                        <div className="star-icon">
                            <Sparkles size="1.2em" color="var(--yellow)" />
                        </div>
                        Test Vocacional
                        <div className="star-icon">
                            <Sparkles size="1.2em" color="var(--yellow)" />
                        </div>
                    </h1>
                    <div className="subtittle-wrapper">
                        <div className="line"></div>
                        <h2>
                            Test de Holland
                        </h2>
                        <div className="line"></div>
                    </div>
                </hgroup>
                <div className="description">
                    <Markdown>
                        Descubre tu **perfil vocacional** mediante el reconocido **modelo RIASEC de Holland**,
                        potenciado por **inteligencia artificial**. Analizaremos tus **intereses** y **personalidad**
                        para identificar las **carreras** que mejor se alinean con tu **perfil profesional**
                    </Markdown>
                </div>

                <div className="profile-wrapper">
                    <p className="profile-list-title">
                        <span>RIASEC</span>
                        <br />
                        Los perfiles que definirán tu vocación
                    </p>
                    <ul className="profile-list">
                        <li className="profile-item"><span>r</span>ealista</li>
                        <li className="profile-item"><span>i</span>nvestigador</li>
                        <li className="profile-item"><span>a</span>rtistico</li>
                        <li className="profile-item"><span>s</span>ocial</li>
                        <li className="profile-item"><span>e</span>mprendedor</li>
                        <li className="profile-item"><span>c</span>onvencional</li>
                    </ul>
                </div>
                {
                    /* just show start test button if there is some test not completed */

                    <form onSubmit={handleSubmit(startTest)}>
                        <div className="select-wrapper">
                            <select
                                {...register('questionsNumber')}
                                disabled={(testsList && testsList?.some(test => test.completedAt === null))}
                                defaultValue={90}
                            >
                                <option value={120}>120 Preguntas</option>
                                <option value={90}>90 Preguntas (Recomendado)</option>
                                <option value={60}>60 Preguntas</option>
                                <option value={30}>30 Preguntas</option>
                            </select>
                            <InformationIcon
                                icon={<CircleAlert size="1.5em" />}
                                text="Disminuir el número de preguntas reducirá la precisión del resultado."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={(testsList && testsList?.some(test => test.completedAt === null))}
                        >
                            <NotebookPen height="1.2em" strokeWidth={2.2} />
                            Iniciar Test
                        </button>
                    </form>
                }
                {
                    testsList && testsList.length > 0 && testsList.some(test => test.completedAt === null) &&
                    <VocatinalInProgressList testsList={testsList} />
                }
                {
                    testsList && testsList.length > 0 && testsList.some(test => test.completedAt) &&
                    <VocatinalResultList testsList={testsList} />
                }
                <div className='properties-wrapper' >
                    <VocationalPropertie
                        name="Resultados Personalizados"
                        descripcion="Al finalizar, podrás navegar por los programas académicos alineados con tu perfil según los resultados de tu test vocacional."
                        icon={<GraduationCap />}
                    />
                    <VocationalPropertie
                        name="Tiempo Estimado"
                        descripcion="Dedica al menos 10 minutos para completar el test. Tu tiempo y concentración son fundamentales para obtener resultados precisos."
                        icon={<Clock />}
                    />
                    {/* <VocationalPropertie
                        name="Intentos Ilimitados"
                        descripcion="Puedes realizar el test tantas veces como desees para explorar diferentes aspectos de tu perfil vocacional."
                        icon={<RefreshCcw />}
                    /> */}
                    <VocationalPropertie
                        name="Estructura del Test"
                        descripcion="El test consta de 90 preguntas diseñadas para comprender mejor tus intereses y habilidades."
                        icon={<ClipboardList />}
                    />
                    <VocationalPropertie
                        name="Guarda tu Progreso"
                        descripcion={isLogging ? 'Guardamos tu progreso y resultados del test vocacional en tu perfil.' : 'Inicia sesión para guardar tu progreso y resultados del test vocacional.'}
                        icon={<Save />}
                    />
                    {
                        !isLogging &&
                        <div className="wrapper-login">
                            <LoginGoogle
                                locationBtn='vocational-test-introduction'
                            />
                        </div>
                    }
                </div>
            </div>

            <style jsx>{`
                .test-introduction {
                    display: grid;
                    place-items: center;
                    height: 100%;
                    padding: 1em 0 1.5em;
                }

                .wrapper {
                    display: grid;
                    gap: 1.5em;
                    width: 100%;
                    max-width: 40em;
                    border-radius: 1em;
                    padding: 2em 3em;
                    background-color: var(--transparent-dark-blue);
                }

                hgroup {
                    display: grid;
                    gap: .5em;
                }

                h1 {
                    font-size: 1.55em;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: .5em;
                    text-transform: uppercase;
                    margin-bottom: .5em;
                    text-align: center;
                }

                .star-icon {
                    transform: rotate(25deg) translateY(.2em);
                }

                .star-icon:nth-child(1) {
                    transform: rotate(-120deg) translateY(.2em);
                }

                .subtittle-wrapper {
                    position: relative;
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    justify-content: center;
                }

                .line {
                    width: 100%;
                    height: .1em;
                    background: var(--yellow);
                    align-self: center;
                }

                h2 {
                    position: relative;
                    padding: 0 1em;
                    margin: 0 1em;
                    font-size: 1.4em;
                    font-weight: 400;
                    background-color: var(--transparent-dark-blue);
                    border-radius: .5em;
                }

                .description {
                    font-size: .9em;
                    font-weight: 300;
                    text-align: center;
                    line-height: 1.1lh;
                }

                .profile-wrapper {
                    display: grid;
                    gap: 1em;
                    background: var(--transparent-dark-blue);
                    padding: 1em;
                    border-radius: .5em;
                }

                .profile-list-title {
                    text-align: center;

                    span {
                        color: var(--yellow);
                        font-weight: 500;
                        font-size: 1.3em;
                    }
                }

                .profile-list {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    margin: 0 1em;
                    gap: .5em;
                }

                .profile-item {
                    cursor: pointer;
                    border-radius: .5em;
                    padding: .2em .5em;
                    border: .15em solid var(--transparent-white);
                    transition: border .3s;
                }

                .profile-item:hover {
                    border: .15em solid var(--yellow);
                }

                .profile-item span {
                    color: var(--yellow);
                    text-transform: uppercase;
                    font-size: 1.2em;
                    font-weight: 500;
                    align-items: center;
                    justify-items: center;
                }

                form {
                    position: relative;
                    display: grid;
                    justify-items: center;
                    padding: 0 1em;
                    gap: 1em;
                }

                .select-wrapper {
                    position: relative;
                    z-index: 1;
                }

                select {
                    border-radius: .5em;
                    padding: .5em 1em;
                    font-size: .9em;
                    font-weight: 600;
                    background-color: var(--transparent-dark-blue);
                    color: var(--yellow);
                    border: .15em solid var(--yellow);
                    cursor: pointer;
                    text-align: center;
                }

                option {
                    background: var(--dark-blue);
                }
                
                button {
                    display: flex;
                    align-items: center;
                    gap: .5em;
                    background-color: var(--yellow);
                    color: var(--dark-blue);
                    border-radius: .5em;
                    padding: .7em 1em;
                    font-weight: 600;
                    transition: transform .3s;
                }

                button:hover {
                    transform: scale(1.05);
                }

                button[disabled], select[disabled] {
                    opacity: .6;
                    cursor: auto;
                }

                button[disabled]:hover {
                    transform: none;
                }

                .properties-wrapper {
                    display: grid;
                    gap: 1.5em;
                    background-color: var(--transparent-dark-blue);
                    padding: 1.5em;
                    border-radius: .5em;
                }

                .wrapper-login {
                    margin: auto;
                }
            `}</style>
        </div>
    )
}

export default VocationalIntroduction
