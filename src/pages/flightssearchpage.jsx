
import "../styles/flightssearchpage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Search() {
    const navigate = useNavigate();
    const location = useLocation();

    const [from, setfrom] = useState("");
    const [to, setto] = useState("");
    const [date, setdate] = useState("");
    const [Passengertype, setPassengertype] = useState("Adults");
    const [val, setval] = useState(1);
    const [classtype, setclasstype] = useState("Economy");

    const [missingfrom, setmissingfrom] = useState(false);
    const [missingto, setmissingto] = useState(false);
    const [missingdate, setmissingdate] = useState(false);

    const [showlogin, setshowlogin] = useState(false);
    const [loading, setloading] = useState(false);

    // Show login success only when navigation state contains k=true
    useEffect(() => {
        if (location.state?.k === true) {
            setshowlogin(true);

            // Clear navigation state to prevent repeated success messages
            navigate(location.pathname, {
                replace: true,
                state: null
            });

            const timer = setTimeout(() => {
                setshowlogin(false);
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [location.state, location.pathname, navigate]);

    // Flight search
    async function handlesearch() {
        let error = false;

        setmissingfrom(!from);
        setmissingto(!to);
        setmissingdate(!date);

        if (!from || !to || !date) {
            error = true;
        }

        if (from === to && from) {
            alert("Departure and destination cannot be the same.");
            error = true;
        }

        if (Number(val) < 1 || !Number.isInteger(Number(val))) {
            alert("Please enter at least one passenger.");
            error = true;
        }

        if (Number(val) > 9) {
            alert("Maximum 9 passengers allowed.");
            error = true;
        }

        if (error) return;

        try {
            setloading(true);

            const response = await fetch(
                "https://airline-backend-zdo5.onrender.com/get_flights",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        from,
                        to,
                        date,
                        Passengertype,
                        val: Number(val),
                        classtype
                    })
                }
            );

            const result = await response.json();

            navigate("/flightresutls", {
                state: {
                    success: result.success,
                    message: result.message,
                    data: result.data,
                    classtype,
                    val: Number(val)
                }
            });

        } catch (error) {
            console.error(error);
            alert("Unable to search flights. Please try again.");
        } finally {
            setloading(false);
        }
    }

    // Account navigation
    function handlenavigation(goal) {
        if (goal === "profile") {
            navigate("/profile");
        }

        if (goal === "bookings") {
            navigate("/mybookings");
        }

        if (goal === "logout") {
            localStorage.removeItem("userid");

            // Logout must not trigger Login Successfully
            navigate("/loginpage");
        }
    }

    const cities = [
        "Mumbai",
        "Chennai",
        "Delhi",
        "Hyderabad",
        "Bangalore"
    ];

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="flightssearchpage">

            {/* Login success notification */}
            {showlogin && (
                <div className="showlogin">
                    ✓ Login Successfully
                </div>
            )}

            {/* Navbar */}
            <nav className="flight-navbar">

                <div className="flight-brand">
                    <span className="flight-logo">✈</span>

                    <div>
                        <h2>Indian AirConnect</h2>
                        <span>YOUR JOURNEY, OUR PRIORITY</span>
                    </div>
                </div>

                <div className="flight-nav-right">
                    <span className="flight-nav-label">
                        BOOK YOUR JOURNEY
                    </span>

                    <div className="profile">
                        <span className="profile-icon">👤</span>

                        <select
                            className="profile-select"
                            defaultValue=""
                            onChange={(e) =>
                                handlenavigation(e.target.value)
                            }
                        >
                            <option value="" disabled>
                                Account Menu
                            </option>

                            <option value="profile">
                                My Profile
                            </option>

                            <option value="bookings">
                                My Bookings
                            </option>

                            <option value="logout">
                                Logout
                            </option>
                        </select>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="flight-search-main">

                {/* Welcome section */}
                <section className="flight-welcome">
                    <span className="flight-eyebrow">
                        ✦ YOUR NEXT ADVENTURE
                    </span>

                    <h1>
                        Where would you like to <span>fly?</span>
                    </h1>

                    <p>
                        Discover flights, explore destinations and book your journey.
                    </p>
                </section>

                {/* Flight search card */}
                <section className="in-box">

                    <div className="search-card-heading">
                        <div className="search-heading-icon">
                            ✈
                        </div>

                        <div>
                            <h2>Search Flights</h2>
                            <p>Find the perfect flight for your journey</p>
                        </div>
                    </div>

                    <div className="flight-form-grid">

                        {/* Departure */}
                        <div className="flexs1">
                            <label>Departure City</label>

                            <select
                                value={from}
                                onChange={(e) => setfrom(e.target.value)}
                            >
                                <option value="">
                                    Select Departure
                                </option>

                                {cities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>

                            {missingfrom && (
                                <p className="p1">
                                    Select departure city.
                                </p>
                            )}
                        </div>

                        {/* Destination */}
                        <div className="flexs1">
                            <label>Destination City</label>

                            <select
                                value={to}
                                onChange={(e) => setto(e.target.value)}
                            >
                                <option value="">
                                    Select Destination
                                </option>

                                {cities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>

                            {missingto && (
                                <p className="p1">
                                    Select destination city.
                                </p>
                            )}
                        </div>

                        {/* Date */}
                        <div className="flexs1">
                            <label>Departure Date</label>

                            <input
                                type="date"
                                min={today}
                                value={date}
                                onChange={(e) => setdate(e.target.value)}
                            />

                            {missingdate && (
                                <p className="p1">
                                    Select travel date.
                                </p>
                            )}
                        </div>

                        {/* Passenger type */}
                        <div className="flexs1">
                            <label>Passenger Type</label>

                            <select
                                value={Passengertype}
                                onChange={(e) =>
                                    setPassengertype(e.target.value)
                                }
                            >
                                <option value="Adults">
                                    Adults (12+ Years)
                                </option>

                                <option value="Children">
                                    Children (2-11 Years)
                                </option>

                                <option value="Infants">
                                    Infants (Below 2 Years)
                                </option>
                            </select>
                        </div>

                        {/* Passenger count */}
                        <div className="flexs1">
                            <label>Number of Passengers</label>

                            <input
                                type="number"
                                min="1"
                                max="9"
                                value={val}
                                onChange={(e) => setval(e.target.value)}
                            />
                        </div>

                        {/* Travel class */}
                        <div className="flexs1">
                            <label>Travel Class</label>

                            <select
                                value={classtype}
                                onChange={(e) => setclasstype(e.target.value)}
                            >
                                <option value="Economy">
                                    Economy
                                </option>

                                <option value="Premium Economy">
                                    Premium Economy
                                </option>

                                <option value="Business">
                                    Business
                                </option>

                                <option value="First Class">
                                    First Class
                                </option>
                            </select>
                        </div>

                    </div>

                    {/* Search button */}
                    <button
                        className="btn1"
                        onClick={handlesearch}
                        disabled={loading}
                    >
                        {loading
                            ? "Searching Flights..."
                            : "Search Available Flights"}

                        <span>→</span>
                    </button>

                    <div className="search-security">
                        🔒 Secure booking experience • Easy flight discovery
                    </div>

                </section>

                <div className="flight-search-note">
                    <span>✦</span> Your journey begins with a destination.
                </div>

                {/* Benefits */}
                <section className="flight-benefits">

                    <div>
                        <span>✈</span>
                        <strong>Easy Booking</strong>
                        <p>Book your journey in a few simple steps.</p>
                    </div>

                    <div>
                        <span>🔒</span>
                        <strong>Secure Journey</strong>
                        <p>Your booking details stay protected.</p>
                    </div>

                    <div>
                        <span>🎫</span>
                        <strong>Instant Confirmation</strong>
                        <p>Get your booking details after payment.</p>
                    </div>

                </section>

            </main>

            {/* Footer */}
            <footer className="flight-footer">

                <div className="flight-footer-main">

                    <div className="flight-footer-brand">
                        <h2>✈ Indian AirConnect</h2>

                        <p>
                            Connecting destinations and making every journey special.
                        </p>
                    </div>

                    <div className="flight-footer-links">
                        <span>Explore</span>
                        <p>Flight Search</p>
                        <p>My Bookings</p>
                    </div>

                    <div className="flight-footer-links">
                        <span>Support</span>
                        <p>Safe & Secure Booking</p>
                        <p>Customer Assistance</p>
                    </div>

                </div>

                <div className="flight-footer-bottom">
                    © {new Date().getFullYear()} Indian AirConnect. All rights reserved.
                </div>

            </footer>

        </div>
    );
}

export default Search;
