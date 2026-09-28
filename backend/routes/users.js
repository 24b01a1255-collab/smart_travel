const express = require("express");

const bcrypt = require("bcryptjs");

const router = express.Router();

const db = require("../db");



router.post("/register", async function(req, res) {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        if (
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All fields are required"

            });

        }


        const checkSql =
            "SELECT * FROM users WHERE email = ?";


        db.query(
            checkSql,
            [email],
            async function(error, results) {

                if (error) {

                    console.log(error);

                    return res.status(500).json({

                        success: false,

                        message:
                            "Database error"

                    });

                }


                if (results.length > 0) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Email already registered"

                    });

                }


                const hashedPassword =
                    await bcrypt.hash(
                        password,
                        10
                    );


                const sql =
                    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";


                db.query(

                    sql,

                    [
                        name,
                        email,
                        hashedPassword
                    ],

                    function(error, result) {

                        if (error) {

                            console.log(error);

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Unable to register"

                            });

                        }


                        res.json({

                            success: true,

                            message:
                                "Registration successful",

                            userId:
                                result.insertId

                        });

                    }

                );

            }
        );


    } catch (error) {

        res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

});



router.post("/login", function(req, res) {

    const {
        email,
        password
    } = req.body;


    if (!email || !password) {

        return res.status(400).json({

            success: false,

            message:
                "Email and password are required"

        });

    }


    const sql =
        "SELECT * FROM users WHERE email = ?";


    db.query(

        sql,

        [email],

        async function(error, results) {

            if (error) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Database error"

                });

            }


            if (results.length === 0) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password"

                });

            }


            const user =
                results[0];


            const valid =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!valid) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password"

                });

            }


            res.json({

                success: true,

                message:
                    "Login successful",

                user: {

                    id: user.id,

                    name: user.name,

                    email: user.email

                }

            });

        }

    );

});


module.exports = router;