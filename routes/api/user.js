const express = require("express");
const jwt = require("jsonwebtoken");
require('dotenv').config()
const {getUser, addUser, changePassword, changeUsername} = require("../../services/users.dal");
const crypto = require("crypto");
const {checkAndRun} = require("./apiutils");
const router = express.Router();

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

    if (!email || !password) {
        res.status(400).json({
            message: "email and password are required"
        });
    } else {
        getUser(email)
            .then((user) => {
                if (user) {
                    if (user.password === hashPassword(password, user.salt)) {
                        const token = jwt.sign({
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }, process.env.JWT_SECRET, { expiresIn: "6h" });
                        res.status(200).json({token})
                    } else {
                        res.status(403).send("Incorrect password");
                    }
                } else {
                    res.status(400).send("Invalid User");
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
                        .catch(() => res.status(500).send("Internal Server Error"));
                }
            })
            .catch(() => res.status(500).send("Internal Server Error"));
    }
});

router.patch("/password", express.json(), (req, res) => {
    checkAndRun(req, res, user => {
        const password = req.body.password;
        if (!password) {
            res.status(400).json({
                message: "password is required"
            });
        } else {
            const salt = crypto.randomBytes(16).toString('hex');
            const hash = hashPassword(password, salt);
            changePassword(user.email, hash, salt)
                .then((success) => {
                    if (success) {
                        res.status(200).send("")
                    } else {
                        res.status(500).send("Internal Server Error")
                    }
                })
                .catch((err) => {
                    console.log(err)
                    res.status(500).send("Internal Server Error")
                });
        }
    })
});

router.patch("/name", express.json(), (req, res) => {
    checkAndRun(req, res, user => {
        const username = req.body.username;
        if (!username) {
            res.status(400).json({
                message: "username is required"
            });
        } else {
            changeUsername(user.email, username)
                .then((success) => {
                    if (success) {
                        res.status(200).send("")
                    } else {
                        res.status(500).send("Internal Server Error")
                    }
                })
                .catch((err) => {
                    console.log(err)
                    res.status(500).send("Internal Server Error")
                });
        }
    })
});

module.exports = router;