import { eventCategories, eventNames, triggerEvent } from '@/frontend/googleTagManager'
import { useHistoryStore } from '@/frontend/hooks/globalState/useHistoryStore'
import useLocalStorage from '@/frontend/hooks/useLocalStorage'
import { yupResolver } from '@hookform/resolvers/yup'
import { Bell, CheckCircle, Mail, Phone, User, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import LoginGoogle from '../login/LoginGoogle'
import MIABtnLink from '../navigation/MIABtnLink'
import VocationalBtnLink from '../navigation/VocationalBtnLink'
import ToolSuggestion from './ToolSuggestion'

const CounslingActionPlan = ({
    userData = {},
    isLogging = false,
    enableModal = () => { },
    closeModal = () => { },
    title = '',
    isCounselingActive = false
}) => {
    const router = useRouter()

    const lastChatID = useHistoryStore((state) => state.lastChatID)

    const [showErrorMessage, setShowErrorMessage] = useState('')
    const [isSuccessRegister, setIsSuccessRegister] = useState(Boolean(userData[title.toLowerCase().replace(/ /g, '-')]))

    const session = useSession()

    const validationProperties = {}
    if (!userData.name) validationProperties.name = Yup.string().required('El nombre es requerido')
    if (!userData.email) validationProperties.email = Yup.string().required('El correo es requerido').email('Correo inválido')
    if (!userData.phone) validationProperties.phone = Yup.string().required('El teléfono es requerido').matches(/^\d{10}$/, 'El teléfono debe tener 10 dígitos')

    const validationSchema = Yup.object().shape(validationProperties)

    const isCounselingModalActiveLocalStorage = useLocalStorage('isCounselingModalActive' + title.toLowerCase().replace(/ /g, '-'))

    useEffect(() => {
        if (isCounselingModalActiveLocalStorage === 'true') {
            enableModal()
        }
    }, [isCounselingModalActiveLocalStorage])

    const formOptions = { resolver: yupResolver(validationSchema) }

    const { register, handleSubmit, formState: { errors } } = useForm(formOptions)

    const onSubmit = async (formData) => {
        triggerEvent(eventCategories.GUIDE_VOCACIONAL, eventNames.SUBMIT_FORM, {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            planType: title.toLowerCase().replace(/ /g, '-')
        })

        // replace with regex spaces to -
        formData.typeNotification = title.toLowerCase().replace(/ /g, '-')
        if (!formData.name) delete formData.name
        if (!formData.email) formData.email = userData.email
        if (!formData.phone) delete formData.phone

        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        if (!response.ok) return setShowErrorMessage('Error al registrar')

        const data = await response.json()
        setIsSuccessRegister(true)

        if (isLogging) session.update({ ...data.modifiedUser })
    }

    const onChangeForm = (e) => {
        triggerEvent(eventCategories.GUIDE_VOCACIONAL, eventNames.INPUT_FORM, {
            name: e.target.name,
            value: e.target.value,
            planType: title.toLowerCase().replace(/ /g, '-')
        })
        router.push('/asesoria-vocacional')
    }

    const onClickLink = (e, { target }) => {
        e.preventDefault()
        triggerEvent(eventCategories.GENERAL_INTERACTIONS, eventNames.NAVIGATION, {
            to: target,
            from: '/asesoria-vocacional',
            type: 'suggestion-asesoria-vocacional'
        })
        router.push(target)
    }

    return (
        <div className="wrapper">
            <div className="background" onClick={closeModal}>
            </div>
            {
                showErrorMessage && <div className="wrapper-content">
                    <div className="message-wrapper">
                        <button className="close-btn" type="button" onClick={closeModal}>
                            <X height="1.3em" width="1.3em" />
                        </button>
                        <p className="errorMessage">
                            {showErrorMessage}
                        </p>
                    </div>
                </div>
            }

            {
                !showErrorMessage && isSuccessRegister && <div className="wrapper-content">
                    <div className="message-wrapper gap">
                        <button className="close-btn" type="button" onClick={closeModal}>
                            <X height="1.3em" width="1.3em" />
                        </button>
                        <div className="icon-success">
                            <CheckCircle size="5.5em" strokeWidth=".14em" />
                        </div>
                        <h3>
                            {title}
                        </h3>
                        <p className="success-text">
                            ¡Te contactaremos pronto!
                        </p>
                        <p className="invitation-text">
                            Mientras tanto, te invitamos a explorar nuestras herramientas
                        </p>
                        <nav>
                            <a onClick={(e) => onClickLink(e, { target: '/test-vocacional' })}>
                                <ToolSuggestion
                                    icon={<VocationalBtnLink />}
                                    title="Test Vocacional"
                                    description="Descubre tu afinidad con programas académicos y encuentra tu mejor opción"
                                />
                            </a>
                            <a onClick={(e) => onClickLink(e, { target: lastChatID ? '/chats/' + lastChatID + '?lastChat=enable' : '/' })}>
                                <ToolSuggestion
                                    icon={<MIABtnLink />}
                                    title="MIA"
                                    description="Resuelve dudas y encuentra el programa ideal con nuestra IA experta"
                                    color='yellow'
                                />
                            </a>
                        </nav>
                        <p className="call-action-text">
                            Selecciona una herramienta para comenzar a explorar con IA
                        </p>
                    </div>
                </div>
            }

            {
                !showErrorMessage && !isSuccessRegister && <div className="wrapper-content">

                    <form onSubmit={handleSubmit(onSubmit)} onChange={onChangeForm}>
                        <button className="close-btn" type="button" onClick={closeModal}>
                            <X height="1.3em" width="1.3em" />
                        </button>
                        <hgroup>
                            <h2>
                                ¡Tu Futuro Está en Marcha!
                            </h2>
                            <h3>
                                {title}
                            </h3>
                        </hgroup>
                        <p>
                            Estamos afinando los últimos detalles para brindarte la mejor asesoría vocacional.
                            ¡No te quedes atrás! Déjanos tus datos y sé el primero en enterarte cuando nuestros
                            planes estén disponibles.
                        </p>
                        {
                            !isLogging &&
                            <LoginGoogle
                                text="Continuar con Google"
                                locationBtn='plan-asesoria-vocacional'
                            />
                        }
                        <div className="line"></div>
                        {
                            !userData.name &&
                            <label>
                                <input type="text" placeholder="Nombre" {...register('name', {
                                    required: {
                                        value: true,
                                        message: 'El nombre es requerido'
                                    }
                                })} />

                                <div className="icon">
                                    <User height="2em" strokeWidth=".18em" />
                                    <span>Nombre</span>
                                </div>
                                <span className="errorMessage">
                                    {errors?.name?.message}
                                </span>
                            </label>
                        }
                        {
                            !userData.email &&
                            <label>
                                <input type="email" placeholder="Email" {...register('email', {
                                    required: {
                                        value: true,
                                        message: 'El correo es requerido'
                                    },
                                    type: 'email'
                                })} />
                                <div className="icon">
                                    <Mail height="2em" strokeWidth=".18em" />
                                    <span>Correo</span>
                                </div>
                                <span className="errorMessage">
                                    {errors?.email?.message}
                                </span>
                            </label>
                        }
                        {
                            !userData.phone &&
                            <label>
                                <input type="tel" placeholder="Teléfono" {...register('phone', {
                                    required: {
                                        value: true,
                                        message: 'El teléfono es requerido'
                                    }
                                })} />
                                <div className="icon">
                                    <Phone height="2em" strokeWidth=".18em" />
                                    <span>Teléfono</span>
                                </div>
                                <span className="errorMessage">
                                    {errors?.phone?.message}
                                </span>
                            </label>
                        }
                        <button className="btn-submit" type="submit">
                            <Bell height="1.3em" strokeWidth=".18em" />
                            Activar Notificación
                        </button>
                    </form>
                </div>
            }

            <style jsx>{`
                .wrapper {
                    height: 100dvh;
                    width: 100vw;
                    position: fixed;
                    top: 0;
                    left: ${isCounselingActive ? '0' : '-100%'};
                    transition: left 0s ${isCounselingActive ? '0' : '.3s'};
                    display: grid;
                    place-items: center;
                    padding: 2em;
                    z-index: 11111111111111111111;
                    view-transition-name: counseling-action-page;
                }

                .background {
                    height: 100%;
                    width: 100%;
                    background: #000a;
                    position: absolute;
                    z-index: -1;
                    cursor: pointer;
                    opacity: ${isCounselingActive ? '1' : '0'};
                    transition: opacity .3s;
                }

                .wrapper-content {
                    display: grid;
                    align-items: center;
                    height: 100%;
                    overflow-y: auto;
                    opacity: ${isCounselingActive ? '1' : '0'};
                    transition: opacity .3s;
                }

                .wrapper-content::-webkit-scrollbar {
                    width: 2em;
                }

                form, .message-wrapper {
                    position: relative;
                    border-radius: .5em;
                    border: .15em solid var(--dark-blue);
                    max-width: 40em;
                    background: var(--white);
                    padding: 2em 1.5em;
                    font-weight: 600;
                    display: grid;
                    justify-items: center;
                    gap: 1.5em;
                }


                .gap {
                    gap: .8em;
                }

                .close-btn {
                    position: absolute;
                    top: .7em;
                    right: .5em;
                    color: var(--dark-blue);
                    transition: transform .3s;
                    display: grid;
                    place-items: center;
                }

                .icon-success {
                    color: var(--yellow);
                    animation: zoomCheck 1.5s ease-in-out forwards;
                }

                .success-text {
                    font-size: 1.8em;
                    font-weight: 600;
                }

                .invitation-text {
                    font-size: 1em;
                    color: var(--dark-gray);
                    margin: -.5em 0 .5em; 
                }

                .call-action-text {
                    color: var(--dark-gray);
                    font-size: 1em;
                }

                .close-btn:hover {
                    transform: scale(1.1);
                }

                hgroup {
                    display: grid;
                    justify-items: center;
                }

                h2 {
                    display: flex;
                    align-items: center;
                    gap: .5em;
                    font-size: 1.4em;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: var(--dark-blue);
                    position: relative;
                    margin: 0 1em;
                    text-align: center;
                }

                .title-icon {
                    position: absolute;
                    right: calc(100% + .3em);
                    display: grid;
                    place-items: center;
                    top: 50%;
                    transform: translateY(-50%);
                }

                h3 {
                    background: var(--yellow);
                    padding: .2em 2em;
                    border-radius: .5em;
                    margin: 0 .5em;
                    position: relative;
                    font-weight: 700;
                    font-size: 1.3em;
                }

                p {
                    font-size: .9em;
                    text-align: center;
                }

                .line {
                    background: var(--dark-yellow);
                    height: .1em;
                    width: 100%;
                }

                label {
                    display: grid;
                    border: .15em solid var(--dark-blue);
                    border-radius: .5em;
                    grid-template-columns: auto 1fr;
                    min-width: 25em;
                    position: relative;
                }

                .icon {
                    border-radius: .5em 0 0 .5em;
                    padding: .5em;
                    position: relative;
                    display: grid;
                    place-items: center;
                    grid-column: 1/2;
                    grid-row: 1/2;
                    background: var(--yellow);
                    padding: 0 .8em;
                }

                .icon span {
                    position: absolute;
                    left: calc(100% + 1.2em);
                    top: 50%;
                    transform: translateY(-50%);
                    cursor: text;
                    font-weight: 800;
                    opacity: .6;
                    transition: top .3s, transform .3s, font-size .3s, opacity .3s;
                }

                input {
                    display: { isCounselingActive ? 'block' : 'none' };
                    height: 100%;
                    grid-column: 2/3;
                    grid-row: 1/2;
                    background: unset;
                    padding: 1.2em 1em .2em;
                    border-radius: 0 .5em .5em 0;
                }

                input:focus + .icon span {
                    top: .3em;
                    transform: translateY(0);
                    font-size: .8em;
                    opacity: 1;
                }

                input:not(:placeholder-shown) + .icon span {
                    top: .3em;
                    transform: translateY(0);
                    font-size: .8em;
                    opacity: 1;
                }

                input::placeholder {
                    color: transparent;
                }

                .errorMessage {
                    text-align: center;
                    width: 100%;
                    font-size: .7em;
                    color: var(--red);
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    top: calc(100% + .3em);
                    z-index: 1;
                }

                .btn-submit {
                    background: var(--yellow);
                    border: .15em solid var(--dark-blue);
                    padding: 1em;
                    font-weight: 600;
                    border-radius: .5em;
                    display: flex;
                    align-items: center;
                    gap: .5em;
                    transition: transform .3s;
                }

                .btn-submit:hover {
                    transform: scale(1.05);
                }

                nav {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1em;
                }

                @keyframes zoomCheck {
                    0% {
                        transform: scale(0);
                    }

                    20% {
                        transform: scale(1.2);
                    }

                    40% {
                        transform: scale(.6);
                    }
                    60% {
                        transform: scale(1.1);
                    }
                    80% {
                        transform: scale(.8);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                @media (width < 500px) {
                    nav {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    )
}

export default CounslingActionPlan
