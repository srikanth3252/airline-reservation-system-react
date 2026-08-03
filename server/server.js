require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcrypt");
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage
});
const store={};

// Port number
const port = process.env.PORT || 814;

// Create server
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// transport object;
const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "srikanthreddybapatu04@gmail.com",
        pass: "qkkm flky fota fopx"
    }
});

function generate_otp()
{
    return   Math.floor(100000 + Math.random() * 900000);
}

//route to send otp
app.post("/send-otp", (req, res) => {

    const {email}=req.body

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, result) => {
        if (err) {
            return res.json({
                success: false,
                message: "Database error"
            });
        }
        // Email already exists
        if (result.length > 0) {
            return res.json({
                success: false,
                message: "Email already exists"
            });
        }

    const otp=generate_otp();
    store[email]=otp;
    const mailOptions = {
        from: "srikanthreddybapatu04@gmail.com",
        to: email,
        subject: "OTP Verification for Account Registration",
        text: `Welcome to Vinayaka SkyWings Airlines!
        To create your account, please verify your email address using the OTP below.
        Your OTP is: ${otp}
        This OTP is valid for 5 minutes.
        For your security, please do not share this OTP with anyone.
        Thank you for choosing Vinayaka SkyWings Airlines.
        Have a pleasant journey!`
    };
    transport.sendMail(mailOptions, (err, info) => {
        if (err) 
        {
            return res.json({message:err.message});
            console.log(err);
        }

        res.json({ message: "OTP sent successfully",otp:otp});
     });
})
});  

//route to verify otp

app.post("/verify-otp", (req, res) => {

    const { email, otp } = req.body;

    if (store[email] == otp) 
    {
        delete store[email];
        return res.status(200).json({message: "OTP verified successfully",
            success:true
        });
    } 
    else 
    {
        return res.status(400).json({message: "Invalid OTP",success:false});
    }
});

// route to store user details in databases
app.post("/sign-up",(req,res)=>{

    const{email,signupuserid,signuppassword}=req.body;
    const query="insert into users(email,userid,password) values(?,?,?)"
    db.query(query,[email,signupuserid,signuppassword],(error,result)=>{
        if(error)
        {
            return res.status(500).json({message:error.message,success:false});
        }
        return res.status(200).json({message:"user data is successfully stored in database",success:true});
    })
})

// Route to verify login details



app.post("/verify_for_login", (req, res) => {

    const { userid, password } = req.body;

    const query = "SELECT * FROM users WHERE userid=?";

    db.query(query, [userid], async (error, result) => {

        if (error) {
            return res.status(500).json({
                message: error.message,
                success: false
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: "Invalid User ID or Password.",
                success: false
            });
        }

        const user = result[0];

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                message: "Invalid User ID or Password.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Login Successful",
            success: true
        });

    });

});

//route to get the  comparepassword


