import { Brain, Code, MessageCircle, Palette } from 'lucide-react'
import AboutSubtitle from './AboutSubtitle'
import AboutTool from './AboutTool'

const AboutWhoWeAre = () => {
    return <section>

        <AboutSubtitle
            subtitle="¿Quiénes somos?"
            description="En MiAcademia creemos que toda persona merece orientación clara y confiable para decidir su futuro académico y profesional"
        />

        <div className="tools-wrapper">
            <AboutTool
                titlte="Tecnología"
                description="Creamos herramientas que hacen posible explorar y comparar miles de programas en segundos"
                icon={<Code strokeWidth=".16em" size="55%" />}
                backgroundColor="var(--transparent-yellow)"
                iconBackground="var(--yellow)"
                border=".2em solid var(--yellow)"
            />
            <AboutTool
                titlte="Diseño"
                description="Diseñamos una plataforma clara, amigable y pensada para todos los usuarios"
                icon={<Palette strokeWidth=".16em" size="55%" />}
                backgroundColor="var(--transparent-yellow)"
                iconBackground="var(--yellow)"
                border=".2em solid var(--yellow)"
            />
            <AboutTool
                titlte="Comunicación"
                description="Estructuramos mensajes que orientan y acompañan en el proceso de decisión"
                icon={<MessageCircle strokeWidth=".16em" size="55%" />}
                backgroundColor="var(--transparent-yellow)"
                iconBackground="var(--yellow)"
                border=".2em solid var(--yellow)"
            />
            <AboutTool
                titlte="Psicología"
                description="Brindamos orientación vocacional profesional para quienes buscan su camino"
                icon={<Brain strokeWidth=".16em" size="55%" />}
                backgroundColor="var(--transparent-yellow)"
                iconBackground="var(--yellow)"
                border=".2em solid var(--yellow)"
            />
        </div>

        <style jsx>{`
            section {
                margin-top: 2em;
                display: grid;
                gap: 2em;
                padding: 0 3em;
            }

            .tools-wrapper {
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

export default AboutWhoWeAre
