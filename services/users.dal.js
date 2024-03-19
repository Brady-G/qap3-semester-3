const database = require("./database");

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, name, password, email FROM public."users" ORDER BY id DESC;`
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

const getUser = (email) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM public."users" WHERE email = $1;`
        database.query(sql, [email], (err, result) => {
            if (err) {
                reject(err);
            } else if (!result) {
                reject("No results found")
            } else {
                resolve(result.rows[0]);
            }
        });
    });
}

const addUser = (username, email, password, salt) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO public."users" (name, password, salt, email) VALUES ($1, $2, $3, $4);`
        database.query(sql, [username, password, salt, email], (err, result) => {
            if (err) {
                reject(err);
            } else if (!result) {
                reject("No results found")
            } else {
                resolve(result.rowCount === 1); //Check if a user was added
            }
        });
    });
}

const changePassword = (email, password, salt) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE public."users" SET password = $1, salt = $2 WHERE email = $3;`
        database.query(sql, [password, salt, email], (err, result) => {
            if (err) {
                reject(err);
            } else if (!result) {
                reject("No results found")
            } else {
                resolve(result.rowCount === 1); //Check if the user was updated
            }
        });
    });
}

const changeUsername = (email, username) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE public."users" SET name = $1 WHERE email = $2;`
        database.query(sql, [username, email], (err, result) => {
            if (err) {
                reject(err);
            } else if (!result) {
                reject("No results found")
            } else {
                resolve(result.rowCount === 1); //Check if the user was updated
            }
        });
    });
}

module.exports = {
    getAllUsers,
    getUser,
    addUser,
    changePassword,
    changeUsername
}