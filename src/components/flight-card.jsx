import { useState } from "react";
import "../styles/flight-card.css";
import Seatselection from "../components/seatselection.jsx";
import { useNavigate } from "react-router-dom";

function FlightCard({flight,travelClass,val})
{  
    const navigate=useNavigate();
    const [viewremainingseats,setviewremainingseats]=useState(false);
    let availableSeats = 0;
    let ticketprice;
        if(travelClass==="Economy")
        {
            availableSeats = flight.economy_seats;
            ticketprice=flight.economy_price;
        }
        else if(travelClass==="Premium Economy")
        {
            availableSeats = flight.premium_economy_seats;
            ticketprice=flight.premium_economy_price;
        }
        else if(travelClass==="Business")
        {
            availableSeats = flight.business_seats;
            ticketprice=flight.business_price;
        }
        else
        {
            availableSeats = flight.first_class_seats;
            ticketprice=flight.first_class_price;
        }
        const enoughSeats = availableSeats >= Number(val);
    return(
      <section className="FlightCard">

          <div className="FlightCard-box">
              
              <h1>{flight.airline_name}</h1>

              <div className="manage-route">
                   <h1>{flight.from_city}</h1>
                   <h1>{flight.to_city}</h1>
              </div>

              <div className="manage-dates">

              <div>
                <p>Departure Date</p>
                <h3>{new Date(flight.departure_date).toLocaleDateString("en-IN")}</h3>
              </div>

              <div>
                <p>Departure Time</p>
                <h3>{flight.departure_time}</h3>
              </div>

              <div>
                <p>Arrival Time</p>
                <h3>{flight.arrival_time}</h3>
              </div>

              </div>
              
              <div className="manage-class">

                <h1> {travelClass}:</h1>
                  {
                        enoughSeats ?
                        <>
                           <div className="manage-buttons">
                             <p>Available Seats : {availableSeats}</p>

                             <p>💰 Price : ₹{ticketprice}</p>
                                  
                            <button
                                onClick={() => {
                                navigate("/seatselection", {
                                        state: {
                                            flight: flight,
                                            travelClass: travelClass,
                                            noofpeople: val,
                                            ticketprice:ticketprice,
                                            availableSeats:availableSeats
                                        }
                                        });
                                 }}
                            >Select Seat</button>
                           </div>
                        </>
                        :
                        <>
                            <p style={{color:"red"}}>
                                    Your selected class does not have enough seats.
                                    once check the remaining seats below.
                            </p>

                            <p>
                                Please choose another travel class after checking the remaining seats.
                            </p>
                            <button  onClick={()=>{setviewremainingseats(true)}}  className="view_seats">view remaining seats</button>
                        </>
                   }

                   {
                        viewremainingseats &&
                        <div className="remaining-seats">
                                <h2>Remaining Seats</h2>

                                <p><strong>Total Seats :</strong> {flight.total_seats}</p>

                                <div className={`class-box ${travelClass==="Economy" ? "selected-class" : ""}`}>
                                        <h3>Economy</h3>
                                        <p>💺 Available Seats : {flight.economy_seats}</p>
                                        <p>💰 Price : ₹{flight.economy_price}</p>
                                </div>

                                 <div className={`class-box ${travelClass==="Premium Economy" ? "selected-class" : ""}`}>
                                        <h3>Premium Economy</h3>
                                        <p>💺 Available Seats : {flight.premium_economy_seats}</p>
                                        <p>💰 Price : ₹{flight.premium_economy_price}</p>
                                </div>

                                <div className={`class-box ${travelClass==="Business" ? "selected-class" : ""}`}>
                                        <h3>Business</h3>
                                        <p>💺 Available Seats : {flight.business_seats}</p>
                                        <p>💰 Price : ₹{flight.business_price}</p>
                                </div>

                                <div className={`class-box ${travelClass==="First Class" ? "selected-class" : ""}`}>
                                        <h3>First Class</h3>
                                        <p>💺 Available Seats : {flight.first_class_seats}</p>
                                        <p>💰 Price : ₹{flight.first_class_price}</p>
                                </div>

                                <button
                                    className="hide-btn"
                                    onClick={() => setviewremainingseats(false)}
                                >
                                    Hide Remaining Seats
                                </button>
                        </div>
                    }
              </div>

              

          </div>

      </section>

    );
}

export default FlightCard;
