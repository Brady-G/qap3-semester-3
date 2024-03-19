const express = require("express");
const {getAllUsers} = require("../../services/users.dal");
const router = express.Router();

router.get("/", (req, res) => {
    getAllUsers()
        .then((data) => {
            res.status(200).json(data)
        })
        .catch(() => res.status(500).send("Error"))
})

router.use('/user', require("./user"));

module.exports = router