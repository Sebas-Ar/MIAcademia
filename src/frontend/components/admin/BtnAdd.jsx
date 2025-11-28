const BtnAdd = ({ onClick }) => {
    return (
        <button className="btn-add-rule" type="button" onClick={onClick}>
            <svg viewBox="0 0 448 512" fill="currentColor">
                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
            </svg>
            <style jsx>{`
                .btn-add-rule {
                    display: grid;
                    place-items: center;
                    margin: 1.5em auto 0;
                    height: 2.5em;
                    width: 2.5em;
                    padding: .5em;
                    border-radius: 50%;
                    background-color: var(--yellow);
                    color: var(--white);
                    transition: transform .3s;
                }

                .btn-add-rule:hover {
                    transform: scale(1.1);
                }
            `}</style>
        </button>
    )
}

export default BtnAdd
