const database = require("./database");

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id AS _id, name, password, email FROM public."users" ORDER BY id DESC;`
        database.query(sql, [], (err, result) => {
            if (err) {
                reject(err);
            } else if (!result) {
                reject("No results found")
            } else {
                resolve(result.rows);
            }
        });
    });
}

module.exports = {
    getAllUsers
}