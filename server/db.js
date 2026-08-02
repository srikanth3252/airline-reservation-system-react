const mysql2 = require("mysql2");

require("dotenv").config();

const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true
    }
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