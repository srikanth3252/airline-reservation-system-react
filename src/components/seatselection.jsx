
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/seatselection.css";
import { useLocation } from "react-router-dom";

function Seatselection()
{  
     const location=useLocation()
    const {flight,travelClass,noofpeople,ticketprice,availableSeats}=location.state;
    const navigate=useNavigate();
    const [passengerexceedpop,setpassengerexceedpop]=useState(false);
    const [popup, setPopup] = useState({
    show: false,
    seat: "",
    status: ""
    });
    const[showselectedseat,setshowselectedseat]=useState({
      show: false,
      seats: [] 
    });
    const [bookedseats, setbookedseats] = useState([]);

useEffect(() => {

    async function getBookedSeats() {
        try {
            let res = await fetch("http://airline-backend-zdo5.onrender.com:814/get_bookedseats",{
                    
                method:"POST",
                headers:
                {
                      "Content-Type":"application/json"
                },
                body:JSON.stringify({travelClass:travelClass})
            });

            let data = await res.json();

            console.log(data.message);

            setbookedseats(data.seats);
            
        }
        catch (err) 
        {
            console.log(err)
        }
    }

    getBookedSeats();

}, []);

    const alpha=['A','B','C','D','E','F'];

    const seats = Array.from({ length: availableSeats});

    async function checkstatusofseat(seatnumber)
    {

        async function get_seat_status() 
        {
            let res=await fetch("http://airline-backend-zdo5.onrender.com:814/get_seat_status",{

                method:"post",
                headers:
                {
                     "Content-Type":"application/json"
                },
                body:JSON.stringify({seatnumber:seatnumber})
            });

            let data=await res.json();
            return data;
        }
        try
        {
            let res=await get_seat_status();
            
            setPopup({
                show: true,
                seat: seatnumber,
                status: res.status
            });

        }
        catch(error)
        {
            console.log(error);
        }
    }

 function handleseatselection(seatNo)
{
    // Remove seat if already selected
    if(showselectedseat.seats.includes(seatNo))
    {
        setshowselectedseat({
            show: true,
            seats: showselectedseat.seats.filter(
                seat => seat !== seatNo
            )
        });
        return;
    }

    // Maximum seats reached
    if(showselectedseat.seats.length >= Number(noofpeople))
    {
        setpassengerexceedpop(true);
      
        return;
    }

    // Add new seat
    setshowselectedseat({
        show: true,
        seats: [...showselectedseat.seats, seatNo]
    });
}
    function hanldenavigation(seats)
    {
       navigate("/passengerdetails",{
        state:{
            flight:flight,
            travelClass:travelClass,
            noofpeople:noofpeople,
            ticketprice:ticketprice,
            seats:seats
        }
       })
    }

    useEffect(() => {
    if (passengerexceedpop)
        document.body.style.overflow = "hidden";
    else
        document.body.style.overflow = "auto";

    return () => {
        document.body.style.overflow = "auto";
    };
}, [passengerexceedpop]);

    return(
        <section className="seatselection">
                
               {
    passengerexceedpop && (
        <div className="popup-overlay">

            <div className="passengerexceedpop">

                <h1>⚠️ Maximum Seat Limit Reached</h1>

                <p>
                    You have already selected {noofpeople} seat(s).
                    Please deselect a seat to choose another.
                </p>

                <button onClick={() => setpassengerexceedpop(false)}>
                    OK
                </button>

            </div>

        </div>
    )
}

                {
                popup.show && (
                    <div className="seat-popup">
                    <h4>{popup.seat}</h4>
                    <p>
                    {popup.status === "available"
                        ? "🟢 Available"
                        : "🔴 Booked"}
                     </p>
                    </div>
                )}

              <h1 className="h12">✈ Vinayaka SkyWings</h1>
              <div className="flex-row">
                  
                <div className="flightdetails">
                       <h2>{flight.airline_name}</h2>

                    <div className="route">
                        <h3>{flight.from_city}</h3>
                        <h3>✈</h3>
                        <h3>{flight.to_city}</h3>
                    </div>

                    <p><strong>Date:</strong> {new Date(flight.departure_date).toLocaleDateString("en-IN")}</p>
                    <p><strong>Departure:</strong> {flight.departure_time}</p>
                    <p><strong>Arrival:</strong> {flight.arrival_time}</p>
                    <p><strong>Travel Class:</strong> {travelClass}</p>
                    <p><strong>Price:</strong> ₹{ticketprice}</p>

                </div>
                
                <div className="legend">
                      <h1>Seat Legend</h1>

                      <div className="legend-items">
                          <div className="box Available"></div>
                          <span>Available</span>
                      </div>

                      <div className="legend-items">
                          <div className=" box Selected"></div>
                          <span>Selected</span>
                      </div>
                      
                      <div className="legend-items">
                         <div className="box Booked"></div>
                         <span>Booked</span>
                      </div>

                </div>
            </div>

            <div className="grid-flex">
                <div className="heading">
                    <h1>Choose Your Seat</h1>
                    <p>The seats shown below belong to the {travelClass} class. Please select your seats from this class. If you wish to travel in a different class, go back and choose another travel class.</p>
                </div>
                 <div className="form-flex">

                    <div className="cockpit">
                            Cockpit
                    </div>
                    <div
                        className=
                        {
                            travelClass === "Economy"
                                ? "economy-grid"
                                 : travelClass === "Business"
                                    ? "business-grid"
                                    : travelClass === "Premium Economy"
                                        ? "premium-grid"
                                            : "firstclass-grid"
                        }>

                       {
                        travelClass==="Economy" &&
                        <>
                              {
                                seats.map((seat, i)=>{
                                    const seatNo = `${alpha[i % 6]}${Math.floor(i / 6) + 1}`;
                                    const isBooked = bookedseats.includes(seatNo);
                                    const isSelected = showselectedseat.seats.includes(seatNo);
                                    return(
                                        <button 
                                         key={seatNo}
                                        className="seat-btn" onMouseEnter={()=>checkstatusofseat(seatNo)}
                                                onMouseLeave={() =>setPopup({show: false,seat: "", status: ""})}
                                                onClick={()=>{
                                                     if(bookedseats.includes(seatNo))
                                                        return ;
                                                    handleseatselection(seatNo)}}
                                                style={{
                                                    backgroundColor: isBooked
                                                                    ? "green"
                                                                    : isSelected
                                                                    ? "blue"
                                                                    : "white",

                                                    color: isBooked || isSelected
                                                            ? "white"
                                                            : "black"
                                                    }}
                                        >
                                             {seatNo}
                                        </button>
                                    );
                                })
                              }
                        </>
                       }
                       {
                        travelClass==="Premium Economy" &&
                        <>
                              {
                                seats.map((seat, i)=>{
                                    const seatNo = `${alpha[i % 4]}${Math.floor(i / 4) + 1}`;
                                    const isBooked = bookedseats.includes(seatNo);
                                    const isSelected = showselectedseat.seats.includes(seatNo);
                                    return(
                                        
                                        <button 
                                        key={seatNo}
                                        className="seat-btn" onMouseEnter={()=>checkstatusofseat(seatNo)}
                                                onMouseLeave={() =>setPopup({show: false,seat: "", status: ""})}
                                                onClick={()=>{handleseatselection(seatNo)}}
                                                style={{
                                                    backgroundColor: isBooked
                                                                    ? "green"
                                                                    : isSelected
                                                                    ? "blue"
                                                                    : "white",

                                                    color: isBooked || isSelected
                                                            ? "white"
                                                            : "black"
                                                    }}
                                        >
                                            {seatNo}
                                        </button>
                                    );
                                })
                              }
                        </>
                       }
                       {
                        travelClass==="Business" &&
                        <>
                              {
                                seats.map((seat, i)=>{
                                    const seatNo = `${alpha[i % 4]}${Math.floor(i / 4) + 1}`;
                                    const isBooked = bookedseats.includes(seatNo);
                                    const isSelected = showselectedseat.seats.includes(seatNo);
                                    return(
                                        <button 
                                        key={seatNo}
                                        className="seat-btn" onMouseEnter={()=>checkstatusofseat(seatNo)}
                                                onMouseLeave={() =>setPopup({show: false,seat: "", status: ""})}
                                                onClick={()=>{handleseatselection(seatNo)}}
                                                style={{
                                                    backgroundColor: isBooked
                                                                    ? "green"
                                                                    : isSelected
                                                                    ? "blue"
                                                                    : "white",

                                                    color: isBooked || isSelected
                                                            ? "white"
                                                            : "black"
                                                    }}
                                        >
                                            {seatNo}
                                        </button>
                                    );
                                })
                              }
                        </>
                       }
                       {
                        travelClass==="First Class" &&
                        <>
                              {
                                seats.map((seat, i)=>{
                                    const seatNo = `${alpha[i % 2]}${Math.floor(i / 2) + 1}`;
                                    const isBooked = bookedseats.includes(seatNo);
                                    const isSelected = showselectedseat.seats.includes(seatNo);
                                    return(
                                        <button 
                                        key={seatNo}
                                        className="seat-btn" onMouseEnter={()=>checkstatusofseat(seatNo)}
                                                onMouseLeave={() =>setPopup({show: false,seat: "", status: ""})}
                                                onClick={()=>{handleseatselection(seatNo)}}
                                                style={{
                                                    backgroundColor: isBooked
                                                                    ? "green"
                                                                    : isSelected
                                                                    ? "blue"
                                                                    : "white",

                                                    color: isBooked || isSelected
                                                            ? "white"
                                                            : "black"
                                                    }}
                                        >
                                            {seatNo}
                                        </button>
                                    );
                                })
                              }
                        </>
                       }

                </div>
                    <div className="tail">
                            Tail
                        </div>
                 </div>
                
                {
                     showselectedseat.seats.length > 0 &&
                      <div className="selected-seat">
                           <h1>your selected seat details</h1>
                           <h2>travelClass:{travelClass}</h2>
                           <p>
                                Selected Seats :
                                {showselectedseat.seats.join(", ")}
                            </p>
                           <p>Total Price : ₹{ticketprice * showselectedseat.seats.length}</p>
                           <div className="selected-seat-button">
                                <button
    className="b1"
    onClick={() =>
        setshowselectedseat({
            show: false,
            seats: []
        })
    }
>
    Cancel
</button>
                                <button className="b2" onClick={()=>{hanldenavigation(showselectedseat.seats)}}>bookseat</button>
                           </div>
                      </div>

                }

            </div>
           
        </section>
    );
}

export default Seatselection;