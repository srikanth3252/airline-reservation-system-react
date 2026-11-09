
import { useNavigate } from "react-router-dom";
import "../styles/indexpage.css";

function Homepage() {
    const navigate = useNavigate();

    return (
        <div className="air-home">

            {/* NAVBAR */}
            <nav className="air-navbar">
                <div className="air-brand">
                    <span className="air-logo">✈</span>
                    <div>
                        <h2>Indian AirConnect</h2>
                        <span>YOUR JOURNEY, OUR PRIORITY</span>
                    </div>
                </div>

                <div className="air-nav-actions">
                    <a href="#home">Home</a>
                    <a href="#about">About Us</a>
                    <a href="#services">Our Services</a>
                    <button
                        className="air-login-btn"
                        onClick={() => navigate("/loginpage")}
                    >
                        Login / Sign Up
                    </button>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="air-hero" id="home">
                <div className="air-hero-content">

                    <span className="air-tag">
                        ✦ WELCOME ABOARD
                    </span>

                    <h1>
                        Explore The World,
                        <br />
                        <span>One Journey At A Time.</span>
                    </h1>

                    <p>
                        Experience comfortable, safe and seamless
                        air travel with Indian AirConnect Airlines.
                        Your next adventure starts here.
                    </p>

                    <div className="air-hero-buttons">
                        <button
                            className="air-primary-btn"
                            onClick={() => navigate("/loginpage")}
                        >
                            Get Started <span>→</span>
                        </button>

                        <a href="#about" className="air-secondary-btn">
                            Discover More
                        </a>
                    </div>

                    <div className="air-trust">
                        <div>
                            <strong>✈</strong>
                            <span>Comfortable Travel</span>
                        </div>
                        <div>
                            <strong>◆</strong>
                            <span>Secure Bookings</span>
                        </div>
                        <div>
                            <strong>★</strong>
                            <span>Reliable Service</span>
                        </div>
                    </div>
                </div>

                <div className="air-hero-visual">
                    <div className="air-orbit orbit-one"></div>
                    <div className="air-orbit orbit-two"></div>

                    <div className="air-plane-circle">
                        <span>✈</span>
                    </div>

                    <div className="air-floating-card">
                        <span>✦ YOUR NEXT ADVENTURE</span>
                        <h3>The World Awaits You</h3>
                        <p>Travel beyond boundaries.</p>
                    </div>

                    <div className="air-floating-icon">🌍</div>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section className="air-about" id="about">
                <div className="air-section-label">ABOUT US</div>

                <h2>
                    Making Every Journey
                    <span> Special</span>
                </h2>

                <p>
                    At Indian AirConnect Airlines, we believe that
                    every journey should be more than just reaching
                    a destination. We are committed to providing a
                    smooth booking experience, comfortable travel
                    and reliable service for every passenger.
                </p>
            </section>

            {/* SERVICES */}
            <section className="air-services" id="services">

                <div className="air-section-label">WHY CHOOSE US</div>

                <h2>Travel With Confidence</h2>

                <div className="air-service-grid">

                    <div className="air-service-card">
                        <div className="air-service-icon">✈</div>
                        <h3>Easy Flight Booking</h3>
                        <p>
                            Find available flights and book your
                            journey through a simple experience.
                        </p>
                    </div>

                    <div className="air-service-card">
                        <div className="air-service-icon">🛡</div>
                        <h3>Secure Experience</h3>
                        <p>
                            Enjoy a convenient booking process
                            with secure account access.
                        </p>
                    </div>

                    <div className="air-service-card">
                        <div className="air-service-icon">🎫</div>
                        <h3>Digital Tickets</h3>
                        <p>
                            Access your booking details and
                            digital tickets with ease.
                        </p>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="air-cta">
                <div>
                    <span>YOUR JOURNEY STARTS HERE</span>
                    <h2>Ready To Take Off?</h2>
                    <p>
                        Discover new destinations and make your
                        next journey memorable.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/loginpage")}
                >
                    Start Your Journey →
                </button>
            </section>

            {/* FOOTER */}
            <footer className="air-footer">
                <div className="air-footer-main">

                    <div className="air-footer-brand">
                        <h2>✈ Indian AirConnect</h2>
                        <p>
                            Connecting destinations, creating
                            memories and making every journey special.
                        </p>
                    </div>

                    <div>
                        <h3>Quick Links</h3>
                        <a href="#home">Home</a>
                        <a href="#about">About Us</a>
                        <a href="#services">Services</a>
                    </div>

                    <div>
                        <h3>Account</h3>
                        <button onClick={() => navigate("/loginpage")}>
                            Login
                        </button>
                        <button onClick={() => navigate("/loginpage")}>
                            Get Started
                        </button>
                    </div>

                    <div>
                        <h3>Our Promise</h3>
                        <p>Comfortable Travel</p>
                        <p>Reliable Service</p>
                        <p>Easy Bookings</p>
                    </div>

                </div>

                <div className="air-footer-bottom">
                    <p>© {new Date().getFullYear()} Indian AirConnect Airlines. All rights reserved.</p>
                    <span>Travel Beyond Boundaries ✈</span>
                </div>
            </footer>

        </div>
    );
}

export default Homepage;
