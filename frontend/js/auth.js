async function registerUser() {

    const name =
        document.getElementById(
            "name"
        ).value.trim();


    const email =
        document.getElementById(
            "email"
        ).value.trim();


    const password =
        document.getElementById(
            "password"
        ).value;


    if (
        !name ||
        !email ||
        !password
    ) {

        document.getElementById(
            "message"
        ).innerText =
            "Please fill all fields.";

        return;

    }


    try {

        const response =
            await fetch(
                "/api/users/register",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        name:
                            name,

                        email:
                            email,

                        password:
                            password

                    })

                }
            );


        const data =
            await response.json();


        document.getElementById(
            "message"
        ).innerText =
            data.message;


        if (data.success) {

            setTimeout(
                function() {

                    window.location.href =
                        "login.html";

                },
                1000
            );

        }


    } catch (error) {

        console.log(error);

        document.getElementById(
            "message"
        ).innerText =
            "Unable to connect to server.";

    }

}



async function loginUser() {

    const email =
        document.getElementById(
            "email"
        ).value.trim();


    const password =
        document.getElementById(
            "password"
        ).value;


    if (
        !email ||
        !password
    ) {

        document.getElementById(
            "message"
        ).innerText =
            "Please enter email and password.";

        return;

    }


    try {

        const response =
            await fetch(
                "/api/users/login",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        email:
                            email,

                        password:
                            password

                    })

                }
            );


        const data =
            await response.json();


        document.getElementById(
            "message"
        ).innerText =
            data.message;


        if (data.success) {


            localStorage.setItem(

                "user",

                JSON.stringify(
                    data.user
                )

            );


            setTimeout(
                function() {

                    window.location.href =
                        "index.html";

                },
                500
            );

        }


    } catch (error) {

        console.log(error);

        document.getElementById(
            "message"
        ).innerText =
            "Unable to connect to server.";

    }

}



function logoutUser() {

    localStorage.removeItem(
        "user"
    );


    window.location.href =
        "login.html";

}