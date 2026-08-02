
import {useNavigate} from "react-router-dom";
import "../styles/indexpage.css";

function Homepage()
{
    const navigate=useNavigate();

    return(
       <div className="homepage">

    <div className="flex2">
        <h1>Vinayaka SkyWings Airlines</h1>

        <button type="button" onClick={()=>{navigate("/loginpage")}}>Login</button>
    </div>

    <div className="flex1">

        <h2>Welcome to Vinayaka SkyWings Airlines</h2>

        <h2>
            Your journey begins with comfort, safety,
            and unforgettable experiences.
        </h2>

        <h2>
            Discover new destinations, create lasting
            memories, and travel with confidence.
        </h2>

        <p>
            Thank you for choosing us.
            Wishing you a pleasant and memorable journey.
        </p>

    </div>

</div>
    );
}

export default Homepage;