import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../styles/ticketpage.css";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Ticket() {

    const location = useLocation();
    const ticketRef = useRef(null);

    const { bool, pnr } = location.state;
    const [ticketSent, setTicketSent] = useState(false);
    const bookingId = useRef("BK" + Math.floor(Math.random() * 1000000));

    const [flight, setFlight] = useState(null);
    const [travelClass, setTravelClass] = useState("");
    const [noofpeople, setNoofpeople] = useState(0);
    const [ticketprice, setTicketprice] = useState(0);
    const [seats, setSeats] = useState([]);
    const [passengers, setPassengers] = useState([]);

    const email = localStorage.getItem("email");
    const phonenumber = localStorage.getItem("number");

    const totalamount = ticketprice * noofpeople;

    useEffect(() => {

        if (!bool) return;

        async function get_flightsdata() {

            try {

                const res = await fetch("https://airline-backend-zdo5.onrender.com/get_flightsdata", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        pnr: pnr
                    })

                });

                const data = await res.json();

                if (data.success) {
                  
                    setFlight(data.flight);
                    setTravelClass(data.travelClass);
                    setNoofpeople(data.noofpeople);
                    setTicketprice(data.ticketprice);
                    setSeats(data.seats);
                    setPassengers(data.passengers);

                }

            }
            catch (err) {

                console.log(err);

            }

        }

        get_flightsdata();

    }, [bool, pnr]);

    useEffect(() => {

        if (bool) return;

        setFlight(location.state.flight);
        setTravelClass(location.state.travelClass);
        setNoofpeople(location.state.noofpeople);
        setTicketprice(location.state.ticketprice);
        setSeats(location.state.seats);
        setPassengers(JSON.parse(localStorage.getItem("details")) || []);

    }, [bool, location.state]);

    async function downloadPDF() {

        const canvas = await html2canvas(ticketRef.current);

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const width = 210;

        const height = canvas.height * width / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, width, height);

        const blob = pdf.output("blob");

        const formData = new FormData();

        formData.append("ticket", blob, "ticket.pdf");

        formData.append("email", email);

        try {

            const res = await fetch("https://airline-backend-zdo5.onrender.com/send_ticket", {

                method: "POST",

                body: formData

            });

            const data = await res.json();

            console.log(data.message);
            if(data.success)
            {
                setTicketSent(true);
            }

        }
        catch (err) {

            console.log(err);

        }

    }

    if (!flight) {

        return <h2>Loading Ticket...</h2>;

    }
    console.log("bookingId =", bookingId);
console.log("pnr =", pnr);
console.log("flight =", flight);
console.log("travelClass =", travelClass);
    return (

        <section className="ticket-page">

            <div className="ticket" ref={ticketRef}>

                <div className="ticket-header">

                    <h1>✈ Airline Reservation System</h1>

                    <h2>E - Ticket</h2>

                    <h3 className="confirmed">

                        ✅ Booking Confirmed

                    </h3>

                </div>

                <div className="ticket-info">

                    <div>

                        <strong>Booking ID</strong>

                        <p>{bookingId.current}</p>

                    </div>

                    <div>

                        <strong>PNR</strong>

                        <p>{pnr.current}</p>

                    </div>

                    <div>

                        <strong>Airline</strong>

                        <p>{flight.airline_name}</p>

                    </div>

                    <div>

                        <strong>Travel Class</strong>

                        <p>{travelClass}</p>

                    </div>

                </div>

                <hr />

                <div className="journey">

                    <div>

                        <h2>{flight.from_city}</h2>

                        <p>Departure</p>

                        <h3>{flight.departure_time}</h3>

                    </div>

                    <div className="arrow">

                        ✈────────────✈

                    </div>

                    <div>

                        <h2>{flight.to_city}</h2>

                        <p>Arrival</p>

                        <h3>{flight.arrival_time}</h3>

                    </div>

                </div>

                <hr />

                <div className="flight-details">

                    <div>

                        <strong>Date</strong>

                        <p>
                            {new Date(flight.departure_date).toLocaleDateString("en-IN")}
                        </p>

                    </div>

                    <div>

                        <strong>Seats</strong>

                        <p>{seats.join(", ")}</p>

                    </div>

                    <div>

                        <strong>Passengers</strong>

                        <p>{noofpeople}</p>

                    </div>

                    <div>

                        <strong>Total Paid</strong>

                        <p>₹ {totalamount}</p>

                    </div>

                </div>

                <hr />

                <h2 className="passenger-heading">

                    Passenger Details

                </h2>

                <table>

                    <thead>

                        <tr>

                            <th>#</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>

                        </tr>

                    </thead>

                    <tbody>
                                            {
                            passengers.map((person, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{person.name}</td>
                                    <td>{person.age}</td>
                                    <td>{person.gender}</td>
                                </tr>
                            ))
                        }

                    </tbody>

                </table>

                <hr />

                <div className="contact">

                    <div>

                        <strong>Email</strong>

                        <p>{email}</p>

                    </div>

                    <div>

                        <strong>Phone</strong>

                        <p>{phonenumber}</p>

                    </div>

                </div>

                <div className="footer">

                    <h2>

                        🎉 Thank You For Choosing Our Airline

                    </h2>

                    <p>

                        Have a Safe and Pleasant Journey.

                    </p>

                </div>

                <div className="ticket-buttons">

                    <button
                        onClick={async () => {

                            window.print();
                            await downloadPDF();

                        }}
                    >
                        🖨 Print & Send Ticket
                    </button>
                    {
                       ticketSent && (
                         <p className="success-message">
                                ✅ Your e-ticket has been sent to your registered email.
                            </p>
                    )}
                </div>

            </div>

        </section>

    );

}

export default Ticket;