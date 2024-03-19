const {getAllUsers} = require("../../services/users.dal");
const router = require("express").Router();

router.get("/", (req, res) => {
    getAllUsers()
        .then((data) => {
            res.status(200).json(data)
        })
        .catch(() => res.status(500).send("Error"))
})

module.exports = router