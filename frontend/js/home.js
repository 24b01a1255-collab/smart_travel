function getMyLocation() {

    if (!navigator.geolocation) {

        alert(
            "GPS is not supported by your browser."
        );

        return;
    }


    document.getElementById(
        "locationStatus"
    ).innerText =
        "Getting your location...";


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            getNearbyPlaces(
                latitude,
                longitude
            );

        },

        function(error) {

            console.log(error);

            alert(
                "Location permission was denied or location could not be found."
            );

        }

    );

}



async function getNearbyPlaces(
    latitude,
    longitude
) {

    try {

        document.getElementById(
            "locationStatus"
        ).innerText =
            "Finding tourist places near you...";


        const response =
            await fetch(

                `/api/places/nearby?latitude=${latitude}&longitude=${longitude}`

            );


        const data =
            await response.json();


        if (!data.success) {

            alert(data.message);

            return;
        }


        document.getElementById(
            "locationStatus"
        ).innerText =
            `${data.count} tourist places found near you.`;


        displayPlaces(
            data.places
        );


    } catch (error) {

        console.log(error);

        alert(
            "Unable to connect to the server."
        );

    }

}



async function searchPlace() {

    const place =
        document.getElementById(
            "placeSearch"
        ).value.trim();


    if (!place) {

        alert(
            "Please enter a place."
        );

        return;
    }


    try {

        document.getElementById(
            "locationStatus"
        ).innerText =
            "Searching for tourist places...";


        const response =
            await fetch(

                `/api/places/search?place=${encodeURIComponent(place)}`

            );


        const data =
            await response.json();


        if (!data.success) {

            alert(data.message);

            return;
        }


        document.getElementById(
            "locationStatus"
        ).innerText =
            `${data.count} tourist places found near ${place}.`;


        displayPlaces(
            data.places
        );


    } catch (error) {

        console.log(error);

        alert(
            "Unable to search for this place."
        );

    }

}



function displayPlaces(places) {

    const container =
        document.getElementById(
            "placesContainer"
        );


    container.innerHTML = "";


    if (places.length === 0) {

        container.innerHTML = `
            <p>
                No tourist places found.
            </p>
        `;

        return;
    }


    for (
        let i = 0;
        i < places.length;
        i++
    ) {

        const place =
            places[i];


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "place-card";


        card.innerHTML = `

            <h3>
                ${place.name}
            </h3>

            <p>
                Category:
                ${place.category}
            </p>

            <p>
                ${place.description}
            </p>

            <button
                onclick="viewPlace(
                    ${place.latitude},
                    ${place.longitude}
                )"
            >
                📍 View on Map
            </button>

        `;


        container.appendChild(
            card
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