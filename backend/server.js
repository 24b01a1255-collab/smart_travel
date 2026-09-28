const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./db");

const placesRoutes = require("./routes/places");
const usersRoutes = require("./routes/users");
const tripsRoutes = require("./routes/trips");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

app.use("/api/trips", tripsRoutes);

app.get("/", function(req, res) {

    res.sendFile(
        path.join(__dirname, "../frontend/index.html")
    );

});

const PORT = 5000;

app.listen(PORT, function() {

    console.log("MySQL connected successfully");

    console.log(
        `Website running on http://localhost:${PORT}`
    );

});