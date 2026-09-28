const mysql = require("mysql2");

const db = mysql.createPool({

    host: "localhost",

    user: "root",

    password: "",

    database: "smart_travel_guide",

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0

});

db.getConnection(function(error, connection) {

    if (error) {

        console.log("MySQL connection failed:");

        console.log(error.message);

        return;
    }

    console.log("MySQL connected successfully");

    connection.release();

});

module.exports = db;