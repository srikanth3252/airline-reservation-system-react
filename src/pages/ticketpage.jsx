
import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../styles/ticketpage.css";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Ticket() {
    const location = useLocation();
    const ticketRef = useRef(null);

    const [ticketCooldown, setTicketCooldown] = useState(false);
    const [ticketTime, setTicketTime] = useState(30);
    const [ticketSent, setTicketSent] = useState(false);

    const { bool, pnr } = location.state || {};

    const bookingId = useRef(
        "BK" + Math.floor(Math.random() * 1000000)
    );

    const [flight, setFlight] = useState(null);
    const [travelClass, setTravelClass] = useState("");
    const [noofpeople, setNoofpeople] = useState(0);
    const [ticketprice, setTicketprice] = useState(0);
    const [seats, setSeats] = useState([]);
    const [passengers, setPassengers] = useState([]);

    const email = localStorage.getItem("email");
    const phonenumber = localStorage.getItem("number");

    const totalamount = ticketprice * noofpeople;

    // Fetch ticket details using PNR
    useEffect(() => {
        if (!bool || !pnr) return;

        async function get_flightsdata() {
            try {
                const res = await fetch(
                    "https://airline-backend-zdo5.onrender.com/get_flightsdata",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ pnr })
                    }
                );

                const data = await res.json();

                if (data.success) {
                    setFlight(data.flight);
                    setTravelClass(data.travelClass);
                    setNoofpeople(data.noofpeople);
                    setTicketprice(data.ticketprice);
                    setSeats(data.seats || []);
                    setPassengers(data.passengers || []);
                } else {
                    console.error(data.message || "Unable to fetch ticket details");
                }
            } catch (err) {
                console.error("Ticket fetch error:", err);
            }
        }

        get_flightsdata();
    }, [bool, pnr]);

    // Load ticket details from navigation state
    useEffect(() => {
        if (bool) return;

        const state = location.state || {};

        setFlight(state.flight || null);
        setTravelClass(state.travelClass || "");
        setNoofpeople(state.noofpeople || 0);
        setTicketprice(state.ticketprice || 0);
        setSeats(state.seats || []);
        setPassengers(JSON.parse(localStorage.getItem("details")) || []);
    }, [bool, location.state]);

    // Generate PDF and send ticket by email
    async function downloadPDF() {
        if (!ticketRef.current) {
            throw new Error("Ticket element not found");
        }

        const canvas = await html2canvas(ticketRef.current, {
            scale: 2,
            useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const width = 210;
        const height = (canvas.height * width) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, width, height);

        const blob = pdf.output("blob");

        const formData = new FormData();

        formData.append("ticket", blob, "ticket.pdf");
        formData.append("email", email || "");

        const res = await fetch(
            "https://airline-backend-zdo5.onrender.com/send_ticket",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await res.json();

        if (data.success) {
            setTicketSent(true);
        } else {
            throw new Error(data.message || "Failed to send ticket");
        }
    }

    // Print ticket and send PDF
    async function handlePrintAndSend() {
        if (ticketCooldown) return;

        setTicketCooldown(true);
        setTicketTime(30);

        window.print();

        try {
            await downloadPDF();
        } catch (err) {
            console.error("Ticket sending error:", err);
            alert("Unable to send ticket. Please try again.");
        }

        const timer = setInterval(() => {
            setTicketTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setTicketCooldown(false);
                    return 30;
                }

                return prev - 1;
            });
        }, 1000);
    }

    // Loading state
    if (!flight) {
        return <h2>Loading Ticket...</h2>;
    }

    return (
        <section className="ticket-page">

            {/* TICKET */}
            <div className="ticket" ref={ticketRef}>

                {/* HEADER */}
                <div className="ticket-header">
                    <h1>✈ Airline Reservation System</h1>
                    <h2>E - Ticket</h2>

                    <h3 className="confirmed">
                        ✅ Booking Confirmed
                    </h3>
                </div>

                {/* BOOKING INFORMATION */}
                <div className="ticket-info">

                    <div>
                        <strong>Booking ID</strong>
                        <p>{bookingId.current}</p>
                    </div>

                    <div>
                        <strong>PNR</strong>
                        <p>{pnr}</p>
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

                {/* JOURNEY */}
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

                {/* FLIGHT DETAILS */}
                <div className="flight-details">

                    <div>
                        <strong>Date</strong>
                        <p>
                            {new Date(
                                flight.departure_date
                            ).toLocaleDateString("en-IN")}
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

                {/* PASSENGER DETAILS */}
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
                        {passengers.map((person, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{person.name}</td>
                                <td>{person.age}</td>
                                <td>{person.gender}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <hr />

                {/* CONTACT DETAILS */}
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

                {/* SINGLE THANK YOU FOOTER */}
                <div className="footer">
                    <h2>
                        🎉 Thank You For Choosing Our Airline
                    </h2>

                    <p>
                        Have a Safe and Pleasant Journey.
                    </p>
                </div>

                {/* PRINT AND SEND BUTTON */}
                <div className="ticket-buttons">

                    <button
                        onClick={handlePrintAndSend}
                        disabled={ticketCooldown}
                    >
                        {ticketCooldown
                            ? `Ticket Sent • Wait ${ticketTime}s`
                            : "🖨 Print & Send Ticket"}
                    </button>

                    {ticketSent && (
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
