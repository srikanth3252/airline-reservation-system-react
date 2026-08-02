import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../styles/resultspage.css"
import FlightCard from "../components/flight-card.jsx"

function Flightresutls()
{

    const location = useLocation();
    const { success, message, data,classtype,val} = location.state;
    if(!success)
    {
        return (
            <div>
                <h1>No Flights Available</h1>
                <p>{message}</p>
            </div>
        );
    }

    return(
        <div className="Flightresutls">
               <h1 className="h1">✈ Flight Search Results</h1>
                <p className="sub-heading">
                    Showing available flights matching your search.
                </p>
               
                 {
                    data.map((flight) => (
                         <FlightCard
                         key={flight.flight_id}
                         flight={flight}
                         travelClass={classtype}
                         val={val}
                            />
                    ))
                 }
        </div>
    );
}

export default Flightresutls;

