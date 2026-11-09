
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/seatselection.css";

function Seatselection() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    flight,
    travelClass,
    noofpeople,
    ticketprice,
    availableSeats,
  } = location.state || {};

  const [passengerexceedpop, setPassengerExceedPop] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    seat: "",
    status: "",
  });

  const [showselectedseat, setShowSelectedSeat] = useState({
    show: false,
    seats: [],
  });

  const [bookedseats, setBookedSeats] = useState([]);

  // Profile completion popup
  const [profilePopup, setProfilePopup] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Fetch booked seats
  useEffect(() => {
    if (!flight?.flight_id) return;

    async function getBookedSeats() {
      try {
        const response = await fetch(
          "https://airline-backend-zdo5.onrender.com/get_bookedseats",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              travelClass,
              flight_id: flight.flight_id,
            }),
          }
        );

        const data = await response.json();
        setBookedSeats(data.seats || []);
      } catch (error) {
        console.error("Error fetching booked seats:", error);
      }
    }

    getBookedSeats();
  }, [flight?.flight_id, travelClass]);

  // Lock scrolling when passenger limit popup opens
  useEffect(() => {
    document.body.style.overflow = passengerexceedpop
      ? "hidden"
      : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [passengerexceedpop]);

  // Missing flight
  if (!flight) {
    return (
      <div className="seat-page">
        <section className="seat-missing">
          <h2>Flight details not found.</h2>
          <button onClick={() => navigate("/flightresutls")}>
            Back to Flights
          </button>
        </section>
      </div>
    );
  }

  const alpha = ["A", "B", "C", "D", "E", "F"];
  const seatCount = Number(availableSeats) || 0;
  const seats = Array.from({ length: seatCount });
  const passengerCount = Number(noofpeople) || 0;

  const columns =
    travelClass === "Economy"
      ? 6
      : travelClass === "First Class"
      ? 2
      : 4;

  const gridClass =
    travelClass === "Economy"
      ? "economy-grid"
      : travelClass === "Business"
      ? "business-grid"
      : travelClass === "Premium Economy"
      ? "premium-grid"
      : "firstclass-grid";

  function getSeatNumber(index) {
    return `${alpha[index % columns]}${Math.floor(index / columns) + 1}`;
  }

  // Availability popup on hover
  async function checkstatusofseat(seatnumber) {
    try {
      const response = await fetch(
        "https://airline-backend-zdo5.onrender.com/get_seat_status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ seatnumber }),
        }
      );

      const data = await response.json();

      setPopup({
        show: true,
        seat: seatnumber,
        status: data.status,
      });
    } catch (error) {
      console.error("Error checking seat status:", error);
    }
  }

  function closeSeatPopup() {
    setPopup({
      show: false,
      seat: "",
      status: "",
    });
  }

  // Seat selection
  function handleseatselection(seatNo) {
    if (bookedseats.includes(seatNo)) {
      return;
    }

    // Deselect already selected seat
    if (showselectedseat.seats.includes(seatNo)) {
      setShowSelectedSeat({
        show: true,
        seats: showselectedseat.seats.filter(
          (seat) => seat !== seatNo
        ),
      });
      return;
    }

    // Passenger limit
    if (showselectedseat.seats.length >= passengerCount) {
      setPassengerExceedPop(true);
      return;
    }

    // Select seat
    setShowSelectedSeat({
      show: true,
      seats: [...showselectedseat.seats, seatNo],
    });
  }

  // Continue to passenger details
  function hanldenavigation(selectedSeats) {
    navigate("/passengerdetails", {
      state: {
        flight,
        travelClass,
        noofpeople,
        ticketprice,
        seats: selectedSeats,
      },
    });
  }

  // Check profile before continuing
  async function checkProfileBeforeContinue(selectedSeats) {
    try {
      setProfileLoading(true);
      setProfileError("");

      const userid = localStorage.getItem("userid");

      if (!userid) {
        setProfileError(
          "Please login first to complete your profile and book tickets."
        );
        setProfilePopup(true);
        return;
      }

      const response = await fetch(
        "https://airline-backend-zdo5.onrender.com/check_profile_completion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userid }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setProfileError(
          data.message || "Unable to check your profile."
        );
        setProfilePopup(true);
        return;
      }

      if (!data.complete) {
        setProfilePopup(true);
        return;
      }

      // Profile completed: continue booking
      hanldenavigation(selectedSeats);
    } catch (error) {
      console.error("Profile check error:", error);
      setProfileError(
        "Unable to verify your profile. Please try again."
      );
      setProfilePopup(true);
    } finally {
      setProfileLoading(false);
    }
  }

  return (
    <div className="seat-page">

      {/* NAVBAR */}
      <nav className="seat-navbar">
        <div className="seat-brand">
          <span className="seat-brand-icon">✈</span>
          <span>
            Indian <span>AirConnect</span>
          </span>
        </div>

        <button
          className="seat-back"
          onClick={() => navigate("/flightresutls")}
        >
          ← Back to Flights
        </button>
      </nav>

      {/* BOOKING PROGRESS */}
      <div className="seat-progress">
        <div className="seat-step completed">
          <span>✓</span>
          <small>Flights</small>
        </div>

        <div className="seat-progress-line active" />

        <div className="seat-step active">
          <span>2</span>
          <small>Seats</small>
        </div>

        <div className="seat-progress-line" />

        <div className="seat-step">
          <span>3</span>
          <small>Details</small>
        </div>

        <div className="seat-progress-line" />

        <div className="seat-step">
          <span>4</span>
          <small>Payment</small>
        </div>
      </div>

      {/* HEADING */}
      <div className="seat-page-heading">
        <span className="seat-eyebrow">YOUR JOURNEY</span>
        <h1>
          Choose Your <span>Seat</span>
        </h1>
        <p>Select your preferred seats for a comfortable journey.</p>
      </div>

      {/* FLIGHT INFORMATION */}
      <div className="seat-flight-card">
        <div className="seat-flight-airline">
          <div className="airline-icon">✈</div>
          <div>
            <strong>{flight.airline_name}</strong>
            <small>{travelClass}</small>
          </div>
        </div>

        <div className="seat-route">
          <div>
            <strong>{flight.from_city}</strong>
            <small>Departure</small>
          </div>

          <div className="seat-route-middle">
            <div />
            <span>✈</span>
            <div />
          </div>

          <div>
            <strong>{flight.to_city}</strong>
            <small>Arrival</small>
          </div>
        </div>

        <div className="seat-flight-meta">
          <span>
            <small>Date</small>
            <strong>
              {new Date(flight.departure_date).toLocaleDateString("en-IN")}
            </strong>
          </span>

          <span>
            <small>Departure</small>
            <strong>{flight.departure_time}</strong>
          </span>

          <span>
            <small>Arrival</small>
            <strong>{flight.arrival_time}</strong>
          </span>

          <span>
            <small>Price / Passenger</small>
            <strong>₹{ticketprice}</strong>
          </span>
        </div>
      </div>

      {/* SEAT SELECTION */}
      <div className="seat-selection-card">

        <div className="seat-selection-heading">
          <div>
            <span className="seat-eyebrow">SEAT MAP</span>
            <h2>Select Your Seats</h2>
            <p>
              Select {passengerCount} seat(s) for your passengers.
            </p>
          </div>

          <div className="seat-legend">
            <span>
              <i className="legend-available" />
              Available
            </span>
            <span>
              <i className="legend-selected" />
              Selected
            </span>
            <span>
              <i className="legend-booked" />
              Booked
            </span>
          </div>
        </div>

        {/* AIRCRAFT */}
        <div className="seat-map-wrap">
          <div className="seat-map">

            <div className="seat-cockpit">
              <span>✈</span>
              <strong>COCKPIT</strong>
            </div>

            <div className={`seat-grid ${gridClass}`}>
              {seats.map((_, index) => {
                const seatNo = getSeatNumber(index);
                const isBooked = bookedseats.includes(seatNo);
                const isSelected =
                  showselectedseat.seats.includes(seatNo);

                return (
                  <button
                    key={seatNo}
                    type="button"
                    className={`seat-btn ${
                      isBooked
                        ? "booked"
                        : isSelected
                        ? "selected"
                        : "available"
                    }`}
                    disabled={isBooked}
                    onMouseEnter={() => checkstatusofseat(seatNo)}
                    onMouseLeave={closeSeatPopup}
                    onClick={() => handleseatselection(seatNo)}
                  >
                    {seatNo}
                  </button>
                );
              })}
            </div>

            <div className="seat-tail">TAIL</div>
          </div>
        </div>

        {/* AVAILABILITY POPUP */}
        {popup.show && (
          <div className="seat-toast">
            <div
              className={`seat-toast-icon ${
                popup.status === "available"
                  ? "success"
                  : "error"
              }`}
            >
              {popup.status === "available" ? "✓" : "✕"}
            </div>

            <div>
              <strong>{popup.seat}</strong>
              <p>
                {popup.status === "available"
                  ? "Seat Available"
                  : "Seat Already Booked"}
              </p>
            </div>
          </div>
        )}

        {/* PASSENGER LIMIT POPUP */}
        {passengerexceedpop && (
          <div className="seat-warning-overlay">
            <div className="seat-warning-box">
              <div className="seat-warning-icon">⚠️</div>

              <h2>Maximum Seat Limit Reached</h2>

              <p>
                You have already selected {passengerCount} seat(s).
                Deselect a seat to choose another.
              </p>

              <button onClick={() => setPassengerExceedPop(false)}>
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SELECTED SEAT SUMMARY */}
      {showselectedseat.seats.length > 0 && (
        <div className="seat-summary">
          <div className="seat-summary-info">
            <div className="seat-summary-icon">✓</div>

            <div>
              <small>SELECTED SEATS</small>

              <h3>
                {showselectedseat.seats.join(", ")}
                <span>
                  {" "}({showselectedseat.seats.length} passenger(s))
                </span>
              </h3>

              <p>Travel Class: {travelClass}</p>
            </div>
          </div>

          <div className="seat-summary-price">
            <small>TOTAL PRICE</small>
            <strong>
              ₹{Number(ticketprice) * showselectedseat.seats.length}
            </strong>
          </div>

          <div className="seat-summary-actions">
            <button
              className="seat-cancel"
              onClick={() =>
                setShowSelectedSeat({
                  show: false,
                  seats: [],
                })
              }
            >
              Cancel
            </button>

            <button
              className="seat-continue"
              disabled={
                showselectedseat.seats.length !== passengerCount ||
                profileLoading
              }
              onClick={() =>
                checkProfileBeforeContinue(showselectedseat.seats)
              }
            >
              {profileLoading ? "Checking Profile..." : "Continue →"}
            </button>
          </div>
        </div>
      )}

      {/* PROFILE COMPLETION POPUP */}
      {profilePopup && (
        <div className="profile-check-overlay">
          <div className="profile-check-popup">
            <div className="profile-check-icon">✈</div>

            <h2>Complete Your Profile First!</h2>

            <p>
              Please fill in your personal details in your Profile
              section on the Flight Search page before booking your
              tickets.
            </p>

            {profileError && (
              <p className="profile-check-error">{profileError}</p>
            )}

            <div className="profile-check-buttons">
              <button
                className="profile-check-cancel"
                onClick={() => setProfilePopup(false)}
              >
                Cancel
              </button>

              <button
                className="profile-check-complete"
                onClick={() => navigate("/profile")}
              >
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="seat-footer">
        <div className="seat-footer-content">
          <div>
            <h2>✈ Indian AirConnect</h2>
            <p>Your journey, our priority.</p>
          </div>

          <div>
            <h3>Quick Links</h3>
            <p onClick={() => navigate("/")}>Home</p>
            <p onClick={() => navigate("/mybookings")}>My Bookings</p>
            <p onClick={() => navigate("/profile")}>My Profile</p>
          </div>

          <div>
            <h3>Contact Us</h3>
            <p>Email: support@indianairconnect.com</p>
            <p>Customer Support: 24/7</p>
          </div>
        </div>

        <div className="seat-footer-bottom">
          © 2026 Indian AirConnect. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Seatselection;
