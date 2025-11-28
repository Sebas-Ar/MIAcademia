const AddOnsItem = ({ item }) => {
    return (
        <article className="add-on-item">
            <div className="wrapper-icon">
                {item.icon}
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>

            <style jsx>{`
                .add-on-item {
                    background: var(--transparent-gray);
                    padding: 2em;
                    border-radius: .5em;
                    display: grid;
                    gap: .5em;
                    justify-items: center;
                    max-width: 29em;
                }

                .wrapper-icon {
                    margin: .2em;
                    display: grid;
                    place-items: center;
                    height: 4.5em;
                    width: 4.5em;
                    background: ${item.iconBackgroundColor};
                    color: var(--white);
                    border-radius: 50%;
                }

                h3 {
                    font-size: 1.6em;
                    font-weight: 600;
                }

                p {
                    margin: 0;
                    color: var(--dark-gray);
                    font-weight: 600;
                }
            `}</style>
        </article>
    )
}

export default AddOnsItem
