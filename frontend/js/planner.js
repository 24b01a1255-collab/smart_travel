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

    const preferences =
        document.getElementById(
            "preferences"
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
        localStorage.getItem("user");


    let userId = null;


    if (storedUser) {

        const user =
            JSON.parse(storedUser);

        userId = user.id;

    }


    const response =
        await fetch(
            "/api/trips/create",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    user_id: userId,

                    destination:
                        destination,

                    people:
                        Number(people),

                    days:
                        Number(days),

                    budget:
                        Number(budget),

                    preferences:
                        preferences

                })

            }
        );


    const data =
        await response.json();


    document.getElementById(
        "message"
    ).innerText =
        data.message;

}