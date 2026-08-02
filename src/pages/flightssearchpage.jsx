import "../styles/flightssearchpage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Profile from "./profile";
import Mybookings from "./myboookings";

function Search()
{
    const navigate=useNavigate();
    const location=useLocation();
    const k=location.state?.k || false;

    const [from,setfrom]=useState("");
    const [to,setto]=useState("");
    const [date,setdate]=useState("");
    const [Passengertype, setPassengertype] = useState("Adults");
    const [val,setval]=useState(0);
    const [classtype,setclasstype]=useState("Economy");
    const [flightData,setFlightData]=useState([]);
    const [showResults,setShowResults]=useState(false);

    const [missingfrom, setmissingfrom] = useState(false);
    const [missingto, setmissingto] = useState(false);
    const [missingdate, setmissingdate] = useState(false);

    const [showlogin, setshowlogin] = useState(k);
    
    useEffect(() => {

    const timer = setTimeout(() => {
        setshowlogin(false);
    }, 2000);

    return () => clearTimeout(timer);

    }, []);
    async function handlesearch()
    {
        let hasError = false;
        if(from.trim() === "")
        {
            setmissingfrom(true);
            hasError = true;
        }
        else
        {
            setmissingfrom(false);
        }
        if(to.trim() === "")
        {
            setmissingto(true);
            hasError = true;
        }
        else
        {
            setmissingto(false);
        }

        if(date === "")
        {
            setmissingdate(true);
            hasError = true;
        }
        else
        {
            setmissingdate(false);
            
        }
 
        if(hasError)
            return ;
       async function get_flights()
       {
          let res=await fetch("https://airline-backend-zdo5.onrender.com/get_flights",{

                  method:"POST",
                  headers:
                  {
                    "Content-Type":"application/json"
                  },
                  body:JSON.stringify({from:from,
                    to:to,
                    date:date,
                    Passengertype:Passengertype,
                    val:val,
                    classtype:classtype
                  })
              });

              let data=await res.json();
              return data;
       }
       try
       {
          let res = await get_flights();
          navigate("/flightresutls", {
          state: 
          {
            success: res.success,
            message: res.message,
            data: res.data,
            classtype:classtype,
            val:val
          }
            });
       }

        catch(err)
        {
         console.log(err);
        }
    }

    function handlenaviagtion(goal)
    {
        if(goal==="profile")
        {
            navigate("/profile");
        }
        else if(goal==="bookings")
        {
            navigate("/mybookings");
        }
        else if(goal === "logout")
        {
            navigate("/loginpage",{
                state:{
                    k:true
                }
            });
        }
    }

    return(
        
        <section className="flightssearchpage">
            
            {
                 showlogin &&
                  <div className="showlogin">Login Successfully</div>   
            }

           <div className="profile">
                <div className="profile-icon">
                    👤
                </div>

                <select className="profile-select" onChange={(e)=>{handlenaviagtion(e.target.value)}} defaultValue="">
                     <option value="" disabled>
                        👤 Menu
                    </option>
                    <option value="profile">My Profile</option>
                    <option value="bookings">My Bookings</option>
                    <option value="logout">Logout</option>
                </select>
           </div>
            <div className="in-box">
                  
                <div className="header">
                     <h1> Welcome, Dear Passenger</h1>
                     <p>Search and book your flights quickly and securely.</p>
                </div>

                <div className="flexs1">
                    <label>From:</label>
                    <input type="text"
                     placeholder="enter your depature place"
                     onChange={(e)=>{
                        setfrom(e.target.value);
                     }}
                     value={from}
                    />
                    {
                        missingfrom &&
                        <p className="p1">Please select your departure city.</p>
                    }
                </div>

                <div className="flexs1">
                    <label>To:</label>
                    <input type="text"
                     placeholder="enter where you want to go"
                     onChange={(e)=>{
                        setto(e.target.value);
                     }}
                     value={to}
                    />

                    {
                        missingto &&
                        <p className="p1">Please select your destination city.</p>
                    }
                </div>

                <div className="flexs1">
                    <label>Departure Date:</label>
                    <input type="date"
                     placeholder="select the Departure Date"
                     onChange={(e)=>{
                        setdate(e.target.value);
                     }}
                     value={date}
                    />

                    {
                        missingdate &&
                        <p className="p1">Please select your travel date.</p>
                    }
                </div>

                <div className="flexs1">
                    <label>Passengers:</label>
                    <select className="select"
                     placeholder="select passenger"
                     value={Passengertype}
                     onChange={(e)=>{setPassengertype(e.target.value)}}
                    >
                        <option value="Adults">Adults (12+ Years)</option>
                        <option value="Children">Children (2-11 Years)</option>
                        <option value="Infants">Infants (Below 2 Years)</option>
                    </select>
                    
                </div>

                <div className="flexs1">
                    <label>Number of Passengers::</label>
                    <input type="number"
                     placeholder="enter the Number of Passengers:"
                     onChange={(e)=>{
                        setval(e.target.value);
                     }}
                     value={val}
                    />
                </div>

                 <div className="flexs1">
                    <label>Travel Class </label>
                    <select className="select"
                       onChange={(e)=>{
                        setclasstype(e.target.value);
                       }}
                    >
                        <option value="Economy">Economy</option>
                        <option value="Premium Economy">Premium Economy</option>
                        <option value="Business">Business</option>
                        <option value="First Class">First Class</option>
                    </select>
                </div>

                <button type="button" onClick={handlesearch} className="btn1">
                    search
                </button>
            </div>

        </section>
    );
}

export default Search;