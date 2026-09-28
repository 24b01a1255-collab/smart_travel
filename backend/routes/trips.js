const express = require("express");

const router = express.Router();

const db = require("../db");


router.post("/create", function(req, res) {

    const {
        user_id,
        destination,
        people,
        days,
        budget,
        preferences
    } = req.body;


    if (
        !destination ||
        !people ||
        !days ||
        !budget
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Please fill all trip details"

        });

    }


    const sql = `

        INSERT INTO trips
        (
            user_id,
            destination,
            people,
            days,
            budget,
            preferences,
            total_estimated_cost
        )

        VALUES (?, ?, ?, ?, ?, ?, ?)

    `;


    const estimatedCost =
        Number(budget);


    db.query(

        sql,

        [
            user_id || null,
            destination,
            people,
            days,
            budget,
            preferences || "",
            estimatedCost
        ],

        function(error, result) {

            if (error) {

                console.log(error);

                return res.status(500).json({

                    success: false,

                    message:
                        "Unable to save trip"

                });

            }


            res.json({

                success: true,

                message:
                    "Trip saved successfully",

                tripId:
                    result.insertId

            });

        }

    );

});


module.exports = router;