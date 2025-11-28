import { Search, TestTube, UserCheck } from 'lucide-react'
import AboutServiceItem from './AboutServiceItem'

const { default: AboutSubtitle } = require('./AboutSubtitle')

const AboutServices = () => {
    return <section>
        <AboutSubtitle
            subtitle="Nuestros servicios"
            description="Herramientas innovadoras para tu futuro académico"
        />
        <div className="wrapper-services">
            <AboutServiceItem
                icon={<Search strokeWidth=".16em" size="55%" />}
                title="MIA"
                subtitle="Motor de Inteligencia Académica"
                description="El corazón de nuestra plataforma. Un motor de búsqueda inteligente que permite explorar **más de 16.000 programas académicos** disponibles en Colombia. Información clave como precio, duración, modalidad y ubicación, todo en un solo lugar"
                backgroundColor='var(--yellow)'
                iconBackgroundColor='var(--dark-yellow)'
            />
            <AboutServiceItem
                icon={<TestTube strokeWidth=".16em" size="55%" />}
                title="Test vocacional de Holland"
                subtitle="Modelo RIASEC"
                colorSubtitle='var(--white)'
                description="Basado en el reconocido modelo de John Holland, identifica tus intereses profesionales y los clasifica en **seis tipos de personalidad vocacional**. Los resultados se conectan directamente con programas académicos reales"
                backgroundColor='var(--blue)'
                iconBackgroundColor='var(--dark-blue)'
                textColor='var(--white)'
            />
            <AboutServiceItem
                icon={<UserCheck strokeWidth=".16em" size="55%" />}
                title="Asesoría vocacional profesional"
                subtitle='Personalizada'
                colorSubtitle='var(--white)'
                description="Acompañamiento personalizado con **psicólogos expertos en orientación vocacional**:"
                backgroundColor='var(--gray)'
                iconBackgroundColor='var(--dark-gray)'
                subItemList={[
                    {
                        title: 'Diagnóstico',
                        description: 'Revisión puntual de intereses y opciones'
                    },
                    {
                        title: 'Plan grupal',
                        description: 'Sesiones colaborativas en pequeños grupos'
                    },
                    {
                        title: 'Asesoría profunda',
                        description: 'Proceso individual integral y personalizado'
                    }
                ]}
            />
        </div>

        <style jsx>{`
            section {
                background: var(--light-blue);
                margin-top: 2em;
                display: grid;
                gap: 2em;
                padding: 5em 3em;
            }

            .wrapper-services {
                display: grid;
                gap: 2em;
                margin-inline: auto;
                margin-top: 2em;
            }
        `}</style>
    </section>
}

export default AboutServices
