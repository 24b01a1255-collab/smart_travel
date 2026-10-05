async function createTrip() {

    const destination =
        document.getElementById(
            "destination"
        ).value;


    const people =
        document.getElementById(
            "people"
        ).value;


    const days =
        document.getElementById(
            "days"
        ).value;


    const budget =
        document.getElementById(
            "budget"
        ).value;


    if (
        !destination ||
        !people ||
        !days ||
        !budget
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    const storedUser =
        localStorage.getItem(
            "user"
        );


    let userId = null;


    if (storedUser) {

        const user =
            JSON.parse(
                storedUser
            );

        userId =
            user.id;

    }


    document.getElementById(
        "message"
    ).innerText =
        "Creating your trip plan...";


    try {

        const response =
            await fetch(

                "/api/trips/create",

                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            user_id:
                                userId,

                            destination:
                                destination,

                            people:
                                Number(
                                    people
                                ),

                            days:
                                Number(
                                    days
                                ),

                            budget:
                                Number(
                                    budget
                                )

                        })

                }

            );


        const data =
            await response.json();


        if (!data.success) {

            document.getElementById(
                "message"
            ).innerText =
                data.message;

            return;

        }


        document.getElementById(
            "message"
        ).innerText =
            "Trip created successfully!";


        displayTripPlan(
            data.plan
        );


    } catch (error) {

        console.log(error);


        document.getElementById(
            "message"
        ).innerText =
            "Unable to create trip.";

    }

}



function displayTripPlan(plan) {

    const container =
        document.getElementById(
            "tripResult"
        );


    container.innerHTML = "";


    const heading =
        document.createElement(
            "h2"
        );


    heading.innerText =
        "Your Trip Plan";


    container.appendChild(
        heading
    );


    const summary =
        document.createElement(
            "div"
        );


    summary.className =
        "trip-summary";


    summary.innerHTML = `

        <h3>
            ${plan.destination}
        </h3>

        <p>
            Number of People:
            ${plan.people}
        </p>

        <p>
            Number of Days:
            ${plan.days}
        </p>

        <p>
            Customer Budget:
            ₹${plan.total_budget}
        </p>

        <p>
            Estimated Hotel Cost:
            ₹${plan.hotel.total_cost}
        </p>

        <p>
            Remaining Budget:
            ₹${plan.remaining_budget}
        </p>

        <p>
            Daily Sightseeing Budget:
            ₹${plan.daily_sightseeing_budget}
        </p>

    `;


    container.appendChild(
        summary
    );


    const hotelCard =
        document.createElement(
            "div"
        );


    hotelCard.className =
        "hotel-card";


    hotelCard.innerHTML = `

        <h2>
            Hotel Stay
        </h2>

        <h3>
    ${plan.hotel.name}
        </h3>

        <p>
            Type:
            ${plan.hotel.category}
        </p>

        ${
            plan.hotel.address
            ?
            `
                <p>
                    Address:
                    ${plan.hotel.address}
                </p>
            `
            :
            ""
        }

        <p>
            People:
            ${plan.people}
        </p>

        <p>
            Rooms Required:
            ${plan.hotel.rooms}
        </p>

        <p>
            Nights:
            ${plan.hotel.nights}
        </p>

        <p>
            Estimated Room Rate:
            ₹${plan.hotel.estimated_room_rate}
            per room/night
        </p>

        <p>
            Estimated Hotel Cost:
            ₹${plan.hotel.total_cost}
        </p>

        ${
            plan.hotel.latitude !== null
            ?
            `
                <button
                    onclick="viewPlace(
                        ${plan.hotel.latitude},
                        ${plan.hotel.longitude}
                    )"
                >
                    📍 View Hotel on Map
                </button>
            `
            :
            ""
        }

    `;


    container.appendChild(
        hotelCard
    );


    for (
        let i = 0;
        i < plan.itinerary.length;
        i++
    ) {

        const day =
            plan.itinerary[i];


        const dayCard =
            document.createElement(
                "div"
            );


        dayCard.className =
            "day-card";


        let placesHTML =
            "";


        if (
            day.places.length === 0
        ) {

            placesHTML = `

                <p>
                    No new tourist place
                    available for this day.
                </p>

            `;

        } else {

            for (
                let j = 0;
                j < day.places.length;
                j++
            ) {

                const place =
                    day.places[j];


                const placeBudget =
                    Math.floor(

                        day.budget /
                        day.places.length

                    );


                placesHTML += `

                    <div
                        class="itinerary-place"
                    >

                        <h4>
                            ${place.name}
                        </h4>

                        <p>
                            Category:
                            ${place.category}
                        </p>

                        <p>
                            Estimated
                            Sightseeing Budget:
                            ₹${placeBudget}
                        </p>

                        <button
                            onclick="viewPlace(
                                ${place.latitude},
                                ${place.longitude}
                            )"
                        >
                            📍 View on Map
                        </button>

                    </div>

                `;

            }

        }


        dayCard.innerHTML = `

            <h3>
                Day ${day.day_number}
            </h3>

            <p class="day-budget">

                Day Sightseeing Budget:
                ₹${day.budget}

            </p>

            ${placesHTML}

        `;


        container.appendChild(
            dayCard
        );

    }

}



function viewPlace(
    latitude,
    longitude
) {

    window.open(

        `https://www.google.com/maps?q=${latitude},${longitude}`,

        "_blank"

    );

}