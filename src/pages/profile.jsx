import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../styles/profile.css";

function Profile()
{
    const [fullname, setfullname] = useState("");
    const [dob, setdob] = useState("");
    const [gender, setgender] = useState("");
    const [phonenumber, setphonenumber] = useState("");
    const [nationality, setnationality] = useState("");
    const [address, setaddress] = useState("");
    const [city, setcity] = useState("");
    const [state, setstate] = useState("");
    const [country, setcountry] = useState("");
    const [pincode, setpincode] = useState("");
    const [aadhaar, setaadhaar] = useState("");
    const [passport, setpassport] = useState("");

    const [missingfullname, setmissingfullname] = useState(false);
    const [missingdob, setmissingdob] = useState(false);
    const [missinggender, setmissinggender] = useState(false);
    const [missingphonenumber, setmissingphonenumber] = useState(false);
    const [missingnationality, setmissingnationality] = useState(false);
    const [missingaddress, setmissingaddress] = useState(false);
    const [missingcity, setmissingcity] = useState(false);
    const [missingstate, setmissingstate] = useState(false);
    const [missingcountry, setmissingcountry] = useState(false);
    const [missingpincode, setmissingpincode] = useState(false);
    const [missingaadhaar, setmissingaadhaar] = useState(false);
  
    useEffect(() => {

    async function getProfile() 
    {
        try {
            let res = await fetch("https://airline-backend-zdo5.onrender.com/get_profile_data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userid: localStorage.getItem("userid")
                })
            });
            let data = await res.json();
            console.log(data.message);
            if(data.success)
            {
                setfullname(data.profile.fullname || "");
                setdob(new Date(data.profile.dob)
                    .toISOString()
                    .split("T")[0]);
                setgender(data.profile.gender || "");
                setphonenumber(data.profile.phonenumber || "");
                setnationality(data.profile.nationality || "");
                setaddress(data.profile.address || "");
                setcity(data.profile.city || "");
                setstate(data.profile.state || "");
                setcountry(data.profile.country || "");
                setpincode(data.profile.pincode || "");
                setaadhaar(data.profile.aadhaar || "");
                setpassport(data.profile.passport || "");
            }
        }
        catch(err)
        {
            console.log(err.message);
        }
    }

         getProfile();

    }, []);

    async function handlesubmit()
    {
        if(fullname.trim()=="")
        {
            setmissingfullname(true);
        }
        else
        {
            setmissingfullname(false);
        }
        if(dob.trim()=="")
        {
            setmissingdob(true);
        }
        else
        {
            setmissingdob(false);
        }
        if(gender=="")
        {
            setmissinggender(true);
        }
        else
        {
            setmissinggender(false);
        }
        if(phonenumber.trim()=="")
        {
            setmissingphonenumber(true);
        }
        else
        {
            setmissingphonenumber(false);
        }
        if(nationality.trim()=="")
        {
            setmissingnationality(true);
        }
        else
        {
            setmissingnationality(false);
        }
        if(address.trim()=="")
        {
            setmissingaddress(true);
        }
        else
        {
            setmissingaddress(false);
        }
        if(city.trim()=="")
        {
            setmissingcity(true);
        }
        else
        {
            setmissingcity(false);
        }
        if(state.trim()=="")
        {
            setmissingstate(true);
        }
        else
        {
            setmissingstate(false);
        }
        if(country.trim()=="")
        {
            setmissingcountry(true);
        }
        else
        {
            setmissingcountry(false);
        }
        if(pincode.trim()=="")
        {
            setmissingpincode(true);
        }
        else
        {
            setmissingpincode(false);
        }
        if(aadhaar.trim()=="")
        {
            setmissingaadhaar(true);
        }
        else
        {
            setmissingaadhaar(false);
        }

        try
        {
            let res=await fetch("https://airline-backend-zdo5.onrender.com/store_profile_data",{
                 method:"POST",
                 headers:
                 {
                    "Content-Type":"application/json"
                 },
                 body:JSON.stringify({
                        fullname: fullname,
                        dob: dob,
                        gender: gender,
                        phonenumber: phonenumber,
                        nationality: nationality,
                        address: address,
                        city: city,
                        state: state,
                        country: country,
                        pincode: pincode,
                        aadhaar: aadhaar,
                        passport: passport,
                        userid: localStorage.getItem("userid") 
                 })
            });

            let data=await res.json();
            console.log(data.message);
        }
        catch(err)
        {
            console.log(err.message);
        }
    }

    return(
      <section className="Profile">

          <div className="profile-box">
                <div className="profile-flex">
                    <h1>Complete Your Profile</h1>
                    <p style={{"text-align":"center"}}>Please complete your profile before booking your flight tickets.</p>
                </div>

                <div className="profile-flex">
                     <label>Full Name</label>
                     <input type="text"
                           placeholder="Enter your full name"
                           value={fullname}
                           onChange={(e)=>{setfullname(e.target.value)}}
                     />
                     {
                        missingfullname &&
                         <p>Please enter your full name.</p>
                     }
                </div>

                <div className="profile-flex">
                     <label>Date of Birth</label>
                     <input type="date"
                           
                           value={dob}
                           onChange={(e)=>{setdob(e.target.value)}}
                     />
                     {
                        missingfullname &&
                         <p>Please select your date of birth.</p>
                     }
                </div>

                 <div className="profile-flex-row">
                     <label>Gender</label>
                     <input type="radio" name="Gender" checked={gender==="male"} onChange={(e)=>{setgender(e.target.value)}} value="male"/>Male
                     <input type="radio" name="Gender" checked={gender==="female"} onChange={(e)=>{setgender(e.target.value)}} value="female"/>Female
                     <input type="radio" name="Gender" checked={gender==="others"} onChange={(e)=>{setgender(e.target.value)}} value="others"/>Others
                     {
                        missinggender &&
                         <p>Please select your gender.</p>
                     }
                </div>

                <div className="profile-flex">
                     <label>Mobile Number</label>
                     <input type="number"
                           placeholder="Enter your mobile number"
                           value={phonenumber}
                           onChange={(e)=>{setphonenumber(e.target.value)}}
                     />
                     {
                        missingphonenumber &&
                         <p>Please enter your mobile number.</p>
                     }
                </div>

                <div className="profile-flex">
                     <label>Nationality</label>
                     <input type="text"
                           placeholder="Enter your nationality"
                           value={nationality}
                           onChange={(e)=>{setnationality(e.target.value)}}
                     />
                     {
                        missingnationality &&
                         <p>Please enter your nationality.</p>
                     }
                </div>

                 <div className="profile-flex">
                     <label>Address</label>
                     <input type="text"
                           placeholder="Enter your address"
                           value={address}
                           onChange={(e)=>{setaddress(e.target.value)}}
                     />
                     {
                        missingaddress&&
                         <p>Please enter your address.</p>
                     }
                </div>

                <div className="profile-flex">
                     <label>City</label>
                     <input type="text"
                           placeholder="Enter your City"
                           value={city}
                           onChange={(e)=>{setcity(e.target.value)}}
                     />
                     {
                        missingcity&&
                         <p>Please enter your city.</p>
                     }
                </div>

                <div className="profile-flex">
                     <label>State</label>
                     <input type="text"
                           placeholder="Enter your state"
                           value={state}
                           onChange={(e)=>{setstate(e.target.value)}}
                     />
                     {
                        missingstate&&
                        <p>Please enter your state.</p>
                     }
                </div>

                <div className="profile-flex">
                     <label>Country</label>
                     <input type="text"
                           placeholder="Enter your country"
                           value={country}
                           onChange={(e)=>{setcountry(e.target.value)}}
                     />
                     {
                        missingcountry&&
                         <p>Please enter your country.</p>
                     }
                </div>

                <div className="profile-flex">
                     <label>PIN Code</label>
                     <input type="number"
                           placeholder="Enter your PIN code"
                           value={pincode}
                           onChange={(e)=>{setpincode(e.target.value)}}
                     />
                     {
                        missingpincode&&
                         <p>Please enter your PIN code.</p>
                     }
                </div>

                <div className="profile-flex">
                     <label>Aadhaar Number</label>
                     <input type="number"
                           placeholder="Enter your Aadhaar number"
                           value={aadhaar}
                           onChange={(e)=>{setaadhaar(e.target.value)}}
                     />
                     {
                        missingaadhaar&&
                         <p>Please enter your Aadhaar number.</p>
                     }
                </div>

                <div className="profile-flex">
                     <label>Passport Number (Optional)</label>
                     <input type="text"
                           placeholder="Enter your passport number"
                           value={passport}
                           onChange={(e)=>{setpassport(e.target.value)}}
                     />
                </div>

                <button onClick={handlesubmit} className="save-profile-button">
                    Save Profile
                </button>

          </div>

      </section>
    );
}

export default Profile;