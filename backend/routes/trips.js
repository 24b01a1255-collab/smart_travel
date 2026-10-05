const express = require("express");

const router = express.Router();

const db = require("../db");

const {
    createPlan
} = require("../services/plannerService");



router.post("/create", async function(req, res) {

    try {

        const {
            user_id,
            destination,
            people,
            days,
            budget
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


        const plan =
            await createPlan(

                destination,

                people,

                days,

                budget

            );


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


        db.query(

            sql,

            [

                user_id || null,

                destination,

                people,

                days,

                budget,

                "",

                budget

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


                const tripId =
                    result.insertId;


                let totalPlaces =
                    0;


                for (
                    let i = 0;
                    i < plan.itinerary.length;
                    i++
                ) {

                    totalPlaces +=
                        plan.itinerary[i]
                            .places.length;

                }


                if (
                    totalPlaces === 0
                ) {

                    return res.json({

                        success:
                            true,

                        message:
                            "Trip created successfully",

                        tripId:
                            tripId,

                        plan:
                            plan

                    });

                }


                let completed =
                    0;


                for (
                    let i = 0;
                    i < plan.itinerary.length;
                    i++
                ) {

                    const day =
                        plan.itinerary[i];


                    const placeCount =
                        day.places.length;


                    let placeBudget =
                        0;


                    if (
                        placeCount > 0
                    ) {

                        placeBudget =
                            Math.floor(
                                day.budget /
                                placeCount
                            );

                    }


                    for (
                        let j = 0;
                        j < placeCount;
                        j++
                    ) {

                        const place =
                            day.places[j];


                        const itinerarySql = `

                            INSERT INTO itinerary
                            (
                                trip_id,
                                day_number,
                                place_name,
                                category,
                                estimated_cost
                            )

                            VALUES (?, ?, ?, ?, ?)

                        `;


                        db.query(

                            itinerarySql,

                            [

                                tripId,

                                day.day_number,

                                place.name,

                                place.category,

                                placeBudget

                            ],

                            function(error) {

                                if (error) {

                                    console.log(
                                        error
                                    );

                                }


                                completed++;


                                if (
                                    completed ===
                                    totalPlaces
                                ) {

                                    res.json({

                                        success:
                                            true,

                                        message:
                                            "Trip created successfully",

                                        tripId:
                                            tripId,

                                        plan:
                                            plan

                                    });

                                }

                            }

                        );

                    }

                }

            }

        );


    } catch (error) {

        console.log(
            "Planner error:",
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

});


module.exports = router;