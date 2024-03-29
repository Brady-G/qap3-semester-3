const database = require("./database");

// Return all projects from newest to oldest
const getProjects = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM public."projects" ORDER BY id DESC;`
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

// Return a specific project by id
const getProject = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM public."projects" WHERE id = $1;`
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

//Get all projects associated with a specific user
const getUserProjects = (user) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM public."projects" WHERE "user" = $1;`
        database.query(sql, [user], (err, result) => {
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

// Create a project and associate it with a user
const createProject = (name, user) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO public."projects" (name, "user") VALUES ($1, $2);`
        database.query(sql, [name, user], (err, result) => {
            if (err) {
                reject(err);
            } else if (!result) {
                reject("No results found")
            } else {
                resolve(result.rowCount === 1); //Check if a project was created
            }
        });
    });
}

// Update project to new user or name
const updateProject = (project, user, name) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE public."projects" SET "user" = $1, "name" = $2 WHERE id = $3;`
        database.query(sql, [user, name, project], (err, result) => {
            if (err) {
                reject(err);
            } else if (!result) {
                reject("No results found")
            } else {
                resolve(result.rowCount === 1); //Check if the project was transferred
            }
        });
    });
}

// Delete a specified project by its id
const deleteProject = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE public."projects" WHERE id = $1;`
        database.query(sql, [id], (err, result) => {
            if (err) {
                reject(err);
            } else if (!result) {
                reject("No results found")
            } else {
                resolve(result.rowCount === 1); //Check if the project was deleted
            }
        });
    });
}

module.exports = {
    getProjects,
    getUserProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
}