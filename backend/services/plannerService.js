const {
    getCoordinates,
    getNearbyPlaces,
    getNearbyHotels
} = require("./placesService");



async function createPlan(
    destination,
    people,
    days,
    budget
) {

    const coordinates =
        await getCoordinates(
            destination
        );


    const places =
        await getNearbyPlaces(

            coordinates.latitude,

            coordinates.longitude

        );


    if (
        places.length === 0
    ) {

        throw new Error(
            "No tourist places found for this destination"
        );

    }


    const hotels =
        await getNearbyHotels(

            coordinates.latitude,

            coordinates.longitude

        );


    /*
        Estimated hotel room price.

        This is an estimate because
        OpenStreetMap does not provide
        reliable live hotel prices.
    */

    const estimatedRoomRate =
        2500;


    /*
        Assume one room can accommodate
        two people.
    */

    const rooms =
        Math.ceil(
            Number(people) / 2
        );


    /*
        Number of nights is based on
        number of trip days.
    */

    const hotelNights =
        Number(days);


    /*
        Hotel cost =
        rooms × nights × room rate
    */

    const hotelCost =
        estimatedRoomRate *
        rooms *
        hotelNights;


    const customerBudget =
        Number(budget);


    /*
        Remaining budget after hotel.
    */

    const remainingBudget =
        customerBudget -
        hotelCost;


    if (
        remainingBudget < 0
    ) {

        throw new Error(

            "Your budget is not enough to cover the estimated hotel stay."

        );

    }


    /*
        Divide the remaining money
        equally among the days.
    */

    const dailySightseeingBudget =
        Math.floor(

            remainingBudget /
            Number(days)

        );


    /*
        Remove duplicate tourist places.
    */

    const uniquePlaces = [];

    const usedNames =
        new Set();


    for (
        let i = 0;
        i < places.length;
        i++
    ) {

        const name =
            places[i].name
                .toLowerCase();


        if (
            !usedNames.has(name)
        ) {

            usedNames.add(name);

            uniquePlaces.push(
                places[i]
            );

        }

    }


    /*
        Create day-wise itinerary.
    */

    const itinerary = [];


    const totalPlaces =
        uniquePlaces.length;


    /*
        Distribute tourist places
        across the available days.
    */

    const placesPerDay =
        Math.max(

            1,

            Math.ceil(

                totalPlaces /
                Number(days)

            )

        );


    let placeIndex = 0;


    for (
        let day = 1;
        day <= Number(days);
        day++
    ) {

        const dayPlaces = [];


        for (
            let j = 0;
            j < placesPerDay;
            j++
        ) {

            if (
                placeIndex >=
                totalPlaces
            ) {

                break;

            }


            dayPlaces.push(

                uniquePlaces[
                    placeIndex
                ]

            );


            placeIndex++;

        }


        itinerary.push({

            day_number:
                day,

            budget:
                dailySightseeingBudget,

            places:
                dayPlaces

        });

    }


    /*
        Select a hotel dynamically
        from the hotels found near
        the destination.
    */

    let selectedHotel =
        null;


    if (
        hotels.length > 0
    ) {

        selectedHotel =
            hotels[0];

    }


    /*
        Return the complete trip plan.
    */

    return {

        destination:
            destination,

        people:
            Number(people),

        days:
            Number(days),

        total_budget:
            customerBudget,


        hotel: {

            name:
                selectedHotel
                    ? selectedHotel.name
                    : "No nearby hotel found",

            category:
                selectedHotel
                    ? selectedHotel.category
                    : "Not available",

            address:
                selectedHotel
                    ? selectedHotel.address
                    : "",

            city:
                selectedHotel
                    ? selectedHotel.city
                    : "",

            latitude:
                selectedHotel
                    ? selectedHotel.latitude
                    : null,

            longitude:
                selectedHotel
                    ? selectedHotel.longitude
                    : null,

            rooms:
                rooms,

            nights:
                hotelNights,

            estimated_room_rate:
                estimatedRoomRate,

            total_cost:
                hotelCost

        },


        remaining_budget:
            remainingBudget,


        daily_sightseeing_budget:
            dailySightseeingBudget,


        itinerary:
            itinerary

    };

}



module.exports = {

    createPlan

};