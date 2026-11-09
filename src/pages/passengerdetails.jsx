
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/passengerdetails.css";
import Passenger_card from "../components/passenger-card.jsx";

function Passenger_details() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    flight,
    travelClass,
    noofpeople,
    ticketprice,
    seats,
  } = location.state || {};

  const passengerCount = Number(noofpeople) || 0;
  const userid = localStorage.getItem("userid");

  const [showpop, setshowpop] = useState(false);
  const [viewSummary, setViewSummary] = useState(false);
  const [missinginfo, setmissinginfo] = useState([]);
  const [phonenumber, setphonenumber] = useState("");
  const [email, setemail] = useState("");

  const [passengers, setPassengers] = useState(() =>
    Array.from({ length: passengerCount }, () => ({
      name: "",
      age: "",
      gender: "",
    }))
  );

  // Fetch registered email
  useEffect(() => {
    if (!userid) return;

    async function handleemail() {
      try {
        const res = await fetch(
          "https://airline-backend-zdo5.onrender.com/get_email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userid }),
          }
        );

        const data = await res.json();

        if (data.email) setemail(data.email);
        if (data.id) localStorage.setItem("id", data.id);
      } catch (error) {
        console.error("Unable to fetch email:", error);
      }
    }

    handleemail();
  }, [userid]);

  // Save details locally
  useEffect(() => {
    localStorage.setItem("email", email);
    localStorage.setItem("number", phonenumber);
    localStorage.setItem("details", JSON.stringify(passengers));
  }, [email, phonenumber, passengers]);

  // Prevent background scrolling while popup is open
  useEffect(() => {
    document.body.style.overflow = showpop ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showpop]);

  // Missing flight information
  if (!flight) {
    return (
      <main className="passengerdetails">
        <div className="pd-error-card">
          <div className="pd-error-icon">✈</div>
          <h2>Booking details not found</h2>
          <p>
            Please select a flight and seats before entering
            passenger details.
          </p>
          <button onClick={() => navigate("/flightresutls")}>
            Back to Flights
          </button>
        </div>
      </main>
    );
  }

  // Validate passenger details and contact number
  function handlesubmit() {
    const missing = passengers.map((person, index) => ({
      passenger: index + 1,
      name: !person.name.trim(),
      age: !person.age || Number(person.age) <= 0,
      gender: !person.gender,
    }));

    const incomplete = missing.some(
      (person) => person.name || person.age || person.gender
    );

    const phoneValid = /^[0-9]{10}$/.test(phonenumber.trim());

    if (incomplete || !phoneValid) {
      setmissinginfo(missing);
      setshowpop(true);
      return;
    }

    navigate("/payment", {
      state: {
        flight,
        travelClass,
        noofpeople,
        ticketprice,
        seats,
        passengers,
        phonenumber,
        email,
      },
    });
  }

  const totalAmount = Number(ticketprice) * passengerCount;

  return (
    <main className="passengerdetails">

      {/* Validation popup */}
      {showpop && (
        <div
          className="pd-modal-overlay"
          role="dialog"
          aria-modal="true"
        >
          <div className="pd-modal">
            <div className="pd-modal-icon">!</div>

            <h2>Please complete the details</h2>

            <p className="pd-modal-description">
              Correct the following fields before continuing to payment.
            </p>

            {missinginfo.map((person) => {
              const hasMissing =
                person.name || person.age || person.gender;

              if (!hasMissing) return null;

              return (
                <div
                  className="pd-missing-item"
                  key={person.passenger}
                >
                  <strong>Passenger {person.passenger}</strong>

                  <ul>
                    {person.name && <li>Name is missing</li>}
                    {person.age && <li>Enter a valid age</li>}
                    {person.gender && <li>Select gender</li>}
                  </ul>
                </div>
              );
            })}

            {!/^[0-9]{10}$/.test(phonenumber.trim()) && (
              <p className="pd-phone-error">
                Enter a valid 10-digit mobile number.
              </p>
            )}

            <button
              className="pd-modal-button"
              onClick={() => setshowpop(false)}
            >
              Okay, I'll fix it
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="pd-header">
        <div className="pd-brand">
          <span className="pd-brand-icon">✈</span>
          <span>Indian AirConnect</span>
        </div>

        <div className="pd-step-indicator">
          <span className="pd-step completed">1</span>
          <span className="pd-step-line" />
          <span className="pd-step active">2</span>
          <span className="pd-step-line" />
          <span className="pd-step">3</span>
          <span className="pd-step-label">Passenger Details</span>
        </div>
      </header>

      {/* Page heading */}
      <section className="pd-page-heading">
        <span className="pd-eyebrow">YOUR JOURNEY</span>

        <h1>Passenger details</h1>

        <p>
          Enter accurate details for every passenger travelling.
        </p>
      </section>

      {/* Main two-column layout */}
      <div className="pd-layout">

        {/* Passenger form */}
        <section className="pd-main-card">

          <div className="pd-section-heading">
            <div>
              <h2>Traveller information</h2>
              <p>All fields are required for each passenger.</p>
            </div>

            <span className="pd-count-badge">
              {passengerCount} passenger(s)
            </span>
          </div>

          {/* Passenger cards */}
          <div className="pd-passenger-list">
            {passengers.map((person, index) => (
              <Passenger_card
                key={index}
                person={person}
                index={index}
                passengers={passengers}
                setPassengers={setPassengers}
              />
            ))}
          </div>

          <div className="pd-divider" />

          {/* Contact information */}
          <div className="pd-section-heading">
            <div>
              <h2>Contact information</h2>
              <p>
                Your booking confirmation will be sent to this email.
              </p>
            </div>
          </div>

          <div className="pd-contact-grid">

            <label className="pd-field">
              <span>
                Mobile number <b>*</b>
              </span>

              <div className="pd-input-wrap">
                <span className="pd-input-prefix">+91</span>

                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phonenumber}
                  placeholder="10-digit mobile number"
                  onChange={(e) =>
                    setphonenumber(
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                />
              </div>
            </label>

            <label className="pd-field">
              <span>Email address</span>

              <input
                type="email"
                value={email}
                placeholder="Loading email..."
                readOnly
              />
            </label>

          </div>

          {/* Form actions */}
          <div className="pd-actions">
            <button
              className="pd-summary-toggle"
              type="button"
              onClick={() => setViewSummary((prev) => !prev)}
            >
              {viewSummary
                ? "Hide booking summary ↑"
                : "View booking summary ↓"}
            </button>

            <button
              className="pd-continue-button"
              onClick={handlesubmit}
            >
              Continue to Payment <span>→</span>
            </button>
          </div>

        </section>

        {/* Booking overview sidebar */}
        <aside className="pd-sidebar">

          <div className="pd-sidebar-title">
            <h2>Booking overview</h2>
            <span>✦</span>
          </div>

          {/* Airline */}
          <div className="pd-airline">
            <div className="pd-airline-icon">✈</div>

            <div>
              <strong>{flight.airline_name}</strong>
              <span>{travelClass}</span>
            </div>
          </div>

          {/* Route */}
          <div className="pd-route">

            <div className="pd-route-point">
              <span className="pd-route-dot" />

              <div>
                <strong>{flight.from_city}</strong>
                <small>{flight.departure_time}</small>
              </div>
            </div>

            <div className="pd-route-line">
              <span>✈</span>
            </div>

            <div className="pd-route-point">
              <span className="pd-route-dot destination" />

              <div>
                <strong>{flight.to_city}</strong>
                <small>{flight.arrival_time}</small>
              </div>
            </div>

          </div>

          {/* Booking details */}
          <div className="pd-sidebar-details">

            <div>
              <span>Date</span>
              <strong>
                {flight.departure_date
                  ? new Date(
                      flight.departure_date
                    ).toLocaleDateString("en-IN")
                  : "—"}
              </strong>
            </div>

            <div>
              <span>Passengers</span>
              <strong>{passengerCount}</strong>
            </div>

            <div>
              <span>Seats</span>
              <strong>
                {seats?.join(", ") || "Not selected"}
              </strong>
            </div>

          </div>

          {/* Price */}
          <div className="pd-price-row">
            <span>Price per passenger</span>
            <strong>
              ₹{Number(ticketprice).toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="pd-total-row">
            <span>Total amount</span>
            <strong>
              ₹{totalAmount.toLocaleString("en-IN")}
            </strong>
          </div>

          <p className="pd-secure-note">
            🔒 Secure booking · Prices in INR
          </p>

        </aside>

      </div>

      {/* Expandable booking summary */}
      {viewSummary && (
        <section className="pd-expanded-summary">

          <h2>📋 Booking summary</h2>

          <div className="pd-summary-grid">

            <p>
              <span>Airline</span>
              <strong>{flight.airline_name}</strong>
            </p>

            <p>
              <span>Route</span>
              <strong>
                {flight.from_city} → {flight.to_city}
              </strong>
            </p>

            <p>
              <span>Travel class</span>
              <strong>{travelClass}</strong>
            </p>

            <p>
              <span>Selected seats</span>
              <strong>{seats?.join(", ")}</strong>
            </p>

            <p>
              <span>Passengers</span>
              <strong>{passengerCount}</strong>
            </p>

            <p>
              <span>Total</span>
              <strong>
                ₹{totalAmount.toLocaleString("en-IN")}
              </strong>
            </p>

          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="pd-footer">

        <div className="pd-footer-brand">
          <span>✈ Indian AirConnect</span>
          <p>Your journey, our priority.</p>
        </div>

        <div className="pd-footer-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/mybookings")}>
            My Bookings
          </button>
          <button onClick={() => navigate("/profile")}>
            My Profile
          </button>
        </div>

        <p className="pd-copyright">
          © 2026 Indian AirConnect. All rights reserved.
        </p>

      </footer>

    </main>
  );
}

export default Passenger_details;
