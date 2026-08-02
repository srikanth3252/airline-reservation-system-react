import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import "../styles/mybookings.css";

function Mybookings() {

    const [bookings, setbookings] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {

        async function getBookings() {

            const userid = localStorage.getItem("userid");

            try {

                let res = await fetch("https://airline-backend-zdo5.onrender.com/get_my_bookings", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        userid: userid
                    })

                });

                let data = await res.json();

                console.log(data);

                if (data.success) {

                    const grouped = {};

                    data.bookings.forEach((booking) => {

                        if (!grouped[booking.pnr]) {
                            grouped[booking.pnr] = [];
                        }

                        grouped[booking.pnr].push(booking);

                    });

                    setbookings(Object.values(grouped));

                }

            }
            catch (err) {
                console.log(err.message);
            }

        }

        getBookings();

    }, []);

    return (

        <section className="my-bookings">

            <h1>My Bookings</h1>

            {

                bookings.length === 0 ?

                    (

                        <p>No bookings found.</p>

                    )

                    :

                    (

                        bookings.map((bookingGroup, index) => {

                            const booking = bookingGroup[0];

                            return (

                                <div className="booking-card" key={index}>

                                    <h2>
                                        ✈ {booking.airline_name}
                                    </h2>

                                    <h3>
                                        {booking.from_city} → {booking.to_city}
                                    </h3>

                                    <p>
                                        <strong>Flight Number : </strong>
                                        {booking.flight_number}
                                    </p>

                                    <p>
                                        <strong>Date : </strong>
                                        {
                                            new Date(booking.departure_date).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                }
                                            )
                                        }
                                    </p>

                                    <p>
                                        <strong>PNR : </strong>
                                        {booking.pnr}
                                    </p>

                                    <p>
                                        <strong>Travel Class : </strong>
                                        {booking.travel_class}
                                    </p>

                                    <hr />

                                    <h3>Passenger Details</h3>

                                    {

                                        bookingGroup.map((passenger, i) => (

                                            <div
                                                key={i}
                                                className="passenger-box"
                                            >

                                                <p>

                                                    <strong>Name : </strong>

                                                    {passenger.passenger_name}

                                                </p>

                                                <p>

                                                    <strong>Age : </strong>

                                                    {passenger.passenger_age}

                                                </p>

                                                <p>

                                                    <strong>Gender : </strong>

                                                    {passenger.passenger_gender}

                                                </p>

                                                <p>

                                                    <strong>Seat : </strong>

                                                    {passenger.seat_no}

                                                </p>

                                                <hr />

                                            </div>

                                        ))

                                    }

                                    <p>

                                        <strong>Payment : </strong>

                                        {booking.payment_status}

                                    </p>

                                    <p>

                                        <strong>Booking Status : </strong>

                                        {booking.booking_status}

                                    </p>

                                    <button onClick={()=>{
                                        navigate("/ticket", {
                                            state: 
                                            {
                                                pnr: booking.pnr,
                                                bool:true
                                            }
                                        })
                                    }}>

                                        View Ticket

                                    </button>

                                </div>

                            );

                        })

                    )

            }

        </section>

    );

}

export default Mybookings;