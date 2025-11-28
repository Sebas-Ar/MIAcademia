'use client'

import Footer from '@/frontend/components/footer/Footer'
import Header from '@/frontend/components/header/Header'
import LegalTemplate from '@/frontend/components/legal/LegalTemplate'
import MenuMain from '@/frontend/components/navigation/MainMenu'
import { useIdentifyUser } from '@/frontend/hooks/useIdentifyUser'

const PoliticsPrivacity = () => {
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
                title="Política de Privacidad"
                date="20 de enero de 2025"
                generalDescription="En MIAcademia, nos comprometemos a proteger la privacidad y seguridad de nuestros usuarios. Estas políticas de privacidad explican cómo recopilamos, usamos, almacenamos y compartimos la información de los usuarios que interactúan con nuestra plataforma. Al utilizar nuestra web, aceptas las prácticas descritas en esta política."
                sectionsList={[
                    {
                        title: 'Información que recopilamos',
                        description: 'Recopilamos los siguientes tipos de información:',
                        contentSections: [
                            {
                                title: 'Información Personal Proporcionada por el Usuario',
                                list: [
                                    'Nombre, correo electrónico y otra información de contacto cuando te registras o te pones en contacto con nosotros.',
                                    'Respuestas en el test vocacional y cualquier otra información proporcionada a través de formularios.'
                                ]
                            },
                            {
                                title: 'Información Automática',
                                list: [
                                    'Datos de navegación como dirección IP, tipo de dispositivo, sistema operativo y navegadores utilizados.',
                                    'Historial de interacciones dentro de la plataforma (consultas realizadas, clics, tiempo de permanencia, etc.).'
                                ]
                            },
                            {
                                title: 'Cookies y Tecnologías Similares',
                                description: 'Usamos cookies para mejorar tu experiencia de navegación, personalizar contenido y analizar el tráfico en nuestra plataforma. Puedes gestionar las cookies desde la configuración de tu navegador.'
                            }
                        ]
                    },
                    {
                        title: 'Cómo Usamos Tu Información',
                        description: 'Utilizamos la información recopilada para los siguientes fines:',
                        contentSections: [
                            {
                                description: 'Personalizar y mejorar tu experiencia en la plataforma.'
                            },
                            {
                                description: 'Procesar tus respuestas en el test vocacional y generar recomendaciones personalizadas.'
                            },
                            {
                                description: 'Comunicarnos contigo para informarte sobre actualizaciones, promociones o soporte técnico.'
                            },
                            {
                                description: 'Analizar y mejorar la funcionalidad de nuestra plataforma.'
                            },
                            {
                                description: 'Cumplir con requisitos legales o normativos.'
                            }
                        ]
                    },
                    {
                        title: 'Cómo Compartimos Tu Información',
                        description: 'No vendemos ni alquilamos tu información personal a terceros. Sin embargo, podríamos compartirla en los siguientes casos:',
                        contentSections: [
                            {
                                description: 'Con proveedores de servicios: Empresas que nos ayudan a operar nuestra plataforma, como servicios de almacenamiento en la nube o análisis de datos.'
                            },
                            {
                                description: 'Con socios académicos: Compartiremos datos anonimizados con instituciones educativas para propósitos estadísticos o de colaboración.'
                            },
                            {
                                description: 'Por razones legales: Cuando sea necesario para cumplir con obligaciones legales, proteger nuestros derechos o prevenir fraudes.'
                            }
                        ]
                    },
                    {
                        title: 'Tus Derechos y Opciones',
                        description: 'Como usuario, tienes los siguientes derechos respecto a tu información personal:',
                        contentSections: [
                            {
                                description: 'Acceso y Corrección: Puedes solicitar acceso a los datos personales que tenemos sobre ti y corregir cualquier error.'
                            },
                            {
                                description: 'Eliminación: Puedes pedirnos que eliminemos tu información personal, salvo cuando estemos obligados a conservarla por ley.'
                            },
                            {
                                description: 'Optar por No Recibir Comunicaciones: Puedes desactivar las comunicaciones promocionales en cualquier momento.'
                            },
                            {
                                description: 'Portabilidad de Datos: Solicitar que te proporcionemos tus datos en un formato estructurado.'
                            }
                        ],
                        finalText: 'Para ejercer estos derechos, contáctanos a: [Correo Electrónico de Contacto]'
                    },
                    {
                        title: 'Seguridad de la Información',
                        description: 'Implementamos medidas técnicas y organizativas para proteger tu información contra accesos no autorizados, pérdidas o alteraciones. Sin embargo, recuerda que ningún sistema de seguridad es infalible.'
                    },
                    {
                        title: 'Retención de Datos',
                        description: 'Conservaremos tu información personal solo durante el tiempo necesario para cumplir con los propósitos descritos en esta política, salvo que la ley requiera o permita un periodo de retención más largo.'
                    },
                    {
                        title: 'Enlaces a Sitios de Terceros',
                        description: 'Nuestra plataforma puede contener enlaces a otros sitios web. No somos responsables de las prácticas de privacidad de dichos sitios y te recomendamos revisar sus políticas de privacidad.'
                    },
                    {
                        title: 'Cambios a Esta Política',
                        description: 'Podemos actualizar esta política de privacidad para reflejar cambios en nuestras prácticas o por razones legales. Te notificaremos sobre cambios importantes a través de la plataforma o por correo electrónico.'
                    },
                    {
                        title: 'Contacto',
                        description: 'Si tienes preguntas o inquietudes sobre nuestra política de privacidad, contáctanos en:',
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

export default PoliticsPrivacity
