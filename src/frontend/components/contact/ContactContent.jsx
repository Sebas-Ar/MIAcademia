import { SiFacebook, SiInstagram, SiTiktok, SiWhatsapp } from '@icons-pack/react-simple-icons'
import { Linkedin, MailCheck } from 'lucide-react'
import { toast } from 'sonner'
import Waves from '../decoration/Waves'
import ContactInfoItem from './ContactInfoItem'

const ContactContent = () => {
    const onSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)

        formData.append('access_key', process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY)

        const object = Object.fromEntries(formData)
        const json = JSON.stringify(object)

        toast.promise(fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: json
        }), {
            loading: 'Enviando...',
            success: () => {
                event.target.reset()
                return <p>
                    Mensaje enviado
                    <br />
                    Pronto nos pondremos en contacto contigo
                </p>
            },
            error: 'Error al enviar el mensaje'
        })
    }

    return <section>
        <Waves />

        <div className="wrapper-contact">
            <div className="contact">
                <form onSubmit={onSubmit}>
                    <h1>Contáctanos</h1>
                    <p>
                    ¿Tienes dudas, sugerencias o quieres colaborar?
                        <br />
                    En MiAcademia estamos para escucharte y ayudarte
                    </p>
                    <input type="text" name="name" placeholder="Nombre" required />
                    <input type="email" name="email" placeholder="Email" required />
                    <textarea name="message" placeholder="Mensaje" required></textarea>
                    <button>Enviar</button>
                </form>
                <article>
                    <h2>Info</h2>
                    <ul>
                        <ContactInfoItem
                            icon={<MailCheck size="1.5em" strokeWidth=".15em" />}
                            text="info@miacademia.ai"
                        />
                        <ContactInfoItem
                            icon={<SiWhatsapp size="1.5em" strokeWidth=".15em" />}
                            text="+57 300 000 00 00"
                        />
                        <div className="wrapper-social-icons">
                            <ContactInfoItem
                                icon={<SiFacebook size="1.5em" strokeWidth=".15em" />}
                            />
                            <ContactInfoItem
                                icon={<SiInstagram size="1.5em" strokeWidth=".15em" />}
                            />
                            <ContactInfoItem
                                icon={<SiTiktok size="1.5em" strokeWidth=".15em" />}
                            />
                            <ContactInfoItem
                                icon={<Linkedin size="1.5em" strokeWidth=".12em" />}
                            />
                        </div>
                    </ul>
                </article>
            </div>
        </div>

        <style jsx>{`
            section {
                position: relative;
                display: grid;
                place-items: center;
            }

            .wrapper-contact {
                z-index: 1;
                padding: 6em 4em 8em;
            }

            .contact {
                position: relative;
                background: #fff6;
                backdrop-filter: blur(.3em);
                border-radius: 1em;
                box-shadow: 0 0 1.5em .5em #0001;
                display: grid;
                grid-template-columns: auto auto;
            }

            form {
                display: grid;
                padding: 4em;
                gap: .5em;
            }

            h1 {
                font-size: 2.5em;
                font-weight: 600;
            }

            p {
                max-width: 30em;
                font-weight: 600;
            }

            input, textarea {
                padding: .5em;
                border-bottom: .2em solid var(--yellow);
                font-weight: 600;
                background: unset;
            }

            textarea {
                min-height: 2.75em;
                scrollbar-width: none;
                resize: none;
                font-family: inherit;
            }

            input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
                color: var(--dark-gray);
                font-weight: 600;
                font-family: inherit;
            }
            

            textarea:focus::-webkit-input-placeholder, input:focus::-webkit-input-placeholder {
                transition: color .3s;
                color: transparent;
            }

            button {
                background: var(--yellow);
                justify-self: center;
                margin-top: 1em;
                border-radius: 2em;
                padding: .5em 2em;
                font-weight: 600;
                cursor: pointer;
                transition: transform .3s;
            }

            button:hover {
                transform: scale(1.1);
            }

            article {
                align-self: center;
                background: var(--dark-blue);
                color: var(--white);
                padding: 2em;
                border-radius: 1em 0 0 1em;
                display: grid;
                gap: 1em;
                position: relative;
            }

            article::before {
                content: '';
                position: absolute;
                top: -1.25em;
                left: -1.25em;
                width: 2.5em;
                height: 2.5em;
                background: var(--yellow);
                border-radius: .6em;
            }

            h2 {
                text-align: center;
                font-size: 1.3em;
                font-weight: 600;
            }

            ul {
                display: grid;
                gap: 1.5em;
            }

            .wrapper-social-icons {
                margin-top: 1em;
                display: flex;
                justify-content: center;
                gap: 1em;
            }

            @media (width < 825px) {
                .contact {
                    grid-template-columns: 1fr;
                    margin: 1.5em;
                    text-align: center;
                }

                .wrapper-social-icons {
                    margin-top: 1em;
                }

                article {
                    border-radius: 0 0 1em 1em;
                }

                form {
                    padding: 2em;
                }

                ul {
                    justify-items: center;
                }
            }

        `}</style>
    </section>
}

export default ContactContent
