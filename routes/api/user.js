const express = require("express");
const jwt = require("jsonwebtoken");
require('dotenv').config()
const {getUser, addUser, changePassword, changeUsername} = require("../../services/users.dal");
const crypto = require("crypto");
const {checkAndRun} = require("./apiutils");
const router = express.Router();

// Hashes the password using the input and salt
const hashPassword = (password, salt) => {
    return crypto.pbkdf2Sync(
        password, salt,
        1000, 64,
        "sha512"
    ).toString("hex");
}

router.post("/login", express.json(), (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Require that both the email and password are in the body before trying to perform a login
    if (!email || !password) {
        res.status(400).json({
            message: "email and password are required"
        });
    } else {
        // Get the user associated with the email
        getUser(email)
            .then((user) => {
                if (user) {
                    // Check if the password hash in the associated user is
                    // the same as the hash from the users salt and the password inputted
                    if (user.password === hashPassword(password, user.salt)) {
                        // Create a JsonWebToken and return it
                        const token = jwt.sign({
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }, process.env.JWT_SECRET);
                        res.status(200).json({token})
                    } else {
                        // If the password hashes do not equal then its not the same password and incorrect password
                        // error is sent back
                        res.status(403).send("Incorrect password");
                    }
                } else {
                    // Send a bad request error if the email is not associated with an account
                    res.status(400).send("No user with that email");
                }
            })
            .catch(() => res.status(500).send("Internal Server Error"));
    }
});

router.post("/register", express.json(), (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    if (!email || !password || !username) {
        res.status(400).json({
            message: "email and password and username are required"
        });
    } else {
        getUser(email)
            .then((user) => {
                if (user) {
                    res.status(400).send("User already exists");
                } else {
                    const salt = crypto.randomBytes(16).toString('hex');
                    const hash = hashPassword(password, salt);
                    addUser(username, email, hash, salt)
                        .then((success) => {
                            if (success) {
                                res.status(200).send("")
                            } else {
                                res.status(500).send("Internal Server Error")
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            res.sendStatus(500);
                        });
                }
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
    }
});

router.patch("/password", express.json(), (req, res) => {
    // Use checkAndRun to require that the user exists and is valid
    checkAndRun(req, res, user => {
        const password = req.body.password;

        // Require that a password is in the body for a password change
        if (!password) {
            res.status(400).json({
                message: "password is required"
            });
        } else {
            const salt = crypto.randomBytes(16).toString('hex');
            const hash = hashPassword(password, salt);
            // Create salt and hash a new password and call changePassword DAL
            changePassword(user.email, hash, salt)
                .then((success) => {
                    // If successful then return 200 if not then 500 due
                    // to it meaning an invalid user request a password change
                    if (success) {
                        res.sendStatus(200)
                    } else {
                        res.sendStatus(500)
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.sendStatus(500);
                });
        }
    })
});

router.patch("/name", express.json(), (req, res) => {
    // Use checkAndRun to require that the user exists and is valid
    checkAndRun(req, res, user => {
        const username = req.body.username;

        // Require that a username is in the body for a name change
        if (!username) {
            res.status(400).json({
                message: "username is required"
            });
        } else {
            // call changeUsername DAL with the new username
            changeUsername(user.email, username)
                .then((success) => {
                    // If successful then return 200 if not then 500 due
                    // to it meaning an invalid user request a password change
                    if (success) {
                        res.sendStatus(200)
                    } else {
                        res.sendStatus(500)
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.sendStatus(500);
                });
        }
    })
});

module.exports = router;