import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../styles/password-resetpage.css";
import Popup from "../components/popuppage.jsx";


function Reset_password()
{   
    const navigate=useNavigate();
    const [missingotp,setmissingotp]=useState(false);
    const [missingemail,setmissingemail]=useState(false);
    const [missingpassword,setmissingpassword]=useState(false);
    const [missingrepassword,setmissingrepassword]=useState(false);
    const [verify,setverify]=useState(false);
    const [samepassword,setsamepassword]=useState(false);
    const [passwordnotmatched,setpasswordnotmatched]=useState(false);

    const [email,setemail]=useState("");
    const [otp,setotp]=useState("");
    const [password,setpassword]=useState("");
    const [confirmpassword,setconfirmpassword]=useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState("");
    const [popupAction, setPopupAction] = useState("");

    function handleProceed() 
    {
        setShowPopup(false);
    }

    async function handle_sendotp()
    {
        if(email==="")
        {
            setmissingemail(true);
            return;
        }
        else
        {
            setmissingemail(false);
        }
        async function sendotp()
         {
              let res=await fetch("https://airline-backend-zdo5.onrender.com/forgot-password-send-otp",{
            
                  method:"POST",
                  headers:
                  {
                    "Content-Type":"application/json"
                  },
                  body:JSON.stringify({email:email})
              });

              let data=await res.json();
              return data;
         }

         try
         {
             let res=await sendotp();

            if(res.success)
            {
                 setPopupTitle("OTP Sent Successfully");
                 setPopupMessage(
                    "An OTP has been sent to your registered email address. Please enter the OTP below to continue with your account verification."
                 );
                setPopupType("info");
                setPopupAction("otp-send")
                setShowPopup(true);
            }
            else if(res.success)
            {
                setPopupTitle("Email Not Registered");
                setPopupMessage(
                    "Please enter your registered email address to receive the OTP and reset your password."
                );

                setPopupType("error");

                setPopupAction("email-not-registered");

                setShowPopup(true);
            }
         }
         catch(err)
         {
            console.log(err);
         }
    }

     // function to handle verify otp
    async function handleverifyotp()
    {
        if(otp==="")
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
                "Your email has been verified successfully. You can now create your new password."
                );
                setPopupType("success");
                setShowPopup(true);
                setPopupAction("otp-verified");
                setverify(true);
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

    async function handlesetuppassword()
    {

        if(password==="")
        {
            setmissingpassword(true);
            return;
        }
        else
        {
            setmissingpassword(false);
        }

        if(confirmpassword==="")
        {
            setmissingrepassword(true);
            return;
        }
        else
        {
            setmissingrepassword(false);
        }

        let result = await comparepassword();
       
        async function comparepassword()
        {
            try
            {
                let res=await fetch("https://airline-backend-zdo5.onrender.com/comparepassword",{
                  method:"POST",
                  headers:
                  {
                    "Content-Type":"application/json"
                  },
                  body:JSON.stringify({email:email,
                    password:password
                  })
                 });

                let data=await res.json();
                return data.same;
            }
            catch(err)
            {
                console.log(err.message);
            }
        }

        if(result==true)
        {
            setsamepassword(true);
        }
        else
        {
             setsamepassword(false);
        }
        if(password!=confirmpassword)
        {
            setpasswordnotmatched(true);
        }
        else
        {
            setpasswordnotmatched(false);
        }
        setPopupTitle("Password Updated Successfully");
        setPopupMessage("Your password has been updated successfully. You can now sign in using your new password.");
        setPopupType("success");
        setShowPopup(true);
        setPopupAction("password-updated");
        setTimeout(() => {
            navigate("/loginpage");
        }, 3000);
    }

    return(
        <section className="Reset_password">

            {
                showPopup &&
                <Popup
                    title={popupTitle}
                    message={popupMessage}
                    popupType={popupType}
                    onProceed={handleProceed}
                />
            }

            <div className="Reset_password_box">
                <div className="Reset_password_flex">
                    <h1>Reset Your Password</h1>
                    <p className="p1">Verify your email address to reset your password.</p>
                </div>
                 <div className="Reset_password_flex">
                   <label>Registered Email Address:</label>
                   <p>Enter your registered email address to receive an OTP.</p>
                   <input type="email" 
                        value={email}
                         placeholder="Enter your registered email"
                        onChange={(e)=>{setemail(e.target.value)}}
                   />
                   {
                      missingemail &&
                        <p>Please enter your email address.</p>
                   }
                   </div>
                   <button className="Reset_password_button" onClick={handle_sendotp}>
                       Send OTP
                   </button>
                   <div className="Reset_password_flex">
                   <label>Enter OTP</label>
                   <p>Enter the OTP sent to your registered email address.</p>
                   <input type="number" 
                        value={otp}
                        placeholder="Enter 6-digit OTP"
                        onChange={(e)=>{setotp(e.target.value)}}
                   />
                   {
                      missingotp &&
                        <p>Please enter the OTP.</p>
                   }
                   </div>

                   <button className="Reset_password_button" onClick={handleverifyotp}>
                       Verify OTP
                   </button>

                   {
                        verify &&
                        <>
                            <div className="Reset_password_flex">
                                    <label>New Password:</label>
                                    <input type="password" 
                                            value={password}
                                            placeholder="Enter new password"
                                            onChange={(e)=>{setpassword(e.target.value)}}
                                        />
                                    {
                                        missingpassword &&
                                         <p>Please enter a new password.</p>
                                    }
                                    {
                                        samepassword &&
                                         <p>⚠️ Your new password must be different from your current password.</p>
                                    }
                            </div>

                            <div className="Reset_password_flex">
                                    <label>Confirm New Password</label>
                                    <input type="password" 
                                            value={confirmpassword}
                                            placeholder="Confirm new password"
                                            onChange={(e)=>{setconfirmpassword(e.target.value)}}
                                         />
                                    {
                                         missingrepassword &&
                                         <p>Please confirm your new password.</p>
                                    }
                                    {
                                        passwordnotmatched &&
                                         <p>⚠️ Passwords do not match. Please enter the same password in both fields. </p>
                                    }
                            </div>

                            <button className="Reset_password_button" onClick={handlesetuppassword}>
                                Reset Password
                            </button>
                        </>
                   }
                
            </div>
        </section>
    );
}

export default Reset_password;