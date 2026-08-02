const mysql2 = require("mysql2");

// Create connection object
const db = mysql2.createConnection({
    host: "localhost",
    user: "srikanth",
    password: "Srikanth@7569@",
    database: "airline_reservation_system"
});

db.connect((err) => {
    if (err) {
        console.log("Database is not connected");
        console.log(err);
    } else {
        console.log("Database connected successfully");
    }
});

module.exports = db;