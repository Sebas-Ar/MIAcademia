const BtnSubmit = ({
    loading = false,
    isFormUpdated = false
}) => {
    return (
        <button className="btn-save" type="submit">
            <div className="content-btn">
                                Save Config
                <svg className='icon-save' viewBox="0 0 448 512" fill="currentColor">
                    <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-242.7c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32L64 32zm0 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32L96 224c-17.7 0-32-14.3-32-32l0-64zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
                </svg>
                <svg className="gear" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
                </svg>
            </div>
            <style jsx>{`
                .btn-save {
                    font-size: 1em;
                    position: fixed;
                    right: ${isFormUpdated ? '-1em' : '-10em'};
                    top: ${isFormUpdated ? '7em' : '-10em'};
                    justify-content: center;
                    background-color: var(--yellow);
                    padding: 2.5em 1.8em 1.5em 0em;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: top .3s ease-in-out, right .3s ease-in-out;
                    animation: scale-move 8s infinite alternate;
                    z-index: 100;
                }

                .btn-save::before, .btn-save::after {
                    animation: scale-move 8s infinite alternate-reverse;
                }

                .btn-save::before, .btn-save::after {
                    content: '';
                    position: absolute;
                    background-color: var(--yellow);
                }

                .btn-save::before {
                    border-radius: 5em;
                    width: 5em;
                    height: 5em;
                    left: -20%;
                    bottom: 40%;
                }

                .btn-save::after {
                    border-radius: 5em;
                    top: 50%;
                    right: -10%;
                    height: 5em;
                    width: 5.5em;
                }

                .content-btn {
                    display: block;
                    color: var(--white);
                    font-weight: 600;
                    font-size: 1.7em;
                    transition: transform .3s;
                    width: 5.4em;
                    line-height: 1em;
                    text-align: right;
                    position: relative;
                    z-index: 1;
                    padding-right: .3em;
                }

                .btn-save:hover .content-btn {
                    transform: scale(1.05);
                }

                .gear {
                    height: ${loading ? '1em' : '0'};
                    position: absolute;
                    left: 1.6em;
                    top: 0em;
                    transition: transform .3s;
                    animation: ${loading ? 'rotate' : ''} 3s linear infinite;
                    transition: height .3s;
                }

                .icon-save {
                    height: ${loading ? '0' : '1em'};
                    position: absolute;
                    left: 1.65em;
                    top: .05em;
                }   

                @keyframes rotate {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                @keyframes scale-move {
                    0% {
                        transform: scale(1) translate(0, 0);
                        opacity: 1;
                    }
                    25% {
                        transform: scale(1.05) translate(-.2em, .1em);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.07) translate(-.1em, -.1em);
                        opacity: 1;
                    }
                    75% {
                        transform: scale(1.03) translate(.1em, -.3em);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1) translate(0, 0);
                        opacity: 1;
                    }
                }
            `}</style>
        </button>
    )
}

export default BtnSubmit
