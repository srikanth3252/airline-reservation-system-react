import "../styles/popuppage.css";

function Popup(props)
{
    const
    {
        title,
        message,
        popupType,
        onProceed
    } = props;

    return(
        <div className="popup-overlay">

            <div className="popup-box">

                <div className={`popup-icon ${popupType}`}>

                    {
                        popupType==="success" ? "✅" :

                        popupType==="error" ? "❌" :

                        popupType==="warning" ? "⚠️" :

                        "ℹ️"
                    }

                </div>

                <h2> {title}</h2>
                <p>{message} </p>
                <button
                    type="button"
                    className="popup-btn"
                    onClick={onProceed}
                >
                    Proceed
                </button>

            </div>

        </div>
    );
}

export default Popup;