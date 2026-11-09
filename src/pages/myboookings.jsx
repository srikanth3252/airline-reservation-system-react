
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/mybookings.css";

function Mybookings() {
  const [bookings, setbookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function getBookings() {
      const userid = localStorage.getItem("userid");

      try {
        const res = await fetch(
          "https://airline-backend-zdo5.onrender.com/get_my_bookings",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userid: userid,
            }),
          }
        );

        const data = await res.json();

        if (data.success) {
          const grouped = {};

          data.bookings.forEach((booking) => {
            if (!grouped[booking.pnr]) {
              grouped[booking.pnr] = [];
            }

            grouped[booking.pnr].push(booking);
          });

          setbookings(Object.values(grouped));
        } else {
          setError(data.message || "Unable to load bookings.");
        }
      } catch (err) {
        console.log(err.message);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    getBookings();
  }, []);

  return (
    <div className="my-bookings-page">

      {/* ================= MAIN SECTION ================= */}
      <main className="my-bookings">

        {/* Header */}
        <div className="my-bookings-header">
          <div className="my-bookings-header-icon">✈</div>

          <div>
            <span className="my-bookings-tag">
              INDIAN AIRCONNECT
            </span>

            <h1>My Bookings</h1>

            <p>
              Manage your journeys and access your flight tickets.
            </p>
          </div>
        </div>

        {/* Booking Count */}
        {!loading && !error && bookings.length > 0 && (
          <div className="my-bookings-summary">
            <div>
              <h2>Your Trips</h2>
              <p>
                {bookings.length}{" "}
                {bookings.length === 1 ? "booking" : "bookings"} found
              </p>
            </div>

            <span className="booking-count">
              {bookings.length}
            </span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="my-bookings-empty">
            <div className="booking-loader"></div>
            <h2>Loading Your Bookings</h2>
            <p>Please wait while we fetch your journeys.</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="my-bookings-empty booking-error">
            <div className="booking-empty-icon">⚠</div>
            <h2>Unable to Load Bookings</h2>
            <p>{error}</p>

            <button
              className="booking-retry-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <div className="my-bookings-empty">
            <div className="booking-empty-icon">✈</div>

            <h2>No Bookings Found</h2>

            <p>
              You haven't booked any flights yet.
              Start planning your next journey with us.
            </p>

            <button
              className="booking-retry-button"
              onClick={() => navigate("/")}
            >
              Explore Flights →
            </button>
          </div>
        )}

        {/* Booking Cards */}
        {!loading && !error && bookings.length > 0 && (
          <div className="booking-list">

            {bookings.map((bookingGroup, index) => {
              const booking = bookingGroup[0];

              return (
                <article className="booking-card" key={booking.pnr || index}>

                  {/* Booking Card Header */}
                  <div className="booking-card-header">

                    <div className="booking-airline">
                      <div className="booking-airline-icon">
                        ✈
                      </div>

                      <div>
                        <h2>{booking.airline_name}</h2>

                        <p>
                          Flight {booking.flight_number}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`booking-status-badge ${
                        booking.booking_status?.toLowerCase() === "confirmed"
                          ? "booking-confirmed"
                          : "booking-other-status"
                      }`}
                    >
                      {booking.booking_status}
                    </span>

                  </div>

                  {/* Journey */}
                  <div className="booking-journey">

                    <div className="booking-city">
                      <span className="booking-city-label">FROM</span>
                      <h3>{booking.from_city}</h3>
                    </div>

                    <div className="booking-journey-line">
                      <span className="booking-journey-dot"></span>
                      <span className="booking-journey-plane">✈</span>
                      <span className="booking-journey-dot"></span>
                    </div>

                    <div className="booking-city booking-city-destination">
                      <span className="booking-city-label">TO</span>
                      <h3>{booking.to_city}</h3>
                    </div>

                  </div>

                  {/* Booking Information */}
                  <div className="booking-info-grid">

                    <div className="booking-info-item">
                      <span>Departure Date</span>

                      <strong>
                        {booking.departure_date
                          ? new Date(
                              booking.departure_date
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </strong>
                    </div>

                    <div className="booking-info-item">
                      <span>PNR Number</span>
                      <strong className="booking-pnr">
                        {booking.pnr}
                      </strong>
                    </div>

                    <div className="booking-info-item">
                      <span>Travel Class</span>
                      <strong>{booking.travel_class}</strong>
                    </div>

                    <div className="booking-info-item">
                      <span>Payment Status</span>

                      <strong
                        className={`booking-payment ${
                          booking.payment_status?.toLowerCase() === "paid"
                            ? "payment-success"
                            : ""
                        }`}
                      >
                        {booking.payment_status}
                      </strong>
                    </div>

                  </div>

                  {/* Passenger Section */}
                  <div className="booking-passenger-section">

                    <div className="booking-passenger-heading">
                      <h3>Passenger Details</h3>

                      <span>
                        {bookingGroup.length}{" "}
                        {bookingGroup.length === 1
                          ? "Passenger"
                          : "Passengers"}
                      </span>
                    </div>

                    <div className="booking-passenger-list">

                      {bookingGroup.map((passenger, i) => (
                        <div
                          key={i}
                          className="passenger-box"
                        >

                          <div className="passenger-avatar">
                            {passenger.passenger_name
                              ?.charAt(0)
                              .toUpperCase() || "P"}
                          </div>

                          <div className="passenger-details">
                            <h4>
                              {passenger.passenger_name}
                            </h4>

                            <div className="passenger-meta">
                              <span>
                                Age: {passenger.passenger_age}
                              </span>

                              <span>
                                Gender: {passenger.passenger_gender}
                              </span>

                              <span className="passenger-seat">
                                Seat: {passenger.seat_no}
                              </span>
                            </div>
                          </div>

                        </div>
                      ))}

                    </div>

                  </div>

                  {/* Card Footer */}
                  <div className="booking-card-footer">

                    <div className="booking-footer-pnr">
                      <span>Booking Reference</span>
                      <strong>{booking.pnr}</strong>
                    </div>

                    <button
                      className="view-ticket-button"
                      onClick={() => {
                        navigate("/ticket", {
                          state: {
                            pnr: booking.pnr,
                            bool: true,
                          },
                        });
                      }}
                    >
                      View Ticket
                      <span> → </span>
                    </button>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="my-bookings-footer">

        <div className="my-bookings-footer-content">

          <div className="my-bookings-footer-brand">
            <span className="my-bookings-footer-plane">✈</span>
            <span>IndianAirConnect</span>
          </div>

          <p className="my-bookings-footer-tagline">
            Connecting India through the skies.
          </p>

          <div className="my-bookings-footer-links">
            <span>Safe Travel</span>
            <span className="my-bookings-footer-divider">|</span>
            <span>Comfort</span>
            <span className="my-bookings-footer-divider">|</span>
            <span>Convenience</span>
          </div>

          <div className="my-bookings-footer-bottom">
            © {new Date().getFullYear()} IndianAirConnect.
            All rights reserved.
          </div>

        </div>

      </footer>

    </div>
  );
}

export default Mybookings;
