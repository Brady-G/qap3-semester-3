const jwt = require("jsonwebtoken");
require('dotenv').config();

/**
 *
 * @param req {Request}
 * @param res {Response}
 * @param callback
 */
const checkAndRun = (req, res, callback) => {
    const header = req.headers["authorization"]
    const token = header && header.split(" ")[1]

    if (!token) {
        res.sendStatus(401);
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                res.sendStatus(403);
            } else {
                callback(user)
            }
        })
    }

}

module.exports = {
    checkAndRun
}