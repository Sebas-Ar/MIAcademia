'use client'

import Footer from '@/frontend/components/footer/Footer'
import Header from '@/frontend/components/header/Header'
import LegalTemplate from '@/frontend/components/legal/LegalTemplate'
import MenuMain from '@/frontend/components/navigation/MainMenu'
import { useIdentifyUser } from '@/frontend/hooks/useIdentifyUser'

const ServiceConditions = () => {
    // auth
    useIdentifyUser()

    return (
        <div className="page">
            <MenuMain />

            <Header
                hideCircles={false}
                isChatEnabled={true}
                setIsModalEnable={false}
                showSubtitle={false}
                showDescription={false}
                disableBackground={false}
                showNav={false}
                hideCountry={true}
            />

            <LegalTemplate
                title="Condiciones del Servicio"
                date="20 de enero de 2025"
                generalDescription="Bienvenido a MIAcademia. Estas Condiciones del Servicio regulan el acceso y uso de nuestra plataforma, incluyendo las aplicaciones, servicios y funcionalidades ofrecidas por MIA. Al utilizar nuestra plataforma, aceptas cumplir con estas condiciones. Si no estás de acuerdo con alguna de las disposiciones, te pedimos que no utilices el servicio."
                sectionsList={[
                    {
                        title: 'Descripción del Servicio',
                        description: 'MIA es una plataforma diseñada para ayudar a los usuarios a explorar programas académicos, becas y opciones de financiación, además de ofrecer un test vocacional para orientar decisiones académicas y profesionales.'
                    },
                    {
                        title: 'Elegibilidad',
                        description: 'Para utilizar nuestros servicios, debes:',
                        contentSections: [
                            {
                                description: 'Ser mayor de edad según las leyes de tu jurisdicción o contar con el consentimiento de un representante legal.'
                            },
                            {
                                description: 'Proporcionar información veraz y completa al registrarte o interactuar con nuestra plataforma.'
                            }
                        ]
                    },
                    {
                        title: 'Uso Aceptable',
                        description: 'Al acceder y usar nuestra plataforma, te comprometes a:',
                        contentSections: [
                            {
                                description: 'No utilizar el servicio para actividades ilícitas, fraudulentas o que vulneren derechos de terceros.'
                            },
                            {
                                description: 'No intentar descompilar, desensamblar o realizar ingeniería inversa sobre nuestra plataforma.'
                            },
                            {
                                description: 'Respetar la propiedad intelectual de MIA y de terceros.'
                            }
                        ],
                        finalText: 'Nos reservamos el derecho de restringir el acceso a la plataforma si consideramos que se ha violado alguna de estas condiciones.'
                    },
                    {
                        title: 'Cuenta del Usuario',
                        description: 'Para poder utilizar de forma completa nuestros servicios, debes crear una cuenta en nuestra plataforma. Una vez creada, deberás confirmar tu correo electrónico para activar tu cuenta.',
                        contentSections: [
                            {
                                description: 'Responsabilidad de la cuenta: Eres responsable de mantener la confidencialidad de tus credenciales de acceso y de todas las actividades realizadas desde tu cuenta.'
                            },
                            {
                                description: 'Suspensión o cierre de cuenta: Nos reservamos el derecho de suspender o cerrar cuentas que infrinjan estas condiciones o que se utilicen de forma indebida.'
                            }
                        ],
                        finalText: 'Para ejercer estos derechos, contáctanos a: [Correo Electrónico de Contacto]'
                    },
                    {
                        title: 'Uso de la Inteligencia Artificial',
                        description: 'Nuestra plataforma utiliza inteligencia artificial (IA) para mejorar tu experiencia. A continuación, describimos cómo se integra la IA en nuestros servicios:',
                        contentSections: [
                            {
                                title: 'Análisis de Datos del Test Vocacional',
                                description: 'El test vocacional utiliza modelos de IA para analizar tus respuestas y ofrecerte recomendaciones personalizadas. Estas recomendaciones están basadas en algoritmos diseñados para identificar patrones en tus intereses y habilidades.'
                            },
                            {
                                title: 'Limitaciones de la IA',
                                description: 'Si bien la IA de MIA está diseñada para brindar resultados precisos y útiles, debes tener en cuenta lo siguiente:',
                                list: [
                                    'Los resultados son orientativos y no constituyen asesoramiento profesional.',
                                    'MIA no garantiza la exactitud total de las recomendaciones generadas.'
                                ]
                            },
                            {
                                title: 'Transparencia y Ética',
                                description: 'MIA se compromete a utilizar IA de manera ética y transparente. No compartimos tus datos con terceros sin tu consentimiento y cumplimos con las normativas aplicables en materia de privacidad y protección de datos.'
                            }
                        ]
                    },
                    {
                        title: 'Contenido del Usuario',
                        description: 'Eres responsable del contenido que compartes en nuestra plataforma. Al subir o compartir contenido:',
                        contentSections: [
                            {
                                description: 'Garantizas que tienes los derechos necesarios para compartir dicho contenido.'
                            },
                            {
                                description: 'Otorgas a MIA una licencia no exclusiva para usar, almacenar y mostrar tu contenido en relación con la operación del servicio.'
                            }
                        ]
                    },
                    {
                        title: 'Propiedad Intelectual',
                        description: 'Todos los derechos de propiedad intelectual relacionados con la plataforma y su contenido (excepto el contenido generado por los usuarios) pertenecen exclusivamente a MIA o sus licenciantes. Está prohibido reproducir, distribuir o modificar cualquier parte de nuestra plataforma sin nuestro consentimiento previo.'
                    },
                    {
                        title: 'Limitación de Responsabilidad',
                        description: 'En la medida permitida por la ley, MIA no será responsable por:',
                        contentSections: [
                            {
                                description: 'Daños indirectos, incidentales o consecuentes derivados del uso de la plataforma.'
                            },
                            {
                                description: 'Pérdidas ocasionadas por interrupciones, errores o fallos en el servicio.'
                            }
                        ]
                    },
                    {
                        title: 'Modificaciones al Servicio y Condiciones',
                        description: 'Nos reservamos el derecho de modificar o discontinuar cualquier parte del servicio, así como estas condiciones, en cualquier momento. Los cambios serán efectivos una vez publicados en la plataforma. Es tu responsabilidad revisar periódicamente estas condiciones.'
                    },
                    {
                        title: 'Jurisdicción y Ley Aplicable',
                        description: 'Estas condiciones se rigen por las leyes de [País/Jurisdicción]. Cualquier disputa será resuelta en los tribunales competentes de dicha jurisdicción.'
                    },
                    {
                        title: 'Contacto',
                        description: 'Si tienes preguntas sobre estas condiciones, contáctanos en:',
                        contentSections: [
                            {
                                description: 'Correo electrónico: [Correo Electrónico de Contacto]'
                            },
                            {
                                description: 'Dirección: [Dirección Física, si aplica]'
                            }
                        ]
                    }

                ]}
            />

            <Footer />

            <style jsx>{`
            .page {
                min-height: 100dvh;
                display: grid;
                grid-template-rows: auto 1fr auto;
                background: var(--yellow);
            }
        `}</style>
        </div>
    )
}

export default ServiceConditions
