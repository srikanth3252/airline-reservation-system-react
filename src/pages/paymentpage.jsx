import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useRef } from "react";
import "../styles/paymentpage.css";

function Payment() {
    const location = useLocation();
    const navigate=useNavigate();
    const { flight, travelClass, noofpeople, ticketprice, seats } = location.state;

    const totalamount = ticketprice * noofpeople;

    const [paymentmethod, setpaymentmethod] = useState("");

    const [cardnumber, setcardnumber] = useState("");
    const [expirydate, setexpirydate] = useState("");
    const [cardcvv, setcardcvv] = useState("");

    const [upiid, setupiid] = useState("");

    const [netbankinguserid, setnetbankinguserid] = useState("");
    const [netbankingpassword, setnetbankingpassword] = useState("");

    //const [verifycredit,setverifycredit]=useState(false);
    const [verifycardnumber, setverifycardnumber] = useState(false);
    const [verifyexpirydate, setverifyexpirydate] = useState(false);
    const [verifycardcvv, setverifycardcvv] = useState(false);
    const [verifyotp,setverifyotp]=useState(false);

    const [verifyupi, setverifyupi] = useState(false);

    const [verifyuserid, setverifyuserid] = useState(false);

    const [verifypassword, setverifypassword] = useState(false);
    const [backendotp,setbackendotp]=useState("");

    const [otp, setotp] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("");

    const pnr = useRef("PNR" + Math.floor(Math.random() * 100000));

    async function handleotp() {
        async function sendotp() {
            const email = localStorage.getItem("email");

            let res = await fetch("http://127.0.0.1:814/send-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            return await res.json();
        }

        try {
            let data = await sendotp();
               setbackendotp(data.otp);
        } catch (err) {
            console.log(err);
        }
    }
    

    async function verifydetails()
{
    if(cardnumber.length !== 19)
    {
        setverifycardnumber(true);
    }
    else
    {
        setverifycardnumber(false);
    }

    if(expirydate.length !== 5)
    {
        setverifyexpirydate(true);
    }
    else
    {
        setverifyexpirydate(false);
    }

    if(cardcvv.length !== 3)
    {
        setverifycardcvv(true);
    }
    else
    {
        setverifycardcvv(false);
    }

    if (upiid === "" || !upiid.includes("@"))
{
    setverifyupi(true);
}
else
{
    setverifyupi(false);
}
   if(netbankinguserid === "")
{
    setverifyuserid(true);
}
else
{
    setverifyuserid(false);
}

if(netbankingpassword === "")
{
    setverifypassword(true);
}
else
{
    setverifypassword(false);
}

if(otp !== backendotp)
{
    setverifyotp(true);
}
else
{
    setverifyotp(false);
}

setShowPopup(true);

setPaymentStatus("⏳ Processing Payment...");

setTimeout(() => {
    setPaymentStatus("✅ Payment Successful!");

    setTimeout(() => {
        setPaymentStatus("🎫 Booking your ticket...");
    
        setTimeout(() => {
            // store passenger details into database
             storedata();
            // Navigate to ticket page
            navigate("/ticket", {
                state: {
                    flight,
                    travelClass,
                    noofpeople,
                    ticketprice,
                    seats,
                     pnr: pnr.current,
                    bool:false
                }
            });

        }, 1000);

    }, 1000);

}, 2000);
}
   
   async function storedata()
   {  
        const passengers =JSON.parse(localStorage.getItem("details")) || [];
        async function store_data()
        {
             let res=await fetch("http://127.0.0.1:814/store_data",{
 
                    method:"POST",
                    headers:
                    {
                        "content-Type":"application/json"
                    },
                    body:JSON.stringify({

                        flight_id: flight.flight_id,
                        user_id: localStorage.getItem("id"),
                        seats: seats,          
                        passengers: passengers,
                        travel_class: travelClass,
                        pnr: pnr.current
                    })
             });
             let data=await res.json();
             return data;
        }

        try
        {
            let res=await store_data();
            console.log(res.message);
        }
        catch(err)
        {
            console.log(err)
        }
   }

    return (
    <section className="payment">

         {
    showPopup &&
    <section className="payment-popup">

        <div className="payment-popup-box">

            <h2>{paymentStatus}</h2>

            <div className="loader"></div>

            <p>Please don't close this page.</p>

        </div>

    </section>
}
        <h1 className="payment-title">💳 Secure Payment</h1>

        <p className="payment-subtitle">
            Complete your payment to confirm your flight booking.
        </p>

        <div className="booking-summary">

            <h2>📋 Booking Summary</h2>

            <p><strong>Airline :</strong> {flight.airline_name}</p>

            <p>
                <strong>Route :</strong> {flight.from_city} ➜ {flight.to_city}
            </p>

            <p><strong>Travel Class :</strong> {travelClass}</p>

            <p><strong>Passengers :</strong> {noofpeople}</p>

            <p><strong>Seats :</strong> {seats.join(", ")}</p>

            <h3>Total Amount : ₹{totalamount}</h3>

        </div>

        <div className="payment-method">

            <h2>💰 Choose Payment Method</h2>

            <div className="radio-flex">
                <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    onChange={(e) => setpaymentmethod(e.target.value)}
                />
                <label>UPI</label>
            </div>

            <div className="radio-flex">
                <input
                    type="radio"
                    name="payment"
                    value="Credit Card"
                    onChange={(e) => setpaymentmethod(e.target.value)}
                />
                <label>Credit Card</label>
            </div>

            <div className="radio-flex">
                <input
                    type="radio"
                    name="payment"
                    value="Debit Card"
                    onChange={(e) => setpaymentmethod(e.target.value)}
                />
                <label>Debit Card</label>
            </div>

            <div className="radio-flex">
                <input
                    type="radio"
                    name="payment"
                    value="Net Banking"
                    onChange={(e) => setpaymentmethod(e.target.value)}
                />
                <label>Net Banking</label>
            </div>

        </div>

        {(paymentmethod === "Credit Card" ||
            paymentmethod === "Debit Card") && (

            <div className="payment-box">

                <h2>💳 {paymentmethod} Details</h2>

                <p>Please enter your card details to complete the payment.</p>

                <div className="credit-flex">

                    <label>Card Number</label>

                    <input
                        type="text"
                        placeholder="____ ____ ____ ____"
                        value={cardnumber}
                        maxLength={19}
                        onChange={(e) => setcardnumber(e.target.value)}
                    />

                    {
                        verifycardnumber &&
                        <div  className="para">
                            ! please enter the proper card number
                        </div>
                    }

                </div>

                <div className="credit-flex">

                    <label>Expiry Date</label>

                    <input
                        type="text"
                        placeholder="MM/YY"
                        value={expirydate}
                        onChange={(e) => setexpirydate(e.target.value)}
                    />
                    {
                        verifyexpirydate &&
                        <div  className="para">
                            ! please enter the proper expiry date
                        </div>
                    }

                </div>

                <div className="credit-flex">

                    <label>CVV</label>

                    <input
                        type="password"
                        placeholder="CVV"
                        value={cardcvv}
                        maxLength={3}
                        onChange={(e) => setcardcvv(e.target.value)}
                    />
                    {
                        verifycardcvv &&
                        <div  className="para">
                            ! please enter the proper cardcvv
                        </div>
                    }

                </div>

                <h3>Total Amount : ₹{totalamount}</h3>

                <button className="pay-btn" onClick={verifydetails}>
                    🔒 Pay ₹{totalamount}
                </button>

            </div>
        )}

        {paymentmethod === "UPI" && (

            <div className="payment-box">

                <h2>📱 UPI Payment</h2>

                <p>Enter your UPI ID and continue with the payment.</p>

                <div className="credit-flex">

                    <label>UPI ID</label>

                    <input
                        type="text"
                        placeholder="example@paytm"
                        value={upiid}
                        onChange={(e) => setupiid(e.target.value)}
                    />

                    {verifyupi &&
                      <div className="para">
                            Please enter a valid UPI ID.
                     </div>
                    }   

                </div>

                <h3>Total Amount : ₹{totalamount}</h3>

                <button className="pay-btn" onClick={verifydetails}>
                    🔒 Pay ₹{totalamount}
                </button>

            </div>
        )}

        {paymentmethod === "Net Banking" && (

            <div className="payment-box">

                <h2>🏦 Net Banking</h2>

                <p>Login using your net banking credentials.</p>

                <div className="credit-flex">

                    <label>User ID</label>

                    <input
                        type="text"
                        placeholder="Enter User ID"
                        value={netbankinguserid}
                        onChange={(e) =>
                            setnetbankinguserid(e.target.value)
                        }
                    />
                    {verifyuserid &&
    <div className="para" >
        Please enter your User ID.
    </div>
}

                </div>

                <div className="credit-flex">

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={netbankingpassword}
                        onChange={(e) =>
                            setnetbankingpassword(e.target.value)
                        }
                    />
                    {verifypassword &&
    <div className="para">
        Please enter your password.
    </div>
}

                </div>

                <button
                    className="submit-btn"
                    onClick={handleotp}
                >
                    Send OTP
                </button>

                <div className="credit-flex">

                    <label>Enter OTP</label>

                    <p>OTP has been sent to your registered email.</p>

                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setotp(e.target.value)}
                    />
                     {
                        verifyotp &&
                        <div  className="para">
                            ! Invalid OTP
                        </div>
                    }

                </div>

                <h3>Total Amount : ₹{totalamount}</h3>

                <button className="pay-btn" onClick={verifydetails}>
                    🔒 Pay ₹{totalamount}
                </button>

            </div>
        )}

    </section>
);
}

export default Payment;