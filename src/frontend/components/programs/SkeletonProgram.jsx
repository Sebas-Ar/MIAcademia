'use client'

const SkeletonProgram = () => {
    const tagList = [
        {
            propertyName: 'tipo de institución',
            propertyValue: ''
        },
        {
            propertyName: 'sector',
            propertyValue: ''
        }
    ]

    return <>
        <header className="background-light">
            <div className="yellow-bar">
                <div className="wrapper-btn-favorite">
                </div>
            </div>

            <div className="institute-img">
                <span className="loader"></span>
            </div>

            <h1></h1>

            <ul className="tag-list">
                {
                    tagList.map((tag, index) => (
                        <li className="tag" key={index}>
                            <span className="property">
                                {tag.propertyName}
                            </span>
                            <span className="value">
                                {tag.propertyValue}
                            </span>
                        </li>
                    ))
                }

            </ul>

            <div className="line"></div>

            <h2></h2>

            <style jsx>{`
                .background-light {
                    z-index: 1;
                    margin: 0 1em;
                    padding: 0 1em;
                    padding-bottom: 7em;
                    padding-top: 1.4em;
                    display: grid;
                    gap: 2em;
                    justify-items: center;
                    background: var(--light-green);
                    transition: padding 1s, opacity 1s, background 1s;
                    position: relative;
                    border-top: 1em solid white;
                    border-radius: 2em 2em 2em 2em;
                }

                @keyframes wave-background {
                    0%, 100% {
                        background: var(--gray);
                    }
                    50% {
                        background: var(--light-gray);
                    }
                }

                .institute-img {
                    object-fit: contain;
                    display: grid;
                    place-items: center;
                    background: white;
                    border-radius: 2em;
                    border: 0.5em solid var(--gray);
                    height: 10em;
                    width: 10em;
                    padding: 0.5em;
                    opacity: 1; 
                    transition: border 1s .5s,
                        height 1s .5s,
                        padding 1s .5s,
                        opacity 1s .5s;
                    z-index: 10;
                    animation: wave-border 1s linear infinite;
                }

                @keyframes wave-border {
                    0%, 100% {
                        border-color: var(--gray);
                    }
                    50% {
                        border-color: var(--light-gray);
                    }
                }
                

                .yellow-bar {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 4em;
                    width: 100%;
                    background: var(--gray);
                    border-radius: 2em 2em 0 0;
                    transition: height 1s .7s;
                    animation: wave-background 1s linear infinite;
                }

                .wrapper-btn-favorite {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(6em, -50%);
                }


                h1 {
                    max-width: 20em;
                    font-size: 1.9em;
                    opacity: 1;
                    text-transform: uppercase;
                    text-align: center;
                    font-weight: 400;
                    transition: font-size 1s, opacity 1s 1s;
                    background: var(--gray);
                    height: 1.4em;
                    width: 100%;
                    border-radius: .5em;
                    animation : wave 1s linear infinite;
                    animation-delay: .1s;
                }

                @keyframes wave {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: .1;
                    }
                }

                .tag-list {
                    gap: .5em;
                    margin-top: -1.5em;;
                    color: var(--gray);
                    animation: wave 1s linear infinite;
                    animation-delay: .2s;
                }

                .tag .property {
                    font-size: .7em;
                    font-weight: 700;
                    margin-bottom: .1em;
                }

                .tag .value {
                    font-size: .8em;
                    padding: .4em 1.4em';
                    height: 1em;
                }

                .tag-list {
                    display: grid;
                    text-transform: capitalize;
                    transition: gap 1s, margin 1s;
                }

                .tag {
                    text-align: center;
                    display: grid;
                    justify-content: center;
                }

                .tag .property {
                    font-weight: 700;
                    transition: font-size 1s, margin 1s;
                }

                .tag .value {
                    font-weight: 500;
                    border: .2em solid var(--yellow);
                    background-color: var(--transparent-yellow);
                    border-radius: 2em;
                    height: 2em;
                    transition: font-size 1s, padding 1s;
                    animation: wave 1s linear infinite;
                    animation-delay: .2s;
                }

                .line {
                    height: .15em;
                    max-width: 13em;
                    width: 50%;
                    border-radius: 1em;
                    background: var(--gray);
                    opacity: 1; 
                    transition: height 1s, margin 1s, opacity 1s;
                    animation: wave 1s linear infinite;
                    animation-delay: .3s;
                }

                h2 {
                    font-size: 1.7em;
                    opacity: 1; 
                    transition: font-size 1s, opacity 1s;
                    font-weight: 500;
                    text-transform: capitalize;
                    max-width: 30em;
                    text-align: center;
                    height: 1.4em;
                    width: 100%;
                    border-radius: .5em;
                    background: var(--gray);
                    animation : wave 1s linear infinite;
                    animation-delay: .3s;
                }

                .loader {
                    width: 48px;
                    height: 48px;
                    border: 5px solid var(--gray);
                    border-radius: 50%;
                    display: block;
                    box-sizing: border-box;
                    position: relative;
                    animation: pulse 1s linear infinite;
                }
                .loader:after {
                    content: '';
                    position: absolute;
                    width: 48px;
                    height: 48px;
                    border: 5px solid var(--gray);
                    border-radius: 50%;
                    display: inline-block;
                    box-sizing: border-box;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    animation: scaleUp 1s linear infinite;
                }

                @keyframes scaleUp {
                    0% { transform: translate(-50%, -50%) scale(0) }
                    60% , 100% { transform: translate(-50%, -50%)  scale(1)}
                }
                @keyframes pulse {
                    0% , 60% , 100%{ transform:  scale(1) }
                    80% { transform:  scale(1.2)}
                }

            `}</style>
        </header>

        <section className="program-info">
            <h3>
                <span className="price">

                </span>
            </h3>

            <div className="description">
            </div>
            <ul>
                <li className="item">
                    <div className="wrapper-info-item">
                        <strong></strong>
                        <p></p>
                    </div>
                </li>
                <li className="item">
                    <div className="wrapper-info-item">
                        <strong></strong>
                        <p></p>
                    </div>
                </li>
                <li className="item">
                    <div className="wrapper-info-item">
                        <strong></strong>
                        <p></p>
                    </div>
                </li>
                <li className="item">
                    <div className="wrapper-info-item">
                        <strong></strong>
                        <p></p>
                    </div>
                </li>
                <li className="item">
                    <div className="wrapper-info-item">
                        <strong></strong>
                        <p></p>
                    </div>
                </li>
                <li className="item">
                    <div className="wrapper-info-item">
                        <strong></strong>
                        <p></p>
                    </div>
                </li>
            </ul>

            <div className="wrapper-link-institute">
                <div className="link">
                </div>
            </div>

            <style jsx>{`
                
                .program-info {
                    display: grid;
                    justify-items: center;
                    position: relative;
                }

                h3 {
                    z-index: 10;
                    background-color: var(--dark-yellow);
                    position: relative;
                    margin: 0 .5em;
                    font-size: 3em;
                    font-weight: 800;
                    padding: .5em 1em;
                    border-radius: 3em;
                    position: relative;
                    opacity: 1;
                    text-transform: uppercase;
                    text-align: center;
                    transition: font-size 1s, padding 1s, box-shasow 1s, opacity 1s;
                    min-width: 8em;
                    height: 2.5em;
                    animation: wave 1s linear infinite;
                    animation-delay: .4s;
                    transform: translateY(-50%);
                }

                @keyframes wave {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: .1;
                    }
                }

                h3:before {
                    background: var(--yellow);
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 3em;
                    top: -.13em;
                    left: -.13em;
                    z-index: -1;
                }

                .price {
                    display: block;
                    position: relative;
                    top: -.13em;
                }

                .undefined-price {
                    position: relative;
                    bottom: .13em;
                    font-size: .6em;
                    text-transform: capitalize;
                }

                .time {
                    position: absolute;
                    font-size: .3em;
                    top: 75%;
                    right: 1em;
                    font-weight: 600;
                    white-space: nowrap;
                }

                @media (width < 630px) {
                    h3 {
                        font-size: 2.5em;
                    }
                }

                .description {
                    margin: 0 3em 4em;
                    font-size: 1em;
                    opacity: 1;
                    max-width: 50em;
                    text-align: justify;
                    text-align-last: center;
                    transition: margin 1s, font-size 1s 1s ease, opacity 1s;
                    height: 8em;
                    background: var(--gray);
                    min-width: 26em;
                    border-radius: .5em;
                    animation: wave 1s linear infinite;
                    animation-delay: .5s;
                    width: 100%;
                }

                ul {
                    max-width: 50em;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 3em;
                    margin: 0em 4em 3em;
                    opacity: 1;
                    position: relative;
                    transition: gap 1s, margin 1s, opacity 1s;
                    animation: wave 1s linear infinite;
                    animation-delay: .5s;
                }

                .item {
                    position: relative;
                    background-color: var(--light-gray);
                    font-size: 1em;
                    padding: 1.3em 3em 1.3em 2.2em;
                    border-radius: 1em;
                    display: grid;
                    align-items: center;
                    position: relative;
                    height: 4em;
                    width: 12em;
                }

                .wrapper-link-institute {
                    padding: 0 2em;
                    margin-bottom: 3em;
                }

                .link {
                    font-weight: 600;
                    font-size: 1em;
                    background: var(--yellow);
                    padding: 1em 3em;
                    display: block;
                    margin: auto;
                    border-radius: 5em;
                    transition: transform .3s;
                    cursor: pointer;
                    transition: font-size 1s, padding 1s, margin 1s, transform .3;
                    height: 3.5em;
                    width: 12em;
                    animation: wave 1s linear infinite;
                    animation-delay: .6s;
                }

            `}</style>
        </section>
    </>
}

export default SkeletonProgram
