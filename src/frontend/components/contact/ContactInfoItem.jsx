const ContactInfoItem = ({ icon, text }) => {
    return (
        <li>
            <div className="wrapper-icon">
                {icon}
            </div>
            <span>{text}</span>

            <style jsx>{`
                li {
                    display: flex;
                    align-items: center;
                    gap: ${text ? '1em' : '0'};
                }

                .wrapper-icon {
                    display: grid;
                }
            `}</style>
        </li>
    )
}

export default ContactInfoItem
