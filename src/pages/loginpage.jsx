import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

    // IMPORTANT
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

    const [missingsignuppassword, setmissingsignuppassword] =
        useState(false);

    const [missingsignupuserid, setmissingsignupuserid] =
        useState(false);


    // Logout message
    useEffect(() => {

        const timer = setTimeout(() => {
            setshowlogout(false);
        }, 3000);

        return () => clearTimeout(timer);

    }, []);


    // Store userid
    useEffect(() => {

        localStorage.setItem("userid", userid);

    }, [userid]);


    // Reset password
    function handleresetpassword() {

        navigate("/reset_password");

    }


    // Popup proceed
    function handleProceed() {

        if (popupAction === "otp-send") {

            setShowPopup(false);

        }

        else if (popupAction === "otp-verified") {

            setShowPopup(false);

            // IMPORTANT
            setOtpVerified(true);

        }

        else if (popupAction === "email-exists") {

            setShowPopup(false);

        }

        else if (popupAction === "Invalid OTP") {

            setShowPopup(false);

            setOtpVerified(false);

        }

        else if (popupAction === "otp-error") {

            setShowPopup(false);

        }

        else if (popupAction === "Registration-Successful") {

            setShowPopup(false);

            setlogin(true);
            setsignup(false);

        }

        else if (popupAction === "login-failed") {

            setShowPopup(false);

        }
    }


    // =========================================================
    // LOGIN
    // =========================================================

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

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        userid: userid,
                        password: password
                    })
                }
            );

            const data = await res.json();

            console.log(data);


            if (data.success) {

                navigate("/flightssearchpage", {
                    state: {
                        k: true
                    }
                });

            }

            else {

                setPopupTitle("Login Failed");

                setPopupMessage(
                    "The User ID or Password you entered is incorrect. Please check your credentials and try again."
                );

                setPopupType("error");

                setPopupAction("login-failed");

                setShowPopup(true);
            }

        }

        catch (err) {

            console.log(err);

        }
    }


    // =========================================================
    // SEND OTP
    // =========================================================

    async function handlesendotp() 
    {   
        if (otpCooldown) 
        {
            return;
        }

        if (email.trim() === "") {

            setmissingemail(true);

            return;
        }

        setmissingemail(false);

        // Start 20 second cooldown
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

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email
                    })
                }
            );


            const data = await res.json();

            console.log("Send OTP response:", data);


            // OTP successfully sent
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


            // Email already exists
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


            // Other OTP error
            setPopupTitle("OTP Sending Failed");

            setPopupMessage(
                data.message ||
                "Unable to send OTP. Please try again."
            );

            setPopupType("error");

            setPopupAction("otp-error");

            setShowPopup(true);

        }

        catch (err) {

            console.log("Send OTP error:", err);

            setPopupTitle("Server Error");

            setPopupMessage(
                "Unable to connect to the server. Please try again later."
            );

            setPopupType("error");

            setPopupAction("otp-error");

            setShowPopup(true);
        }
    }


    // =========================================================
    // VERIFY OTP
    // =========================================================

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

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        otp: otp
                    })
                }
            );


            const data = await res.json();

            console.log("Verify OTP response:", data);


            // OTP verified
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


            // Invalid OTP
            setPopupTitle("Invalid OTP");

            setPopupMessage(
                "The OTP you entered is incorrect. Please check your email and enter the correct OTP to continue."
            );

            setPopupType("error");

            setPopupAction("Invalid OTP");

            setShowPopup(true);

        }

        catch (err) {

            console.log("Verify OTP error:", err);

            setPopupTitle("Server Error");

            setPopupMessage(
                "Unable to verify OTP. Please try again."
            );

            setPopupType("error");

            setPopupAction("otp-error");

            setShowPopup(true);
        }
    }


    // =========================================================
    // SIGN UP
    // =========================================================

    async function handlesignup(e) {

        e.preventDefault();


        if (
            signupuserid.trim() === "" &&
            signuppassword.trim() === ""
        ) {

            setmissingsignupuserid(true);
            setmissingsignuppassword(true);

            return;
        }


        if (signupuserid.trim() === "") 
        {

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

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        signupuserid: signupuserid,
                        signuppassword: signuppassword
                    })
                }
            );


            const data = await res.json();

            console.log(data);


            if (data.success) {

                setPopupTitle("Registration Successful");

                setPopupMessage(
                    "Your account has been created successfully. You can now login and start booking your flights with Vinayaka SkyWings Airlines."
                );

                setPopupType("success");

                setPopupAction("Registration-Successful");

                setShowPopup(true);
            }

            else {

                setPopupTitle("Registration Failed");

                setPopupMessage(
                    data.message || "Unable to create your account."
                );

                setPopupType("error");

                setPopupAction("otp-error");

                setShowPopup(true);
            }

        }

        catch (err) {

            console.log("Signup error:", err);

        }
    }


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="loginpage">

            {
                showlogout &&
                <div className="showlogout">
                    Logout Successfully
                </div>
            }


            {
                showPopup &&

                <Popup
                    title={popupTitle}
                    message={popupMessage}
                    popupType={popupType}
                    onProceed={handleProceed}
                />

            }


            <div className="login-card">


                <div className="login-header">

                    <h1>Welcome Dear Passenger</h1>


                    <div className="login-options">

                        <button
                            className="login"
                            onClick={() => {

                                setlogin(true);
                                setsignup(false);

                            }}
                        >
                            Login
                        </button>


                        <button
                            className="signup"
                            onClick={() => {

                                setsignup(true);
                                setlogin(false);

                            }}
                        >
                            SignUp
                        </button>

                    </div>

                </div>


                {/* =====================================================
                    LOGIN
                ===================================================== */}

                {
                    login &&

                    <>

                        <div className="fl1">

                            <h2 className="form-title">
                                Login Here
                            </h2>

                            <p className="form-subtitle">
                                Enter your User ID and Password to access your account.
                            </p>

                        </div>


                        <div className="flex1">

                            <label>
                                Enter your User ID:
                            </label>


                            <input
                                type="text"
                                placeholder="Enter your User ID"
                                value={userid}
                                onChange={(e) => {

                                    setuserid(e.target.value);

                                }}
                            />


                            {
                                missinguserid &&
                                <p className="p2">
                                    Please enter your user ID.
                                </p>
                            }

                        </div>


                        <div className="flex1">

                            <label>
                                Enter your Password:
                            </label>


                            <input
                                type="password"
                                placeholder="Enter your Password"
                                value={password}
                                onChange={(e) => {

                                    setpassword(e.target.value);

                                }}
                            />


                            {
                                missingpassword &&
                                <p className="p2">
                                    Please enter your password.
                                </p>
                            }

                        </div>


                        <div className="flex1">

                            <button
                                className="forgot-btn"
                                onClick={handleresetpassword}
                            >
                                Forgot Password
                            </button>


                            <button
                                type="button"
                                onClick={handlesubmit}
                                className="submit-btn1"
                            >
                                Submit
                            </button>

                        </div>

                    </>

                }


                {/* =====================================================
                    SIGNUP
                ===================================================== */}

                {
                    signup &&

                    <>

                        <div className="fl1">

                            <h2 className="form-title">
                                Create Your Account
                            </h2>

                            <p className="form-subtitle">
                                Register with your email to start booking flights.
                            </p>

                        </div>


                        {/* EMAIL */}

                        <div className="flex1">

                            <label>
                                Enter your Email:
                            </label>

                            <p>
                                Email is required for verification purpose.
                            </p>


                            <input
                                type="email"
                                placeholder="Enter your Email"
                                value={email}
                                onChange={(e) => {

                                    setemail(e.target.value);

                                }}
                            />


                            {
                                missingemail &&
                                <p className="p2">
                                    Please enter your email address.
                                </p>
                            }

                        </div>


                        <button
                            type="button"
                            className="submit-btn1"
                            onClick={handlesendotp}
                            disabled={otpCooldown}
                        >
                            {otpCooldown
                            ? `Resend OTP in ${remainingTime}s`
                            : "Send OTP"
                            }
                        </button>


                        {/* OTP */}

                        <div className="flex1">

                            <label>
                                Enter OTP:
                            </label>

                            <p>
                                OTP sent to your email.
                            </p>


                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength="6"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => {

                                    setotp(e.target.value);

                                }}
                            />


                            {
                                missingotp &&
                                <p className="p2">
                                    Please enter the OTP.
                                </p>
                            }

                        </div>


                        <button
                            type="button"
                            onClick={handleverifyotp}
                            className="submit-btn1"
                        >
                            Verify OTP
                        </button>


                        {/* USER ID + PASSWORD */}

                        {
                            otpVerified &&

                            <>

                                <div className="flex1">

                                    <label>
                                        Create your User ID:
                                    </label>

                                    <p>
                                        Create your User ID for login purpose.
                                    </p>


                                    <input
                                        type="text"
                                        placeholder="Enter your User ID"
                                        value={signupuserid}
                                        onChange={(e) => {

                                            signupsetuserid(e.target.value);

                                        }}
                                    />


                                    {
                                        missingsignupuserid &&
                                        <p className="p2">
                                            Please enter the UserId.
                                        </p>
                                    }

                                </div>


                                <div className="flex1">

                                    <label>
                                        Create your Password:
                                    </label>

                                    <p>
                                        Create a unique password for login purpose.
                                    </p>


                                    <input
                                        type="password"
                                        placeholder="Create your Password"
                                        value={signuppassword}
                                        onChange={(e) => {

                                            signupsetpassword(e.target.value);

                                        }}
                                    />


                                    {
                                        missingsignuppassword &&
                                        <p className="p2">
                                            Please enter the password.
                                        </p>
                                    }

                                </div>


                                <button
                                    type="button"
                                    onClick={handlesignup}
                                    className="submit-btn1"
                                >
                                    Register
                                </button>

                            </>

                        }

                    </>

                }

            </div>

        </div>

    );
}

export default Loginpage;