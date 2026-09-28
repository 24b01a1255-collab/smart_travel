const express = require("express");

const router = express.Router();

const {
    getNearbyPlaces,
    searchPlace
} = require("../services/placesService");



router.get("/nearby", async function(req, res) {

    try {

        const latitude =
            Number(req.query.latitude);

        const longitude =
            Number(req.query.longitude);


        if (
            Number.isNaN(latitude) ||
            Number.isNaN(longitude)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Valid latitude and longitude are required"

            });

        }


        const places =
            await getNearbyPlaces(
                latitude,
                longitude
            );


        res.json({

            success: true,

            count: places.length,

            places: places

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});



router.get("/search", async function(req, res) {

    try {

        const place =
            req.query.place;


        if (!place) {

            return res.status(400).json({

                success: false,

                message:
                    "Place name is required"

            });

        }


        const places =
            await searchPlace(place);


        res.json({

            success: true,

            count: places.length,

            places: places

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});


module.exports = router;