async function registerUser() {

    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;


    const response =
        await fetch("/api/users/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name: name,

                email: email,

                password: password

            })

        });


    const data =
        await response.json();


    document.getElementById(
        "message"
    ).innerText =
        data.message;


    if (data.success) {

        setTimeout(function() {

            window.location.href =
                "login.html";

        }, 1000);

    }

}



async function loginUser() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;


    const response =
        await fetch("/api/users/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                email: email,

                password: password

            })

        });


    const data =
        await response.json();


    document.getElementById(
        "message"
    ).innerText =
        data.message;


    if (data.success) {

        localStorage.setItem(

            "user",

            JSON.stringify(data.user)

        );


        setTimeout(function() {

            window.location.href =
                "index.html";

        }, 1000);

    }

}