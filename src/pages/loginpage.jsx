
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../styles/loginpage.css";
import Popup from "../components/popuppage.jsx";

function Loginpage() {
    const navigate = useNavigate();
    const location = useLocation();
    const k = location.state?.k || false;

    const [otpCooldown, setOtpCooldown] = useState(false);
    const [remainingTime, setRemainingTime] = useState(29);
    const [showlogout, setshowlogout] = useState(k);

    const [login, setlogin] = useState(true);
    const [signup, setsignup] = useState(false);

    const [userid, setuserid] = useState("");
    const [password, setpassword] = useState("");
    const [signupuserid, signupsetuserid] = useState("");
    const [signuppassword, signupsetpassword] = useState("");
    const [email, setemail] = useState("");
    const [otp, setotp] = useState("");
    const [otpVerified, setOtpVerified] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState("");
    const [popupAction, setPopupAction] = useState("");

    const [missinguserid, setmissinguserid] = useState(false);
    const [missingpassword, setmissingpassword] = useState(false);
    const [missingotp, setmissingotp] = useState(false);
    const [missingemail, setmissingemail] = useState(false);
    const [missingsignuppassword, setmissingsignuppassword] = useState(false);
    const [missingsignupuserid, setmissingsignupuserid] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setshowlogout(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem("userid", userid);
    }, [userid]);

    function handleresetpassword() {
        navigate("/reset_password");
    }

    function handleProceed() {
        if (popupAction === "otp-send" || popupAction === "email-exists" ||
            popupAction === "otp-error" || popupAction === "login-failed") {
            setShowPopup(false);
        } else if (popupAction === "otp-verified") {
            setShowPopup(false);
            setOtpVerified(true);
        } else if (popupAction === "Invalid OTP") {
            setShowPopup(false);
            setOtpVerified(false);
        } else if (popupAction === "Registration-Successful") {
            setShowPopup(false);
            setlogin(true);
            setsignup(false);
        }
    }

    async function handlesubmit(e) {
        e.preventDefault();

        if (userid.trim() === "" && password.trim() === "") {
            setmissinguserid(true);
            setmissingpassword(true);
            return;
        }
        if (userid.trim() === "") {
            setmissinguserid(true);
            return;
        }
        setmissinguserid(false);

        if (password.trim() === "") {
            setmissingpassword(true);
            return;
        }
        setmissingpassword(false);

        try {
            const res = await fetch(
                "https://airline-backend-zdo5.onrender.com/verify_for_login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userid, password })
                }
            );

            const data = await res.json();

            if (data.success) {
               localStorage.setItem("userid", data.userid);
                navigate("/flightssearchpage", { replace: true });
            } else {
                setPopupTitle("Login Failed");
                setPopupMessage(
                    "The User ID or Password you entered is incorrect. Please check your credentials and try again."
                );
                setPopupType("error");
                setPopupAction("login-failed");
                setShowPopup(true);
            }
        } catch (err) {
            console.log(err);
            setPopupTitle("Server Error");
            setPopupMessage("Unable to connect to the server. Please try again.");
            setPopupType("error");
            setPopupAction("login-failed");
            setShowPopup(true);
        }
    }

    async function handlesendotp() {
        if (otpCooldown) return;

        if (email.trim() === "") {
            setmissingemail(true);
            return;
        }
        setmissingemail(false);

        setOtpCooldown(true);
        setRemainingTime(29);

        const timer = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setOtpCooldown(false);
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        try {
            const res = await fetch(
                "https://airline-backend-zdo5.onrender.com/send-otp",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                }
            );

            const data = await res.json();

            if (data.success) {
                setPopupTitle("OTP Sent Successfully");
                setPopupMessage(
                    "An OTP has been sent to your email address. Please check your inbox and enter the OTP below."
                );
                setPopupType("info");
                setPopupAction("otp-send");
                setShowPopup(true);
                return;
            }

            if (data.message === "Email already exists") {
                setPopupTitle("Email Already Registered");
                setPopupMessage(
                    "An account with this email address already exists. Please use a different email address or sign in with your existing account."
                );
                setPopupType("error");
                setPopupAction("email-exists");
                setShowPopup(true);
                return;
            }

            setPopupTitle("OTP Sending Failed");
            setPopupMessage(data.message || "Unable to send OTP. Please try again.");
            setPopupType("error");
            setPopupAction("otp-error");
            setShowPopup(true);
        } catch (err) {
            setPopupTitle("Server Error");
            setPopupMessage("Unable to connect to the server. Please try again later.");
            setPopupType("error");
            setPopupAction("otp-error");
            setShowPopup(true);
        }
    }

    async function handleverifyotp() {
        if (otp.trim() === "") {
            setmissingotp(true);
            return;
        }
        setmissingotp(false);

        try {
            const res = await fetch(
                "https://airline-backend-zdo5.onrender.com/verify-otp",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, otp })
                }
            );

            const data = await res.json();

            if (data.success) {
                setPopupTitle("OTP Verified");
                setPopupMessage(
                    "Your email has been verified successfully. You can now create your User ID and Password to complete your registration."
                );
                setPopupType("success");
                setPopupAction("otp-verified");
                setShowPopup(true);
                return;
            }

            setPopupTitle("Invalid OTP");
            setPopupMessage(
                "The OTP you entered is incorrect. Please check your email and enter the correct OTP to continue."
            );
            setPopupType("error");
            setPopupAction("Invalid OTP");
            setShowPopup(true);
        } catch (err) {
            setPopupTitle("Server Error");
            setPopupMessage("Unable to verify OTP. Please try again.");
            setPopupType("error");
            setPopupAction("otp-error");
            setShowPopup(true);
        }
    }

    async function handlesignup(e) {
        e.preventDefault();

        if (signupuserid.trim() === "" && signuppassword.trim() === "") {
            setmissingsignupuserid(true);
            setmissingsignuppassword(true);
            return;
        }

        if (signupuserid.trim() === "") {
            setmissingsignupuserid(true);
            return;
        }
        setmissingsignupuserid(false);

        if (signuppassword.trim() === "") {
            setmissingsignuppassword(true);
            return;
        }
        setmissingsignuppassword(false);

        try {
            const res = await fetch(
                "https://airline-backend-zdo5.onrender.com/sign-up",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email,
                        signupuserid,
                        signuppassword
                    })
                }
            );

            const data = await res.json();

            if (data.success) {
                setPopupTitle("Registration Successful");
                setPopupMessage(
                    "Your account has been created successfully. You can now login and start booking your flights with Indian AirConnect Airlines."
                );
                setPopupType("success");
                setPopupAction("Registration-Successful");
                setShowPopup(true);
            } else {
                setPopupTitle("Registration Failed");
                setPopupMessage(data.message || "Unable to create your account.");
                setPopupType("error");
                setPopupAction("otp-error");
                setShowPopup(true);
            }
        } catch (err) {
            console.log("Signup error:", err);
            setPopupTitle("Server Error");
            setPopupMessage("Unable to connect to the server. Please try again.");
            setPopupType("error");
            setPopupAction("otp-error");
            setShowPopup(true);
        }
    }

    return (
        <div className="loginpage">
            {showlogout && <div className="showlogout">Logout Successfully</div>}

            {showPopup && (
                <Popup
                    title={popupTitle}
                    message={popupMessage}
                    popupType={popupType}
                    onProceed={handleProceed}
                />
            )}

            <nav className="air-login-navbar">
                <Link to="/" className="air-login-brand">
                    <span className="brand-plane">✈</span>
                    <span>Indian <strong>AirConnect</strong>
                        <small>AIRLINES</small>
                    </span>
                </Link>
                <div className="air-login-navlinks">
                    <Link to="/">Home</Link>
                    <a href="#login-form">Flights</a>
                    <a href="#air-footer">About</a>
                    <a href="#air-footer">Contact</a>
                </div>
            </nav>

            <main className="air-login-hero">
                <section className="air-login-promo">
                    <span className="promo-tag">YOUR JOURNEY STARTS HERE</span>
                    <h1>Fly Higher.<br />Travel <span>Smarter.</span></h1>
                    <div className="promo-line"></div>
                    <p>Book your flights, manage bookings<br />
                        and travel with comfort.</p>
                    <div className="promo-plane">✈</div>
                </section>

                <section className="login-card" id="login-form">
                    <div className="login-header">
                        <div className="login-card-brand">
                            <span>✈</span> Indian <strong>AirConnect</strong>
                            <small>AIRLINES</small>
                        </div>

                        <h2>{login ? "Welcome Back" : "Create Account"}</h2>
                        <p>{login ? "Login to continue your journey" : "Join us for your next journey"}</p>

                        <div className="login-options">
                            <button
                                type="button"
                                className={login ? "login active" : "login"}
                                onClick={() => { setlogin(true); setsignup(false); }}
                            >Login</button>
                            <button
                                type="button"
                                className={signup ? "signup active" : "signup"}
                                onClick={() => { setsignup(true); setlogin(false); }}
                            >Create Account</button>
                        </div>
                    </div>

                    {login && (
                        <form className="air-login-form" onSubmit={handlesubmit}>
                            <div className="flex1">
                                <label>User ID</label>
                                <input
                                    type="text"
                                    placeholder="Enter your User ID"
                                    value={userid}
                                    onChange={(e) => setuserid(e.target.value)}
                                />
                                {missinguserid && <p className="p2">Please enter your user ID.</p>}
                            </div>

                            <div className="flex1">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setpassword(e.target.value)}
                                />
                                {missingpassword && <p className="p2">Please enter your password.</p>}
                            </div>

                            <button type="button" className="forgot-btn" onClick={handleresetpassword}>
                                Forgot Password?
                            </button>

                            <button type="submit" className="submit-btn1">✈ &nbsp; Sign In</button>
                        </form>
                    )}

                    {signup && (
                        <form className="air-login-form" onSubmit={handlesignup}>
                            <div className="flex1">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setemail(e.target.value)}
                                />
                                <p className="field-help">Email is required for verification.</p>
                                {missingemail && <p className="p2">Please enter your email address.</p>}
                            </div>

                            <button
                                type="button"
                                className="submit-btn1 secondary-submit"
                                onClick={handlesendotp}
                                disabled={otpCooldown}
                            >
                                {otpCooldown ? `Resend OTP in ${remainingTime}s` : "Send OTP"}
                            </button>

                            <div className="flex1">
                                <label>Verification OTP</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="6"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setotp(e.target.value)}
                                />
                                {missingotp && <p className="p2">Please enter the OTP.</p>}
                            </div>

                            <button type="button" className="submit-btn1 secondary-submit" onClick={handleverifyotp}>
                                Verify OTP
                            </button>

                            {otpVerified && (
                                <>
                                    <div className="verified-message">✓ Email verified successfully</div>
                                    <div className="flex1">
                                        <label>Create User ID</label>
                                        <input
                                            type="text"
                                            placeholder="Create your User ID"
                                            value={signupuserid}
                                            onChange={(e) => signupsetuserid(e.target.value)}
                                        />
                                        {missingsignupuserid && <p className="p2">Please enter the User ID.</p>}
                                    </div>

                                    <div className="flex1">
                                        <label>Create Password</label>
                                        <input
                                            type="password"
                                            placeholder="Create your password"
                                            value={signuppassword}
                                            onChange={(e) => signupsetpassword(e.target.value)}
                                        />
                                        {missingsignuppassword && <p className="p2">Please enter the password.</p>}
                                    </div>

                                    <button type="submit" className="submit-btn1">Create Account</button>
                                </>
                            )}
                        </form>
                    )}

                    <div className="login-card-bottom">
                        <span>✈</span>
                        <p>Travel with comfort. Fly with confidence.</p>
                    </div>
                </section>
            </main>

            <footer className="air-login-footer" id="air-footer">
                <Link to="/" className="air-login-brand footer-brand">
                    <span className="brand-plane">✈</span>
                    <span>Indian <strong>AirConnect</strong><small>AIRLINES</small></span>
                </Link>
                <div className="footer-links">
                    <a href="#air-footer">Privacy Policy</a>
                    <a href="#air-footer">Terms & Conditions</a>
                    <a href="#air-footer">Help & Support</a>
                </div>
                <p>© 2026 Indian AirConnect Airlines. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default Loginpage;
