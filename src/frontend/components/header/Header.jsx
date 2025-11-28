import Line from '../decoration/Line'
import PawCat from '../decoration/PawCat'
import Nav from '../navigation/Nav'
import Description from './Description'
import Logo from './Logo'
import Subtitle from './Subtitle'

const Header = ({
    disableBackground = false,
    isChatEnabled = false,
    hideName = false,
    programMode = false,
    showSubtitle = true,
    showDescription = true,
    fixLine = false,
    showLine = true,
    showNav = true,
    mColor = 'var(--white)',
    backgroundColor = 'var(--yellow)',
    showBorder = false,
    isMIAMessageActive = false
}) => {
    return <header>

        <Logo
            hideName={hideName}
            isChatEnabled={isChatEnabled}
            programMode={programMode}
            mColor={mColor}
            isMIAMessageActive={isMIAMessageActive}
        />

        {showSubtitle &&
            <Subtitle
                isChatEnabled={isChatEnabled}
                programMode={programMode}
            />}

        {showDescription &&
            <Description
                isChatEnabled={isChatEnabled}
                programMode={programMode}
            />}

        {showLine &&
            <Line
                isChatEnabled={isChatEnabled}
                fixLine={fixLine}
            />}

        {showNav &&
            <Nav
                programMode={programMode}
                isChatEnabled={isChatEnabled}
            />}

        <PawCat />
        <style jsx>{`
            header {
                padding-top: ${isChatEnabled || programMode ? '1em' : '3em'};
                padding-bottom: ${isChatEnabled || programMode ? '.5em' : '0'};
                background-color: ${disableBackground ? 'unset' : backgroundColor};
                border-bottom: ${showBorder ? '.1em solid var(--dark-blue)' : 'unset'};
                position: relative;
                view-transition-name: main-header;
                display: grid;
                transition: padding 1s;
                z-index: 111111111;
            }
        `}</style>
    </header>
}

export default Header
