import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/paymentpage.css";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state;

  if (!booking) {
    return (
      <main className="payment-page">
        <div className="payment-error">
          <h2>Booking details unavailable</h2>
          <p>Please select a flight and continue booking again.</p>
          <button onClick={() => navigate("/flightssearchpage")}>Search Flights</button>
        </div>
      </main>
    );
  }

  const { flight, travelClass, noofpeople, ticketprice, seats } = booking;
  const totalamount = Number(ticketprice) * Number(noofpeople);
  const pnr = useRef("PNR" + Math.floor(100000 + Math.random() * 900000));

  const [paymentmethod, setpaymentmethod] = useState("");
  const [cardnumber, setcardnumber] = useState("");
  const [expirydate, setexpirydate] = useState("");
  const [cardcvv, setcardcvv] = useState("");
  const [upiid, setupiid] = useState("");
  const [netbankinguserid, setnetbankinguserid] = useState("");
  const [netbankingpassword, setnetbankingpassword] = useState("");
  const [otp, setotp] = useState("");
  const [backendotp, setbackendotp] = useState("");
  const [otpSent, setotpSent] = useState(false);
  const [error, seterror] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [processing, setprocessing] = useState(false);

  const cardDigits = cardnumber.replace(/\D/g, "");

  const sendOTP = async () => {
    seterror("");
    if (!netbankinguserid.trim() || !netbankingpassword) {
      seterror("Enter your Net Banking User ID and password first.");
      return;
    }
    try {
      const email = localStorage.getItem("email");
      const response = await fetch("https://airline-backend-zdo5.onrender.com/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok || !data.otp) throw new Error(data.message || "Could not send OTP.");
      setbackendotp(String(data.otp));
      setotpSent(true);
      seterror("");
    } catch (err) {
      seterror(err.message || "OTP sending failed. Please try again.");
    }
  };

  const storedata = async () => {
    const passengers = JSON.parse(localStorage.getItem("details") || "[]");
    const response = await fetch("https://airline-backend-zdo5.onrender.com/store_data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flight_id: flight.flight_id,
        user_id: localStorage.getItem("id"),
        seats,
        passengers,
        travel_class: travelClass,
        pnr: pnr.current,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Booking could not be stored.");
    return data;
  };

  const verifydetails = async () => {
    seterror("");
    if (!paymentmethod) return seterror("Please choose a payment method.");

    if (paymentmethod === "Credit Card" || paymentmethod === "Debit Card") {
      if (cardDigits.length !== 16) return seterror("Enter a valid 16-digit card number.");
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirydate)) return seterror("Enter expiry in MM/YY format.");
      if (cardcvv.length !== 3 || !/^\d{3}$/.test(cardcvv)) return seterror("Enter a valid 3-digit CVV.");
    }
    if (paymentmethod === "UPI" && !/^[\w.-]+@[\w.-]+$/.test(upiid.trim())) {
      return seterror("Enter a valid UPI ID.");
    }
    if (paymentmethod === "Net Banking") {
      if (!netbankinguserid.trim() || !netbankingpassword) return seterror("Enter Net Banking credentials.");
      if (!otpSent) return seterror("Please send OTP first.");
      if (String(otp).trim() !== backendotp) return seterror("Invalid OTP.");
    }

    setprocessing(true);
    setShowPopup(true);
    setPaymentStatus("Processing payment…");

    try {
      // Demo payment flow; use a real payment gateway for actual transactions.
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setPaymentStatus("Payment successful!");
      await new Promise((resolve) => setTimeout(resolve, 700));
      setPaymentStatus("Confirming your booking…");
      await storedata();
      navigate("/ticket", {
        state: {
          flight,
          travelClass,
          noofpeople,
          ticketprice,
          seats,
          pnr: pnr.current,
          bool: false,
        },
      });
    } catch (err) {
      setShowPopup(false);
      setprocessing(false);
      seterror(err.message || "Booking failed. Please try again.");
    }
  };

  return (
    <main className="payment-page">
      {showPopup && (
        <div className="payment-popup">
          <div className="payment-popup-box">
            <div className="payment-spinner" />
            <h2>{paymentStatus}</h2>
            <p>Please don't close this page.</p>
          </div>
        </div>
      )}

      <header className="payment-header">
        <span className="payment-step">STEP 3 OF 3</span>
        <h1>Complete your payment</h1>
        <p>Choose a payment method to confirm your flight booking.</p>
      </header>

      <div className="payment-layout">
        <section className="payment-main">
          <div className="payment-panel">
            <div className="payment-panel-heading">
              <span className="payment-icon">₹</span>
              <div><h2>Payment method</h2><p>Select your preferred option</p></div>
            </div>

            <div className="payment-method-options">
              {[
                { value: "UPI", title: "UPI", desc: "Pay using your UPI ID", icon: "📱" },
                { value: "Credit Card", title: "Credit Card", desc: "Visa, Mastercard, etc.", icon: "💳" },
                { value: "Debit Card", title: "Debit Card", desc: "Pay using your debit card", icon: "💳" },
                { value: "Net Banking", title: "Net Banking", desc: "Bank account + OTP", icon: "🏦" },
              ].map((method) => (
                <label className={`payment-method-option ${paymentmethod === method.value ? "selected" : ""}`} key={method.value}>
                  <input
                    type="radio"
                    name="payment"
                    value={method.value}
                    checked={paymentmethod === method.value}
                    onChange={(e) => { setpaymentmethod(e.target.value); seterror(""); }}
                  />
                  <span className="payment-method-icon">{method.icon}</span>
                  <span className="payment-method-copy"><strong>{method.title}</strong><small>{method.desc}</small></span>
                  <span className="payment-method-check">{paymentmethod === method.value ? "✓" : ""}</span>
                </label>
              ))}
            </div>
          </div>

          {(paymentmethod === "Credit Card" || paymentmethod === "Debit Card") && (
            <div className="payment-panel">
              <h2>{paymentmethod} details</h2>
              <div className="payment-form-grid">
                <div className="payment-field full">
                  <label>Card number</label>
                  <input value={cardnumber} inputMode="numeric" maxLength={19} placeholder="1234 5678 9012 3456"
                    onChange={(e) => setcardnumber(e.target.value.replace(/[^\d ]/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").trim())} />
                </div>
                <div className="payment-field">
                  <label>Expiry date</label>
                  <input value={expirydate} maxLength={5} placeholder="MM/YY"
                    onChange={(e) => setexpirydate(e.target.value.replace(/[^\d/]/g, ""))} />
                </div>
                <div className="payment-field">
                  <label>CVV</label>
                  <input type="password" inputMode="numeric" value={cardcvv} maxLength={3} placeholder="•••"
                    onChange={(e) => setcardcvv(e.target.value.replace(/\D/g, ""))} />
                </div>
              </div>
            </div>
          )}

          {paymentmethod === "UPI" && (
            <div className="payment-panel">
              <h2>UPI details</h2>
              <div className="payment-field">
                <label>UPI ID</label>
                <input value={upiid} placeholder="example@upi" onChange={(e) => setupiid(e.target.value)} />
              </div>
            </div>
          )}

          {paymentmethod === "Net Banking" && (
            <div className="payment-panel">
              <h2>Net Banking details</h2>
              <div className="payment-form-grid">
                <div className="payment-field full">
                  <label>User ID</label>
                  <input value={netbankinguserid} placeholder="Enter your bank user ID" onChange={(e) => setnetbankinguserid(e.target.value)} />
                </div>
                <div className="payment-field full">
                  <label>Password</label>
                  <input type="password" value={netbankingpassword} placeholder="Enter password" onChange={(e) => setnetbankingpassword(e.target.value)} />
                </div>
                <div className="payment-field full">
                  <button type="button" className="payment-secondary-btn" onClick={sendOTP}>Send OTP to registered email</button>
                </div>
                {otpSent && <div className="payment-field full"><label>Enter OTP</label><input inputMode="numeric" value={otp} placeholder="6-digit OTP" onChange={(e) => setotp(e.target.value)} /></div>}
              </div>
            </div>
          )}

          {error && <div className="payment-error-message" role="alert">{error}</div>}
          <button className="payment-pay-btn" disabled={processing} onClick={verifydetails}>
            {processing ? "Processing…" : `Pay ₹${totalamount.toLocaleString("en-IN")}`}
            <span>→</span>
          </button>
          <p className="payment-secure-note">🔒 Demo checkout · Never enter real banking credentials or card details.</p>
        </section>

        <aside className="payment-sidebar">
          <div className="payment-panel booking-summary">
            <h2>Booking summary</h2>
            <div className="summary-airline">{flight.airline_name || "Your airline"}</div>
            <div className="summary-route">
              <div><strong>{flight.from_city}</strong><small>Departure</small></div>
              <span>✈</span>
              <div><strong>{flight.to_city}</strong><small>Arrival</small></div>
            </div>
            <div className="summary-divider" />
            <div className="summary-row"><span>Travel class</span><strong>{travelClass}</strong></div>
            <div className="summary-row"><span>Passengers</span><strong>{noofpeople}</strong></div>
            <div className="summary-row summary-seats"><span>Seats</span><strong>{Array.isArray(seats) ? seats.join(", ") : seats}</strong></div>
            <div className="summary-divider" />
            <div className="summary-row"><span>Price per passenger</span><strong>₹{Number(ticketprice).toLocaleString("en-IN")}</strong></div>
            <div className="summary-total"><span>Total amount</span><strong>₹{totalamount.toLocaleString("en-IN")}</strong></div>
          </div>
          <div className="payment-help-card"><span>🛡️</span><div><strong>Secure checkout</strong><p>This is a demo payment flow, not a live payment gateway.</p></div></div>
        </aside>
      </div>
    </main>
  );
}

export default Payment;
