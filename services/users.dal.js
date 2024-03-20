const database = require("./database");

// Get all users from oldest to newest with just their ids, name, and emails
const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, name, email FROM public."users" ORDER BY id ASC;`
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

// Get a specific user by their id
const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM public."users" WHERE id = $1;`
        database.query(sql, [id], (err, result) => {
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

// Get a specified user by their email
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

// Add a new user
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

// Change the password of a user using their email
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

// Change the username of a user using their email
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
    getUserById,
    addUser,
    changePassword,
    changeUsername
}