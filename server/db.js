const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 4000,

    ssl: {
        minVersion: "TLSv1.2"
    }
});

db.connect((err) => {

    if (err) {
        console.log("Database connection failed");
        console.log(err);
        return;
    }

    console.log("Database connected successfully");

});

module.exports = db;