import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import "../styles/loginpage.css"
import Popup from "../components/popuppage.jsx";
import Reset_password from "./password-resetpage.jsx";

function Loginpage()
{
     const navigate=useNavigate();
     const location=useLocation();
     const k = location.state?.k || false;

     const [showlogout,setshowlogout]=useState(k);

     useEffect(()=>{
        
        const timer=setTimeout(() => {
            setshowlogout(false);
        }, 3000);

        return () => clearTimeout(timer);
     },[])

    const [login,setlogin]=useState(true);
    const [signup,setsignup]=useState(false);
    const [userid,setuserid]=useState('');
    const [password,setpassword]=useState("");
    const [signupuserid,signupsetuserid]=useState('');
    const [signuppassword,signupsetpassword]=useState("");
    const [otp,setotp]=useState("");
    const [verifyotp,setverifyotp]=useState(false);
    const [email,setemail]=useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState("");
    const [popupAction, setPopupAction] = useState("");

     localStorage.setItem("userid",userid);

    const [missinguserid,setmissinguserid]=useState(false);
    const [missingpassword,setmissingpassword]=useState(false);

    const [missingotp,setmissingotp]=useState(false);
    const [missingemail,setmissingemail]=useState(false);
    const [missingsignuppassword,setmissingsignuppassword]=useState(false);
    const [missingsignupuserid,setmissingsignupuserid]=useState(false);


     function handleresetpassword()
     {
        navigate("/reset_password");
     }
    function handleProceed()
{
    if(popupAction === "otp-send")
    {
        setShowPopup(false);
    }

    else if(popupAction === "otp-verified")
    {
        setShowPopup(false);
        setOtpVerified(true);
    }

    else if(popupAction === "email-exists")
    {
        setShowPopup(false);
    }

    else if(popupAction === "Invalid OTP")
    {
        setShowPopup(false);
        setOtpVerified(false);
    }

    else if(popupAction === "otp-error")
    {
        setShowPopup(false);
    }

    else if(popupAction === "Registration-Successful")
    {
        setShowPopup(false);
        navigate("/loginpage");
    }

    else if(popupAction === "login-failed")
    {
        setShowPopup(false);
    }
}

    // function handle login page submit
    async function handlesubmit(e)
    {
        e.preventDefault();

        if(userid.trim()=="" && password.trim()=="" )
        {
            setmissinguserid(true);
            setmissingpassword(true);
            return;
        }
        if(userid.trim()=="")
        {
            setmissinguserid(true);
            return;
        }
        setmissinguserid(false);

        if(password.trim()=="")
        {
            missingpassword(true);
            return;
        }
        setmissingpassword(false);
        async function verify_for_login()
        {
            let res=await fetch("https://airline-backend-zdo5.onrender.com/verify_for_login",{

                  method:"POST",
                  headers:
                  {
                    "Content-Type":"application/json"
                  },
                  body:JSON.stringify({userid:userid,
                    password:password
                  })
              });

              let data=await res.json();
              return data;
        }

        try
        {
            let res=await verify_for_login();
            console.log(res.message)
            if(res.success)
            {
                 navigate("/flightssearchpage",{
                    state:{
                        k:true
                    }
                 });
            }
            else
            {
                setPopupTitle("Login Failed");
                setPopupMessage(
                     "The User ID or Password you entered is incorrect. Please check your credentials and try again."
                    );
                setPopupType("error");
                setPopupAction("login-failed");
                setShowPopup(true);
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }

    // function handle sendotp
    async function handlesendotp()
{
    if(email.trim() === "")
    {
        setmissingemail(true);
        return;
    }

    setmissingemail(false);

    try
    {
        const res = await fetch(
            "https://airline-backend-zdo5.onrender.com/send-otp",
            {
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email
                })
            }
        );

        const data = await res.json();

        console.log(data);

        if(data.success)
        {
            setPopupTitle("OTP Sent Successfully");

            setPopupMessage(
                "An OTP has been sent to your email address. Please check your inbox and enter the OTP below."
            );

            setPopupType("info");
            setPopupAction("otp-send");
            setShowPopup(true);
        }
        else
        {
            if(data.message === "Email already exists")
            {
                setPopupTitle("Email Already Registered");

                setPopupMessage(
                    "An account with this email address already exists. Please use a different email address or sign in with your existing account."
                );

                setPopupType("error");
                setPopupAction("email-exists");
            }
            else
            {
                setPopupTitle("OTP Sending Failed");

                setPopupMessage(
                    data.message || "Unable to send OTP. Please try again."
                );

                setPopupType("error");
                setPopupAction("otp-error");
            }

            setShowPopup(true);
        }
    }
    catch(err)
    {
        console.log(err);

        setPopupTitle("Server Error");

        setPopupMessage(
            "Unable to connect to the server. Please try again later."
        );

        setPopupType("error");
        setPopupAction("otp-error");
        setShowPopup(true);
    }
}
    
    // function to handle verify otp
    async function handleverifyotp()
    {
        if(otp.trim()=="")
        {
            setmissingotp(true);
            return;
        }
        setmissingotp(false);
        async function verifyotp()
        {
              let res=await fetch("https://airline-backend-zdo5.onrender.com/verify-otp",{
            
                  method:"POST",
                  headers:
                  {
                    "Content-Type":"application/json"
                  },
                  body:JSON.stringify({email:email,
                    otp:otp
                  })
              });

              let data=await res.json();
              return data;
        }

         try
         {
             let res=await verifyotp();
             console.log(res.message);
             if(res.success)
             { 
                setPopupTitle("OTP Verified");
                setPopupMessage(
                "Your email has been verified successfully. You can now create your User ID and Password to complete your registration."
                );
                setPopupType("success");
                setShowPopup(true);
                setPopupAction("otp-verified");
             }
             else
             {
                setPopupTitle("Invalid OTP");
                setPopupMessage(
                "The OTP you entered is incorrect. Please check your email and enter the correct OTP to continue."
                );
                setPopupType("error");
                setShowPopup(true);
                setPopupAction("Invalid OTP");
             }
         }
         catch(err)
         {
            console.log(err);
         }
    }

    // funciton to handlesignup page rigester button
   async  function handlesignup(e)
    {
         if(signupuserid.trim()=="" && signuppassword.trim()=="")
         {
               setmissingsignupuserid(true);
               setmissingsignuppassword(true);
               return ;
         }
        
         if(signupuserid.trim()=="")
         {
            setmissingsignupuserid(true);
            return ;
         }
          setmissingsignupuserid(false);
         if(signuppassword.trim()=="")
         {
            setmissingsignuppassword(true);
            return ;
         }
         setmissingsignuppassword(false);
         e.preventDefault();
         async function signup()
         {
              let res=await fetch("https://airline-backend-zdo5.onrender.com/sign-up",{
            
                  method:"POST",
                  headers:
                  {
                    "Content-Type":"application/json"
                  },
                  body:JSON.stringify({email:email,
                      signupuserid:signupuserid,
                      signuppassword:signuppassword
                  })
              });

              let data=await res.json();
              return data;
         }

         try
         {
             let res=await signup();
             console.log(res.message);
             if(res.success)
             {
                setPopupTitle("Registration Successful");
                setPopupMessage(
                "Your account has been created successfully. You can now login and start booking your flights with Vinayaka SkyWings Airlines."
                );
                setPopupType("success");
                setShowPopup(true);
                setPopupAction("Registration-Successful");
             }
             
         }
         catch(err)
         {
            console.log(err);
         }
    }

    return(
      <div className="loginpage">

        {
                 showlogout &&
                  <div className="showlogout">Logout Successfully</div>   
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
                        onClick={()=>{
                            setlogin(true);
                            setsignup(false);
                        }}
                    >
                        Login
                    </button>

                    <button
                        className="signup"
                        onClick={()=>{
                            setsignup(true);
                            setlogin(false);
                        }}
                    >
                        SignUp
                    </button>

                </div>

            </div>

            {
                login &&
                <>
                    <div className="fl1">
                        <h2 className="form-title">Login Here</h2>
                        <p className="form-subtitle">
                           Enter your User ID and Password to access your account.
                        </p>
                    </div>
                    <div className="flex1">
                        <label>Enter your User ID:</label>

                        <input
                            type="text"
                            placeholder="Enter your User ID"
                            name="userid"
                            value={userid}
                            onChange={(e)=>{
                                setuserid(e.target.value);
                            }}
                        />
                        {
                            missinguserid &&
                             <p className="p2">Please enter your user ID.</p>
                        }
                    </div>

                    <div className="flex1">
                        <label>Enter your Password:</label>

                        <input
                            type="password"
                            placeholder="Enter your Password"
                            name="password"
                            value={password}
                            onChange={(e)=>{
                                setpassword(e.target.value);
                            }}
                        />
                         {
                            missingpassword &&
                            <p className="p2">Please enter your password.</p>
                        }
                    </div>

                    <div className="flex1">

                        <button className="forgot-btn" onClick={handleresetpassword}>
                            Forgot Password
                        </button>

                       
                        <button
                            type="submit"
                            onClick={handlesubmit}
                            className="submit-btn1"
                        >
                            Submit
                        </button>

                    </div>
                </>
            }

            {
                signup &&
                <>
                    <div className="fl1">
                        <h2 className="form-title">Create Your Account</h2>
                        <p className="form-subtitle">
                           Register with your email to start booking flights.
                        </p>
                    </div>
                    <div className="flex1">

                        <label>Enter your Email:</label>

                        <p>Email is required for verification purpose.</p>

                        <input
                            type="email"
                            placeholder="Enter your Email"
                            onChange={(e)=>{setemail(e.target.value)}}
                            value={email}
                        />
                        {
                            missingemail &&
                            <p className="p2">Please enter your email address.</p>
                        }
                    </div>

                    <button className="submit-btn1" onClick={handlesendotp}>sendotp</button>

                    <div className="flex1">

                        <label>Enter OTP:</label>

                        <p>OTP sent to your registered email.</p>

                        <input
                            type="number"
                            autoComplete="new-password"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e)=>{
                                setotp(e.target.value);
                            }}
                        />
                        {
                             missingotp &&
                                <p className="p2">Please enter the OTP.</p>
                        }
                    </div>

                    <button
                        type="button"
                        onClick={handleverifyotp}
                        className="submit-btn1"
                    >
                        verifyotp
                    </button>

                    {
                        verifyotp &&
                        <>
                            <div className="flex1">

                                <label>Create your User ID:</label>

                                <p>Create your User ID for login purpose.</p>

                                <input
                                    type="text"
                                    placeholder="Enter your User ID"
                                    value={signupuserid}
                                    onChange={(e)=>{
                                        signupsetuserid(e.target.value);
                                    }}
                                />
                                {
                                    missingsignupuserid&&
                                    <p className="p2">Please enter the UserId.</p>
                                }

                            </div>

                            <div className="flex1">

                                <label>Create your Password:</label>
                                <p>Create unique password which is different from userid for login purpose.</p>
                                <input
                                    type="password"
                                    placeholder="Create your Password"
                                    onChange={(e)=>{
                                        signupsetpassword(e.target.value);
                                    }}
                                    value={signuppassword}
                                />
                                {
                                    missingsignuppassword&&
                                    <p className="p2">Please enter the password.</p>
                                }

                            </div>

                            <button onClick={handlesignup}
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