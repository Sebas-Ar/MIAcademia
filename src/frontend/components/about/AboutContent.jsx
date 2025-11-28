import Cat from '../decoration/Cat'
import AboutHero from './AboutHero'
import AboutMotivation from './AboutMotivation'
import AboutServices from './AboutServices'
import AboutValues from './AboutValues'
import AboutVision from './AboutVision'
import AboutWhoWeAre from './AboutWhoWeAre'

const AboutContent = () => {
    return <div className="wrapper-content">
        <AboutHero />
        <AboutWhoWeAre />
        <AboutServices />
        <AboutMotivation />
        <AboutValues />
        <AboutVision />

        <Cat />

        <style jsx>{`
            .wrapper-content {
                background: white;
                position: relative;
            }
        `}</style>
    </div>
}

export default AboutContent
