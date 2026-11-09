
import { useState, useEffect } from "react";
import "../styles/profile.css";

function Profile() {
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

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState(false);

  // Fetch Profile Data
  useEffect(() => {
    async function getProfile() {
      try {
        const res = await fetch(
          "https://airline-backend-zdo5.onrender.com/get_profile_data",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userid: localStorage.getItem("userid"),
            }),
          }
        );

        const data = await res.json();

        if (data.success && data.profile) {
          const profile = data.profile;

          setfullname(profile.fullname || "");

          setdob(
            profile.dob
              ? new Date(profile.dob).toISOString().split("T")[0]
              : ""
          );

          setgender(profile.gender || "");
          setphonenumber(profile.phonenumber || "");
          setnationality(profile.nationality || "");
          setaddress(profile.address || "");
          setcity(profile.city || "");
          setstate(profile.state || "");
          setcountry(profile.country || "");
          setpincode(profile.pincode || "");
          setaadhaar(profile.aadhaar || "");
          setpassport(profile.passport || "");
        }
      } catch (err) {
        console.log(err.message);
      }
    }

    getProfile();
  }, []);

  // Save Profile
  async function handlesubmit() {
    const errors = {
      fullname: fullname.trim() === "",
      dob: dob.trim() === "",
      gender: gender === "",
      phonenumber: phonenumber.trim() === "",
      nationality: nationality.trim() === "",
      address: address.trim() === "",
      city: city.trim() === "",
      state: state.trim() === "",
      country: country.trim() === "",
      pincode: pincode.trim() === "",
      aadhaar: aadhaar.trim() === "",
    };

    setmissingfullname(errors.fullname);
    setmissingdob(errors.dob);
    setmissinggender(errors.gender);
    setmissingphonenumber(errors.phonenumber);
    setmissingnationality(errors.nationality);
    setmissingaddress(errors.address);
    setmissingcity(errors.city);
    setmissingstate(errors.state);
    setmissingcountry(errors.country);
    setmissingpincode(errors.pincode);
    setmissingaadhaar(errors.aadhaar);

    if (Object.values(errors).some(Boolean)) {
      setSaveMessage("Please complete all required fields.");
      setSaveError(true);
      return;
    }

    setSaving(true);
    setSaveMessage("");
    setSaveError(false);

    try {
      const res = await fetch(
        "https://airline-backend-zdo5.onrender.com/store_profile_data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullname,
            dob,
            gender,
            phonenumber,
            nationality,
            address,
            city,
            state,
            country,
            pincode,
            aadhaar,
            passport,
            userid: localStorage.getItem("userid"),
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setSaveMessage("Your profile has been saved successfully.");
        setSaveError(false);
      } else {
        setSaveMessage(data.message || "Unable to save your profile.");
        setSaveError(true);
      }
    } catch (err) {
      console.log(err.message);
      setSaveMessage("Something went wrong. Please try again.");
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="profile-page">

      {/* ================= PROFILE MAIN ================= */}
      <main className="Profile">

        <div className="profile-box">

          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-icon">✈</div>

            <div className="profile-header-content">
              <span className="profile-header-tag">
                INDIAN AIRCONNECT
              </span>

              <h1>Complete Your Profile</h1>

              <p>
                Please complete your profile before booking your flight tickets.
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="profile-section-title">
            <span className="profile-section-number">01</span>

            <div>
              <h2>Personal Information</h2>
              <p>Enter your personal details as shown on your ID.</p>
            </div>
          </div>

          <div className="profile-form-grid">

            <div className="profile-flex">
              <label htmlFor="profile-fullname">Full Name *</label>

              <input
                id="profile-fullname"
                type="text"
                placeholder="Enter your full name"
                value={fullname}
                onChange={(e) => setfullname(e.target.value)}
              />

              {missingfullname && (
                <p className="profile-error">
                  Please enter your full name.
                </p>
              )}
            </div>

            <div className="profile-flex">
              <label htmlFor="profile-dob">Date of Birth *</label>

              <input
                id="profile-dob"
                type="date"
                value={dob}
                onChange={(e) => setdob(e.target.value)}
              />

              {missingdob && (
                <p className="profile-error">
                  Please select your date of birth.
                </p>
              )}
            </div>

            <div className="profile-flex profile-gender-field">
              <label>Gender *</label>

              <div className="profile-gender-options">
                {["male", "female", "others"].map((item) => (
                  <label className="profile-gender-option" key={item}>
                    <input
                      type="radio"
                      name="Gender"
                      value={item}
                      checked={gender === item}
                      onChange={(e) => setgender(e.target.value)}
                    />

                    <span>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </span>
                  </label>
                ))}
              </div>

              {missinggender && (
                <p className="profile-error">
                  Please select your gender.
                </p>
              )}
            </div>

            <div className="profile-flex">
              <label htmlFor="profile-phone">Mobile Number *</label>

              <input
                id="profile-phone"
                type="tel"
                inputMode="numeric"
                maxLength="10"
                placeholder="Enter your mobile number"
                value={phonenumber}
                onChange={(e) =>
                  setphonenumber(
                    e.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
              />

              {missingphonenumber && (
                <p className="profile-error">
                  Please enter your mobile number.
                </p>
              )}
            </div>

            <div className="profile-flex">
              <label htmlFor="profile-nationality">Nationality *</label>

              <input
                id="profile-nationality"
                type="text"
                placeholder="Enter your nationality"
                value={nationality}
                onChange={(e) => setnationality(e.target.value)}
              />

              {missingnationality && (
                <p className="profile-error">
                  Please enter your nationality.
                </p>
              )}
            </div>

          </div>

          {/* Address Information */}
          <div className="profile-section-title profile-address-title">
            <span className="profile-section-number">02</span>

            <div>
              <h2>Address Information</h2>
              <p>Enter your current residential address.</p>
            </div>
          </div>

          <div className="profile-form-grid">

            <div className="profile-flex profile-full-width">
              <label htmlFor="profile-address">Address *</label>

              <input
                id="profile-address"
                type="text"
                placeholder="House number, street, area"
                value={address}
                onChange={(e) => setaddress(e.target.value)}
              />

              {missingaddress && (
                <p className="profile-error">
                  Please enter your address.
                </p>
              )}
            </div>

            <div className="profile-flex">
              <label htmlFor="profile-city">City *</label>

              <input
                id="profile-city"
                type="text"
                placeholder="Enter your city"
                value={city}
                onChange={(e) => setcity(e.target.value)}
              />

              {missingcity && (
                <p className="profile-error">
                  Please enter your city.
                </p>
              )}
            </div>

            <div className="profile-flex">
              <label htmlFor="profile-state">State *</label>

              <input
                id="profile-state"
                type="text"
                placeholder="Enter your state"
                value={state}
                onChange={(e) => setstate(e.target.value)}
              />

              {missingstate && (
                <p className="profile-error">
                  Please enter your state.
                </p>
              )}
            </div>

            <div className="profile-flex">
              <label htmlFor="profile-country">Country *</label>

              <input
                id="profile-country"
                type="text"
                placeholder="Enter your country"
                value={country}
                onChange={(e) => setcountry(e.target.value)}
              />

              {missingcountry && (
                <p className="profile-error">
                  Please enter your country.
                </p>
              )}
            </div>

            <div className="profile-flex">
              <label htmlFor="profile-pincode">PIN Code *</label>

              <input
                id="profile-pincode"
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="Enter your PIN code"
                value={pincode}
                onChange={(e) =>
                  setpincode(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
              />

              {missingpincode && (
                <p className="profile-error">
                  Please enter your PIN code.
                </p>
              )}
            </div>

          </div>

          {/* Identity Information */}
          <div className="profile-section-title profile-address-title">
            <span className="profile-section-number">03</span>

            <div>
              <h2>Identity Information</h2>
              <p>Provide your identity details for travel verification.</p>
            </div>
          </div>

          <div className="profile-form-grid">

            <div className="profile-flex">
              <label htmlFor="profile-aadhaar">Aadhaar Number *</label>

              <input
                id="profile-aadhaar"
                type="text"
                inputMode="numeric"
                maxLength="12"
                placeholder="Enter your Aadhaar number"
                value={aadhaar}
                onChange={(e) =>
                  setaadhaar(
                    e.target.value.replace(/\D/g, "").slice(0, 12)
                  )
                }
              />

              {missingaadhaar && (
                <p className="profile-error">
                  Please enter your Aadhaar number.
                </p>
              )}
            </div>

            <div className="profile-flex">
              <label htmlFor="profile-passport">
                Passport Number (Optional)
              </label>

              <input
                id="profile-passport"
                type="text"
                placeholder="Enter your passport number"
                value={passport}
                onChange={(e) => setpassport(e.target.value)}
              />
            </div>

          </div>

          {/* Save Profile */}
          <div className="profile-submit-area">

            {saveMessage && (
              <p
                className={
                  saveError
                    ? "profile-save-error"
                    : "profile-save-success"
                }
              >
                {saveMessage}
              </p>
            )}

            <button
              onClick={handlesubmit}
              className="save-profile-button"
              disabled={saving}
            >
              {saving ? "Saving Profile..." : "Save Profile"}
              {!saving && <span> → </span>}
            </button>

            <p className="profile-submit-note">
              Make sure your details are accurate before saving.
            </p>

          </div>

        </div>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="profile-footer">

        <div className="profile-footer-content">

          <div className="profile-footer-brand">
            <span className="profile-footer-plane">✈</span>
            <span>IndianAirConnect</span>
          </div>

          <p className="profile-footer-tagline">
            Connecting India through the skies.
          </p>

          <div className="profile-footer-links">
            <span>Safe Travel</span>
            <span className="profile-footer-separator">|</span>
            <span>Comfort</span>
            <span className="profile-footer-separator">|</span>
            <span>Convenience</span>
          </div>

          <div className="profile-footer-bottom">
            <span>
              © {new Date().getFullYear()} IndianAirConnect. All rights reserved.
            </span>

            <span className="profile-footer-made">
              Your journey begins here.
            </span>
          </div>

        </div>

      </footer>

    </div>
  );
}

export default Profile;
