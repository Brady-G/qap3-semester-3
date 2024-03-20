const express = require("express");
const {getAllUsers} = require("../../services/users.dal");
const router = express.Router();

router.get("/users", (req, res) => {
    getAllUsers()
        .then((data) => {
            res.status(200).json(data)
        })
        .catch(() => res.sendStatus(500))
})

router.use('/user', require("./user"));
router.use('/projects', require("./project"));

module.exports = router