const axios = require("axios");
require("dotenv").config();

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

async function searchGooglePlaces(searchText) {
    if (!GOOGLE_API_KEY) {
        throw new Error("Google Maps API key is missing");
    }

    const url = "https://places.googleapis.com/v1/places:searchText";

    const requestBody = {
        textQuery: searchText,
        languageCode: "en",
        regionCode: "IN",
        maxResultCount: 20,
        rankPreference: "RELEVANCE"
    };

    const response = await axios.post(
        url,
        requestBody,
        {
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": GOOGLE_API_KEY,
                "X-Goog-FieldMask":
                    "places.id," +
                    "places.displayName," +
                    "places.formattedAddress," +
                    "places.location," +
                    "places.primaryType," +
                    "places.types," +
                    "places.rating," +
                    "places.userRatingCount," +
                    "places.googleMapsUri," +
                    "places.websiteUri"
            },
            timeout: 30000
        }
    );

    return response.data.places || [];
}

function convertGooglePlace(place) {
    let category = place.primaryType || "tourist attraction";

    category = category.replaceAll("_", " ");

    return {
        id: place.id,
        name: place.displayName
            ? place.displayName.text
            : "Unknown place",

        category: category,

        latitude: place.location
            ? place.location.latitude
            : null,

        longitude: place.location
            ? place.location.longitude
            : null,

        address: place.formattedAddress || "",

        rating: place.rating || 0,

        reviewCount: place.userRatingCount || 0,

        description: "Tourist place found using Google Places",

        googleMapsUrl: place.googleMapsUri || "",

        website: place.websiteUri || ""
    };
}


async function getNearbyPlaces(latitude, longitude) {

    if (!GOOGLE_API_KEY) {
        throw new Error("Google Maps API key is missing");
    }

    const url =
        "https://places.googleapis.com/v1/places:searchNearby";

    const requestBody = {

        includedTypes: [
            "tourist_attraction",
            "museum",
            "historical_landmark",
            "historical_place",
            "park",
            "national_park",
            "zoo",
            "aquarium",
            "art_gallery",
            "botanical_garden",
            "observation_deck",
            "scenic_spot",
            "beach",
            "lake"
        ],

        maxResultCount: 20,

        rankPreference: "POPULARITY",

        locationRestriction: {
            circle: {

                center: {
                    latitude: Number(latitude),
                    longitude: Number(longitude)
                },

                radius: 15000
            }
        }
    };

    const response = await axios.post(
        url,
        requestBody,
        {
            headers: {
                "Content-Type": "application/json",

                "X-Goog-Api-Key":
                    GOOGLE_API_KEY,

                "X-Goog-FieldMask":
                    "places.id," +
                    "places.displayName," +
                    "places.formattedAddress," +
                    "places.location," +
                    "places.primaryType," +
                    "places.types," +
                    "places.rating," +
                    "places.userRatingCount," +
                    "places.googleMapsUri," +
                    "places.websiteUri"
            },

            timeout: 30000
        }
    );

    const places = response.data.places || [];

    return places.map(convertGooglePlace);
}


async function searchPlace(place) {

    try {

        console.log("Searching Google for:", place);

        const places = await searchGooglePlaces(
            `tourist attractions in ${place}`
        );

        console.log(
            "Google places found:",
            places.length
        );

        return places.map(convertGooglePlace);

    } catch (error) {

        console.log("Google search error:");

        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }

        throw new Error(
            "Unable to find tourist places"
        );
    }
}


async function getCoordinates(place) {

    try {

        console.log(
            "Finding destination coordinates:",
            place
        );

        const places = await searchGooglePlaces(place);

        if (places.length === 0) {
            throw new Error(
                "Destination not found"
            );
        }

        const location =
            places[0].location;

        if (!location) {
            throw new Error(
                "Location not available"
            );
        }

        return {

            latitude:
                Number(location.latitude),

            longitude:
                Number(location.longitude)
        };

    } catch (error) {

        console.log(
            "Google coordinates error:",
            error.message
        );

        throw new Error(
            "Unable to find destination"
        );
    }
}


async function getNearbyHotels(
    latitude,
    longitude
) {

    try {

        if (!GOOGLE_API_KEY) {
            throw new Error(
                "Google Maps API key is missing"
            );
        }

        const url =
            "https://places.googleapis.com/v1/places:searchNearby";

        const requestBody = {

            includedTypes: [
                "hotel"
            ],

            maxResultCount: 10,

            rankPreference:
                "POPULARITY",

            locationRestriction: {

                circle: {

                    center: {

                        latitude:
                            Number(latitude),

                        longitude:
                            Number(longitude)
                    },

                    radius: 10000
                }
            }
        };

        const response = await axios.post(
            url,
            requestBody,
            {
                headers: {

                    "Content-Type":
                        "application/json",

                    "X-Goog-Api-Key":
                        GOOGLE_API_KEY,

                    "X-Goog-FieldMask":
                        "places.id," +
                        "places.displayName," +
                        "places.formattedAddress," +
                        "places.location," +
                        "places.rating," +
                        "places.userRatingCount," +
                        "places.googleMapsUri," +
                        "places.websiteUri"
                },

                timeout: 30000
            }
        );

        const places =
            response.data.places || [];

        const hotels = [];

        for (
            let i = 0;
            i < places.length;
            i++
        ) {

            const place = places[i];

            hotels.push({

                id: place.id,

                name:
                    place.displayName
                        ? place.displayName.text
                        : "Hotel",

                category: "Hotel",

                latitude:
                    place.location
                        ? place.location.latitude
                        : null,

                longitude:
                    place.location
                        ? place.location.longitude
                        : null,

                address:
                    place.formattedAddress || "",

                rating:
                    place.rating || 0,

                reviewCount:
                    place.userRatingCount || 0,

                googleMapsUrl:
                    place.googleMapsUri || "",

                website:
                    place.websiteUri || ""
            });
        }

        return hotels;

    } catch (error) {

        console.log(
            "Google hotel error:"
        );

        if (error.response) {
            console.log(
                error.response.data
            );
        } else {
            console.log(
                error.message
            );
        }

        return [];
    }
}


module.exports = {

    getCoordinates,

    getNearbyPlaces,

    getNearbyHotels,

    searchPlace
};