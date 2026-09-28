const axios = require("axios");


async function getNearbyPlaces(latitude, longitude) {

    const radius = 10000;


    const query = `
        [out:json][timeout:60];

        (
            node["tourism"~"attraction|museum|viewpoint|theme_park|zoo|aquarium|gallery|archaeological_site|artwork|picnic_site"](around:${radius},${latitude},${longitude});

            way["tourism"~"attraction|museum|viewpoint|theme_park|zoo|aquarium|gallery|archaeological_site|artwork|picnic_site"](around:${radius},${latitude},${longitude});

            relation["tourism"~"attraction|museum|viewpoint|theme_park|zoo|aquarium|gallery|archaeological_site|artwork|picnic_site"](around:${radius},${latitude},${longitude});
        );

        out center;
    `;


    try {

        const response =
            await axios.post(

                "https://overpass-api.de/api/interpreter",

                "data=" +
                encodeURIComponent(query),

                {
                    headers: {

                        "Content-Type":
                            "application/x-www-form-urlencoded",

                        "User-Agent":
                            "SmartTravelGuideCollegeProject/1.0",

                        "Referer":
                            "http://localhost:5000/"

                    },

                    timeout: 60000

                }

            );


        const elements =
            response.data.elements;


        const places = [];


        for (
            let i = 0;
            i < elements.length;
            i++
        ) {

            const element =
                elements[i];


            if (
                !element.tags ||
                !element.tags.name
            ) {

                continue;
            }


            let latitudeValue =
                element.lat;

            let longitudeValue =
                element.lon;


            if (element.center) {

                latitudeValue =
                    element.center.lat;

                longitudeValue =
                    element.center.lon;
            }


            places.push({

                id:
                    element.id,

                name:
                    element.tags.name,

                category:
                    element.tags.tourism,

                latitude:
                    latitudeValue,

                longitude:
                    longitudeValue,

                description:
                    element.tags.description ||
                    "Tourist spot near this location"

            });

        }


        return places;


    } catch (error) {

        console.log(
            "Places error:",
            error.message
        );


        if (error.response) {

            console.log(
                "Overpass status:",
                error.response.status
            );

            console.log(
                "Overpass response:",
                error.response.data
            );

        }


        throw new Error(
            "Unable to find nearby tourist places"
        );

    }

}



async function searchPlace(place) {

    try {

        const response =
            await axios.get(

                "https://nominatim.openstreetmap.org/search",

                {

                    params: {

                        q:
                            place,

                        format:
                            "json",

                        limit:
                            1

                    },

                    headers: {

                        "User-Agent":
                            "SmartTravelGuideCollegeProject/1.0"

                    },

                    timeout: 30000

                }

            );


        if (
            !response.data ||
            response.data.length === 0
        ) {

            throw new Error(
                "Place not found"
            );

        }


        const location =
            response.data[0];


        const latitude =
            Number(location.lat);


        const longitude =
            Number(location.lon);


        return await getNearbyPlaces(

            latitude,

            longitude

        );


    } catch (error) {

        console.log(
            "Search place error:",
            error.message
        );


        if (error.response) {

            console.log(
                "Search API status:",
                error.response.status
            );

        }


        throw new Error(
            "Unable to find this place"
        );

    }

}



module.exports = {

    getNearbyPlaces,

    searchPlace

};