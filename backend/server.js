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


app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);


app.use(
    "/api/places",
    placesRoutes
);


app.use(
    "/api/users",
    usersRoutes
);


app.use(
    "/api/trips",
    tripsRoutes
);


/*
    Opening localhost:5000
    should always start at Login.
*/

app.get("/", function(req, res) {

    res.redirect("/login.html");

});


const PORT = 5000;


app.listen(
    PORT,
    function() {

        console.log(
            "Website running on http://localhost:5000"
        );

    }
);