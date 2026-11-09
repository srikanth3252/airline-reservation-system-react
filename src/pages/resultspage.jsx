
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import "../styles/resultspage.css";
import FlightCard from "../components/flight-card.jsx";

const API = "https://airline-backend-zdo5.onrender.com";

function Flightresutls() {
    const location = useLocation();
    const navigate = useNavigate();

    const initial = location.state || {};

    const [data, setData] = useState(initial.data || []);
    const [classtype] = useState(initial.classtype || "Economy");
    const [val] = useState(initial.val || 1);

    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(initial.message || "");
    const [hasSearched, setHasSearched] = useState(false);

    // Fetch flights from backend
    const fetchFlights = async (searchValue = "") => {
        try {
            setLoading(true);
            setMessage("");

            const response = await axios.get(`${API}/search_flights`, {
                params: {
                    keyword: searchValue
                }
            });

            if (response.data.success) {
                setData(response.data.data || []);
                setMessage(response.data.message || "");
            } else {
                setData([]);
                setMessage(response.data.message || "No flights found.");
            }

        } catch (error) {
            console.error("Flight search error:", error);

            setData([]);
            setMessage(
                error.response?.data?.message ||
                "Unable to fetch flights. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Search form submit
    const handleSearch = (e) => {
        e.preventDefault();
        setHasSearched(true);
        fetchFlights(keyword.trim());
    };

    // Clear search and fetch all flights
    const handleClear = () => {
        setKeyword("");
        setHasSearched(false);
        fetchFlights("");
    };

    // Initial flights from previous search state
    useEffect(() => {
        if (!Array.isArray(initial.data)) {
            fetchFlights("");
        }
    }, []);

    return (
        <div className="Flightresutls">

            {/* NAVBAR */}
            <nav className="results-navbar">
                <div
                    className="results-brand"
                    onClick={() => navigate("/")}
                >
                    <span className="results-brand-icon">✈</span>
                    <span>Indian<span>AirConnect</span></span>
                </div>

                <button
                    className="results-back-btn"
                    onClick={() => navigate("/flightssearchpage")}
                >
                    ← Modify Search
                </button>
            </nav>

            <main className="results-main">

                {/* HEADING */}
                <div className="results-heading">
                    <span className="results-eyebrow">
                        YOUR JOURNEY STARTS HERE
                    </span>

                    <h1>
                        Flight <span>Search Results</span>
                    </h1>

                    <p>
                        Choose your preferred flight and get ready to fly.
                    </p>

                    <div className="results-summary">
                        <span>✈ Available Flights</span>
                        <span>💺 {val} Passenger(s)</span>
                        <span>Class: {classtype}</span>
                    </div>
                </div>

                {/* SEARCH BAR */}
                <section className="results-search-section">
                    <form
                        className="results-search-form"
                        onSubmit={handleSearch}
                    >
                        <div className="results-search-input-wrapper">
                            <span className="results-search-icon">🔍</span>

                            <input
                                type="text"
                                placeholder="Search airline, flight number, from city or destination..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="results-search-btn"
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>

                        {keyword && (
                            <button
                                type="button"
                                className="results-clear-btn"
                                onClick={handleClear}
                            >
                                Clear
                            </button>
                        )}
                    </form>

                    <p className="results-search-hint">
                        Search by airline name, flight number, departure city,
                        or destination city.
                    </p>
                </section>

                {/* RESULTS */}
                <section className="results-content">

                    <div className="results-list-heading">
                        <h2>
                            {hasSearched
                                ? "Search Results"
                                : "Available Flights"}
                        </h2>

                        <span>
                            {data.length} flight(s)
                        </span>
                    </div>

                    {loading ? (
                        <div className="results-status">
                            <div className="results-loader"></div>
                            <p>Searching flights...</p>
                        </div>
                    ) : data.length > 0 ? (
                        <div className="results-list">
                            {data.map((flight) => (
                                <FlightCard
                                    key={flight.flight_id}
                                    flight={flight}
                                    travelClass={classtype}
                                    val={val}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="results-empty">
                            <div className="results-empty-icon">✈</div>

                            <h2>No Flights Found</h2>

                            <p>
                                {message ||
                                    "Try searching with another airline name or flight number."}
                            </p>

                            <button onClick={handleClear}>
                                Show All Flights
                            </button>
                        </div>
                    )}

                </section>

            </main>

            {/* FOOTER */}
            <footer className="results-footer">
                <div className="results-footer-main">
                    <div className="results-footer-brand">
                        <span>✈ IndianAirConnect</span>
                        <p>Your journey, our commitment.</p>
                    </div>

                    <div className="results-footer-links">
                        <span>Safe Travels</span>
                        <span>Reliable Flights</span>
                        <span>Easy Booking</span>
                    </div>
                </div>

                <div className="results-footer-bottom">
                    © {new Date().getFullYear()} IndianAirConnect.
                    All rights reserved.
                </div>
            </footer>

        </div>
    );
}

export default Flightresutls;
