import AddOnsItem from './AddOnsItem'

const AddOnsItems = ({ items }) => {
    return (
        <div className="add-ons-items">
            {items.map((item, index) => (
                <AddOnsItem key={index} item={item} />
            ))}

            <style jsx>{`
                .add-ons-items {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 2em;
                    padding: 2em;
                    text-align: center;
                }
            `}</style>
        </div>
    )
}

export default AddOnsItems
