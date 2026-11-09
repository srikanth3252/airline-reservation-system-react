
import { useState } from "react";
import "../styles/flight-card.css";
import { useNavigate } from "react-router-dom";

function FlightCard({ flight, travelClass, val }) {
    const navigate = useNavigate();
    const [viewremainingseats, setviewremainingseats] = useState(false);

    let availableSeats = 0;
    let ticketprice = 0;

    if (travelClass === "Economy") {
        availableSeats = flight.economy_seats;
        ticketprice = flight.economy_price;
    } else if (travelClass === "Premium Economy") {
        availableSeats = flight.premium_economy_seats;
        ticketprice = flight.premium_economy_price;
    } else if (travelClass === "Business") {
        availableSeats = flight.business_seats;
        ticketprice = flight.business_price;
    } else {
        availableSeats = flight.first_class_seats;
        ticketprice = flight.first_class_price;
    }

    const enoughSeats = Number(availableSeats) >= Number(val);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    const classes = [
        {
            name: "Economy",
            seats: flight.economy_seats,
            price: flight.economy_price,
        },
        {
            name: "Premium Economy",
            seats: flight.premium_economy_seats,
            price: flight.premium_economy_price,
        },
        {
            name: "Business",
            seats: flight.business_seats,
            price: flight.business_price,
        },
        {
            name: "First Class",
            seats: flight.first_class_seats,
            price: flight.first_class_price,
        },
    ];

    return (
        <section className="FlightCard">
            <div className="FlightCard-box">

                {/* AIRLINE HEADER */}
                <div className="flight-card-top">
                    <div className="flight-airline">
                        <div className="flight-airline-icon">✈</div>
                        <div>
                            <h2>{flight.airline_name}</h2>
                            <span>IndianAirConnect Partner</span>
                        </div>
                    </div>

                    <span className="flight-class-badge">
                        {travelClass}
                    </span>
                </div>

                {/* FLIGHT ROUTE */}
                <div className="manage-route">
                    <div className="flight-city">
                        <span className="flight-city-label">FROM</span>
                        <h1>{flight.from_city}</h1>
                    </div>

                    <div className="flight-route-middle">
                        <span className="flight-route-line"></span>
                        <span className="flight-route-icon">✈</span>
                        <span className="flight-route-caption">DIRECT ROUTE</span>
                    </div>

                    <div className="flight-city flight-city-arrival">
                        <span className="flight-city-label">TO</span>
                        <h1>{flight.to_city}</h1>
                    </div>
                </div>

                {/* FLIGHT DETAILS */}
                <div className="manage-dates">
                    <div className="flight-info-item">
                        <span className="flight-info-icon">📅</span>
                        <div>
                            <p>Departure Date</p>
                            <h3>{formatDate(flight.departure_date)}</h3>
                        </div>
                    </div>

                    <div className="flight-info-item">
                        <span className="flight-info-icon">🛫</span>
                        <div>
                            <p>Departure Time</p>
                            <h3>{flight.departure_time}</h3>
                        </div>
                    </div>

                    <div className="flight-info-item">
                        <span className="flight-info-icon">🛬</span>
                        <div>
                            <p>Arrival Time</p>
                            <h3>{flight.arrival_time}</h3>
                        </div>
                    </div>
                </div>

                {/* CABIN AND PRICE */}
                <div className="manage-class">
                    <div className="flight-class-heading">
                        <div>
                            <span className="flight-section-label">
                                YOUR SELECTED CABIN
                            </span>
                            <h2>{travelClass}</h2>
                        </div>

                        <div className="flight-price">
                            <span>PRICE / PERSON</span>
                            <strong>₹{ticketprice}</strong>
                        </div>
                    </div>

                    {/* AVAILABLE SEATS */}
                    {enoughSeats ? (
                        <div className="manage-buttons">
                            <div className="flight-seat-status">
                                <span className="flight-status-dot"></span>
                                <div>
                                    <strong>{availableSeats} Seats Available</strong>
                                    <p>
                                        Seats available for {val} passenger(s)
                                    </p>
                                </div>
                            </div>

                            <button
                                className="flight-select-btn"
                                onClick={() => {
                                    navigate("/seatselection", {
                                        state: {
                                            flight,
                                            travelClass,
                                            noofpeople: Number(val),
                                            ticketprice,
                                            availableSeats,
                                        },
                                    });
                                }}
                            >
                                Select Seats <span>→</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flight-unavailable">
                            <div>
                                <strong>
                                    Not enough seats in {travelClass}
                                </strong>
                                <p>
                                    Required: {val} passenger(s) · Available: {availableSeats}
                                </p>
                            </div>

                            <button
                                className="view_seats"
                                onClick={() => setviewremainingseats(true)}
                            >
                                View Other Classes
                            </button>
                        </div>
                    )}

                    {/* OTHER CABINS */}
                    {viewremainingseats && (
                        <div className="remaining-seats">
                            <div className="remaining-seats-heading">
                                <div>
                                    <span className="flight-section-label">
                                        CABIN AVAILABILITY
                                    </span>
                                    <h2>Explore Other Classes</h2>
                                </div>

                                <span className="remaining-total">
                                    {flight.total_seats} Total Seats
                                </span>
                            </div>

                            <div className="remaining-class-grid">
                                {classes.map((item) => (
                                    <div
                                        key={item.name}
                                        className={`class-box ${
                                            travelClass === item.name
                                                ? "selected-class"
                                                : ""
                                        }`}
                                    >
                                        <h3>{item.name}</h3>
                                        <p>💺 {item.seats} seats</p>
                                        <strong>₹{item.price}</strong>
                                    </div>
                                ))}
                            </div>

                            <button
                                className="hide-btn"
                                onClick={() => setviewremainingseats(false)}
                            >
                                Hide Classes ↑
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default FlightCard;
