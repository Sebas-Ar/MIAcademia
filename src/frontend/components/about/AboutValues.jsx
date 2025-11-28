import { Accessibility, Eye, Heart, RotateCcw, Shield } from 'lucide-react'
import AboutTool from './AboutTool'

const { default: AboutSubtitle } = require('./AboutSubtitle')

const AboutValues = () => {
    return <section>
        <AboutSubtitle
            subtitle="Nuestros valores"
            description="Los principios que guían cada decisión que tomamos"
        />

        <div className="values-wrapper">
            <AboutTool
                titlte="Transparencia"
                description="Mostramos información real, actualizada y sin adornos innecesarios"
                icon={<Eye strokeWidth=".16em" size="55%" />}
                border=".1em solid var(--light-gray)"
                iconBackground="var(--transparent-dark-gray)"
                titleColor="var(--transparent-dark-gray)"
                textColor='var(--dark-blue)'
            />
            <AboutTool
                titlte="Empatía"
                description="Entendemos que cada persona tiene una historia única, por eso nos adaptamos a diferentes necesidades"
                icon={<Heart strokeWidth=".16em" size="55%" />}
                border=".1em solid var(--light-gray)"
                iconBackground="var(--yellow)"
                titleColor="var(--yellow)"
                textColor='var(--dark-blue)'
            />
            <AboutTool
                titlte="Accesibilidad"
                description="Nuestra plataforma es gratuita, abierta y pensada para todos, sin barreras"
                icon={<Accessibility strokeWidth=".16em" size="55%" />}
                border=".1em solid var(--light-gray)"
                iconBackground="var(--blue)"
                titleColor="var(--blue)"
                textColor='var(--dark-blue)'
            />
            <AboutTool
                titlte="Responsabilidad"
                description="Nos tomamos en serio el impacto de nuestras recomendaciones. Trabajamos con criterio y ética profesional"
                icon={<Shield strokeWidth=".16em" size="55%" />}
                border=".1em solid var(--light-gray)"
                iconBackground="var(--dark-blue)"
                titleColor='var(--dark-blue)'
                textColor='var(--dark-blue)'
            />
            <AboutTool
                titlte="Evolución"
                description="Estamos en mejora constante. Escuchamos, aprendemos y evolucionamos junto a nuestros usuarios"
                icon={<RotateCcw strokeWidth=".16em" size="55%" />}
                border=".1em solid var(--light-gray)"
                iconBackground="var(--dark-yellow)"
                titleColor='var(--dark-yellow)'
                textColor='var(--dark-blue)'
            />
        </div>

        <style jsx>{`
            section {
                display: grid;
                gap: 2em;
                padding: 5em 3em 0;
            }

            .values-wrapper {
                display: flex;
                gap: 2em;
                justify-content: center;
                flex-wrap: wrap;
                padding: 2em 0;
                margin: auto;
            }
        `}</style>
    </section>
}

export default AboutValues
