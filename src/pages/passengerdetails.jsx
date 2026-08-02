import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/passengerdetails.css";
import Passenger_card from "../components/passenger-card.jsx";

function Passenger_details()
{
    const navigate = useNavigate();
    const location = useLocation();
    const [showpop,setshowpop]=useState(false);
    const [viewSummary, setViewSummary] = useState(false);
    const {
        flight,
        travelClass,
        noofpeople,
        ticketprice,
        seats
    } = location.state;

    const [passengers, setPassengers] = useState(
        Array.from({ length: Number(noofpeople) }, () => ({
            name: "",
            age: "",
            gender: ""
        }))
    );

    const [phonenumber, setphonenumber] = useState("");
    const [email, setemail] = useState("");

    localStorage.setItem("email",email);
    localStorage.setItem("number",phonenumber);
    localStorage.setItem("details",JSON.stringify(passengers));

    const userid = localStorage.getItem("userid");

    useEffect(() => {

        async function handleemail() {

            try {

                const res = await fetch("https://airline-backend-zdo5.onrender.com/get_email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userid })
                });

                const data = await res.json();

                console.log(data.message);

                if (data.email) {
                    setemail(data.email);
                }
                if(data.id)
                {
                    console.log(data.id);
                    localStorage.setItem("id",data.id);
                }

            } catch (err) {
                console.log(err);
            }
        }

        handleemail();

    }, [userid]);
    
    const[missinginfo,setmissinginfo]=useState([]);

    useEffect(() => {
        if (showpop) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }

    return () => {
        document.body.style.overflow = "auto";
    };
}, [showpop]);
    async function handlesubmit()
    {
            let temp = passengers.map(person => ({
                        name: person.name === "" ,
                        age: person.age === "",
                        gender: person.gender === ""
                        }));

        const hasMissing = temp.some(person =>
                person.name || person.age || person.gender
        );

        if (hasMissing || phonenumber === "") {
            
            setshowpop(true);
            setmissinginfo(temp);
            return ;
        }
        


            navigate("/payment",{
            state:{
                flight:flight,
                travelClass:travelClass,
                noofpeople:noofpeople,
                ticketprice:ticketprice,
                seats:seats
            }
        });
        
        
   }

    return (
        <section className="passengerdetails">

            {
                showpop &&
                <section className="showpop">
                    <div className="pop-layout">
                        <h1>please fill the below details before going to payment</h1>
                         {
                            missinginfo.map((data,index)=>
                            {
                                return(
                                    
                                        
                                           <section className="missing-details" key={index}>

                                                {
                                                    (data.name || data.age || data.gender) && (
                                                        <h3>Passenger {index + 1} details are missing:</h3>
                                                    )
                                                }

                                                {data.name && <p>• Name is missing</p>}

                                                {data.age && <p>• Age is missing</p>}

                                                {data.gender && <p>• Gender is missing</p>}

                                            </section>
                                        
                                );
                            })
                         }

                        {
                                phonenumber === "" && 
                                 <h1>number is missing</h1>
                        }

                        <button
                            onClick={() => setshowpop(false)}
                        >
                                OK
                        </button>
                    </div>
                </section>
            }
      
            <div className="details-box">

                <div className="head">
                    <h1>Enter Passenger Details</h1>
                    <p>Please enter all passenger details correctly.</p>
                </div>

                {
    passengers.map((person, index) => (
        <Passenger_card
            key={index}
            person={person}
            index={index}
            passengers={passengers}
            setPassengers={setPassengers}
        />
    ))
}

                <div className="passenger-card-flex1">
                    <label>Mobile Number:</label>

                    <input
                        type="tel"
                        value={phonenumber}
                        placeholder="Enter the mobile number"
                        onChange={(e) => setphonenumber(e.target.value)}
                    />
                </div>

                <div className="passenger-card-flex1">
                    <label>Email:</label>

                    <input
                        type="email"
                        value={email}
                        readOnly
                    />
                </div>
                {
    !viewSummary ?
    (
        <button
            className="summary-btn"
            onClick={() => setViewSummary(true)}
        >
            View Seat Summary
        </button>
    )
    :
    (
        <button
            className="summary-btn"
            onClick={() => setViewSummary(false)}
        >
            Hide Seat Summary
        </button>
    )
}

                <button className="continue-btn" onClick={handlesubmit}>
                    Continue to Payment
                </button>


                {
    viewSummary &&
    <div className="booking-summary">

        <h2>📋 Booking Summary</h2>

        <p><strong>Airline :</strong> {flight.airline_name}</p>

        <p>
            <strong>Route :</strong>
            {" "}
            {flight.from_city} → {flight.to_city}
        </p>

        <p>
            <strong>Date :</strong>
            {" "}
            {new Date(flight.departure_date).toLocaleDateString("en-IN")}
        </p>

        <p>
            <strong>Departure :</strong>
            {" "}
            {flight.departure_time}
        </p>

        <p>
            <strong>Travel Class :</strong>
            {" "}
            {travelClass}
        </p>

        <p>
            <strong>Selected Seat :</strong>
            {" "}
            {seats.join(", ")}
        </p>

        <p>
            <strong>Passengers :</strong>
            {" "}
            {noofpeople}
        </p>

        <p>
            <strong>Price / Passenger :</strong>
            ₹{ticketprice}
        </p>

        <h3>
            Total Amount :
            ₹{ticketprice * noofpeople}
        </h3>

    </div>
}

            </div>

        </section>
    );
}

export default Passenger_details;