app.post("/comparepassword", async (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT password FROM users WHERE email = ?`;
    db.query(query, [email], async (error, result) => {
        if (error) 
        {
            return res.status(500).json({ message: error });
        }

        if (result.length === 0) 
        {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const oldHashedPassword = result[0].password;

        // Compare new password with old password
        const samePassword = await bcrypt.compare(
            password,
            oldHashedPassword
        );

        if (samePassword) {
            return res.status(400).json({
                message: "New password cannot be the same as your previous password.",
                same:true
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password
        const updateQuery =
            `UPDATE users SET password = ? WHERE email = ?`;

        db.query(updateQuery,
            [hashedPassword, email],
            (err) => {

                if (err) {
                    return res.status(500).json({
                        message: err
                    });
                }

                return res.status(200).json({
                    message: "Password updated successfully",
                    same:false
                });

            });

    });

});
// route to get the flights

app.post("/get_flights",(req,res)=>{

    const {from,to,date,Passengertype,val,classtype}=req.body;
    const query=`select * from flights 
          where from_city=? and to_city=?
          and departure_date=?`
    db.query(query,[from,to,date],(error,result)=>{
        if(error)
        {
            return res.status(500).json({messsage:error});
        }
        if (result.length === 0) 
        {
            return res.status(404).json({
                success: false,
                message: "No flights available for the selected route."
            });
        }
        return res.status(200).json({message:"data is received from database",
                 data:result,
                 success:true});
    });
});

// get booked seats details

app.post("/get_bookedseats",(req,res)=>{

    const { travelClass } = req.body;

    console.log("Travel Class:", travelClass);

    const query = "SELECT seat_no FROM bookings WHERE travel_class=?";

    db.query(query,[travelClass],(error,result)=>{

        if(error)
        {
            console.log(error);
            return res.status(500).json({
                message:error.message
            });
        }

        return res.json({
            seats: result.map(row => row.seat_no)
        });

    });

});

// check seat status
app.post("/get_seat_status",(req,res)=>{

    const {seatnumber}=req.body;

    const query=`select* from bookings where seat_no=?`;
    db.query(query,[seatnumber],(error,result)=>{
        if(error)
        {
            return res.status(500).json({message:error});
        }
        if(result.length==0)
        {
            return res.json({message:"this is seat is not booked.It is available to book",
                status:"available"}
            );
        }
        return  res.json({message:"this is seat is already booked.",
                status:"booked"}
            );
    });
});

// get registered mail by using userid
app.post("/get_email",(req,res)=>{

    const{userid}=req.body;

    const query=`select email,
                 id
                 from users where userid=?`;
    db.query(query,[userid],(error,result)=>{
        if(error)
        {
            return res.status(500).json({message:error});
        }
        return res.status(200).json({message:"email recieved from backend",
            email:result[0].email,
            id:result[0].id});
    });
});

app.post("/store_data",(req,res)=>{

    const {
        flight_id,
        user_id,
        seats,
        passengers,
        travel_class,
        pnr
    } = req.body;

    const query = `
        SELECT *
        FROM bookings
        WHERE flight_id = ?
        AND user_id = ?
        AND travel_class=?
        AND seat_no IN (?)
    `;

    db.query(query,[flight_id,user_id,travel_class,seats],(error,result)=>{

        if(error)
        {
            return res.status(500).json({
                success:false,
                message:error.message
            });
        }

        if(result.length > 0)
        {
            return res.json({
                success:false,
                message:"This booking already exists."
            });
        }

        // Insert booking
        for(let i=0;i<passengers.length;i++)
        {
            db.query(
                `INSERT INTO bookings
                (
                    flight_id,
                    pnr,
                    user_id,
                    seat_no,
                    travel_class,
                    passenger_name,
                    passenger_age,
                    passenger_gender,
                    payment_status,
                    booking_status
                )
                VALUES(?,?,?,?,?,?,?,?,?,?)`,
                [
                    flight_id,
                    pnr,
                    user_id,
                    seats[i],
                    travel_class,
                    passengers[i].name,
                    passengers[i].age,
                    passengers[i].gender,
                    "Success",
                    "Confirmed"
                ]
            );
        }

        return res.json({
            success:true,
            message:"Booking Successful"
        });

    });

});
// route to save the  users data in database

app.post("/store_profile_data", (req, res) => {

    let {
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
        userid
    } = req.body;

    passport = passport.trim() === "" ? null : passport;

    const checkQuery = "SELECT * FROM profile WHERE userid=?";

    db.query(checkQuery, [userid], (err, result) => {

        if(err)
        {
            return res.json({
                success:false,
                message:err.message
            });
        }

        if(result.length > 0)
        {
            // UPDATE

            const updateQuery = `
            UPDATE profile
            SET
                fullname=?,
                dob=?,
                gender=?,
                phonenumber=?,
                nationality=?,
                address=?,
                city=?,
                state=?,
                country=?,
                pincode=?,
                aadhaar=?,
                passport=?
            WHERE userid=?`;

            db.query(updateQuery,
            [
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
                userid
            ],
            (err)=>{

                if(err)
                {
                    return res.json({
                        success:false,
                        message:err.message
                    });
                }

                return res.json({
                    success:true,
                    message:"Profile Updated Successfully"
                });

            });

        }
        else
        {
            // INSERT

            const insertQuery=`
            INSERT INTO profile
            (
                userid,
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
                passport
            )
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)
            `;

            db.query(insertQuery,
            [
                userid,
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
                passport
            ],
            (err)=>{

                if(err)
                {
                    return res.json({
                        success:false,
                        message:err.message
                    });
                }

                return res.json({
                    success:true,
                    message:"Profile Saved Successfully"
                });

            });

        }

    });

});

app.post("/send_ticket",
upload.single("ticket"),
async(req,res)=>{
     
    try
    {
        const email = req.body.email;

        await transport.sendMail({
    from: "srikanthreddybapatu04@gmail.com",
    to: email,
    subject: "Your Airline E-Ticket",
    html: `
        <h2>Booking Confirmed ✅</h2>

        <p>Dear Passenger,</p>

        <p>Thank you for choosing our Airline Reservation System.</p>

        <p>Your booking has been confirmed successfully.</p>

        <p>Please find your e-ticket attached with this email.</p>

        <br>

        <p>Have a safe and pleasant journey! ✈</p>
    `,
    attachments: [
        {
            filename: "E-Ticket.pdf",
            content: req.file.buffer
        }
    ]
});

        return res.json({
            success:true,
            message:"PDF received successfully"
        });
    }
    catch(err)
    {
        return res.json({
            success:false,
            message:err.message
        });
    }

});

app.post("/get_profile_data", (req, res) => {

    const { userid } = req.body;

    const sql = `
    SELECT *
    FROM profile
    WHERE userid = ?
    `;

    db.query(sql, [userid], (err, result) => {

        if (err) {
            return res.json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.json({
                success: false,
                message: "Profile not found"
            });
        }

        return res.json({
            success: true,
            profile: result[0]
        });

    });

});

//get my_booking

app.post("/get_my_bookings", (req, res) => {

    const { userid } = req.body;

    const getUserQuery = `
        SELECT id
        FROM users
        WHERE userid = ?
    `;

    db.query(getUserQuery, [userid], (err, userResult) => {

        if(err)
        {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if(userResult.length === 0)
        {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const userid = userResult[0].id;

        const query = `
            SELECT
                b.*,
                f.airline_name,
                f.flight_number,
                f.from_city,
                f.to_city,
                f.departure_date,
                f.departure_time,
                f.arrival_time

            FROM bookings b

            JOIN flights f
            ON b.flight_id = f.flight_id

            WHERE b.user_id = ?

            ORDER BY b.booked_at DESC
        `;

        db.query(query, [userid], (err, result) => {

            if(err)
            {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            return res.json({
                success: true,
                bookings: result
            });

        });

    });

});

app.post("/get_flightsdata", (req, res) => {

    const { pnr } = req.body;

    const query = `
    SELECT
        f.*,
        b.pnr,
        b.travel_class,
        b.seat_no,
        b.passenger_name,
        b.passenger_age,
        b.passenger_gender
    FROM bookings b
    JOIN flights f
    ON b.flight_id = f.flight_id
    WHERE b.pnr = ?
    `;

    db.query(query, [pnr], (err, result) => {

        if (err) {
            return res.json({
                success: false,
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.json({
                success: false,
                message: "Ticket not found"
            });
        }

        const flight = {
            flight_id: result[0].flight_id,
            airline_name: result[0].airline_name,
            flight_number: result[0].flight_number,
            from_city: result[0].from_city,
            to_city: result[0].to_city,
            departure_date: result[0].departure_date,
            departure_time: result[0].departure_time,
            arrival_time: result[0].arrival_time
        };

        let seats = [];
        let passengers = [];

        result.forEach((row) => {

            seats.push(row.seat_no);

            passengers.push({
                name: row.passenger_name,
                age: row.passenger_age,
                gender: row.passenger_gender
            });

        });

        let ticketprice = 0;

        switch (result[0].travel_class) {

            case "Economy":
                ticketprice = result[0].economy_price;
                break;

            case "Premium Economy":
                ticketprice = result[0].premium_economy_price;
                break;

            case "Business":
                ticketprice = result[0].business_price;
                break;

            case "First Class":
                ticketprice = result[0].first_class_price;
                break;
        }

        return res.json({

            success: true,

            flight: flight,

            travelClass: result[0].travel_class,
        
            noofpeople: passengers.length,

            ticketprice: ticketprice,

            seats: seats,

            passengers: passengers

        });

    });

});

// Start Server
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});












