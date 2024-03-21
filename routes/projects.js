const express = require("express");
const {getProjects, getProject} = require("../services/projects.dal");
const {getUserById} = require("../services/users.dal");
const router = express.Router();

router.get(`/`, (req, res) => {
    getProjects()
        .then(projects => {
            res.render(`projects.ejs`, {projects})
        })
        .catch(() => {
            res.render("error.ejs", {
                error: "Internal Server Error"
            })
        })
});

router.get(`/:id`, (req, res) => {
    const id = Number.parseInt(req.params["id"]);
    if (isNaN(id)) {
        res.render("error.ejs", {
            error: "Invalid Project Id"
        })
    } else {
        getProject(id)
            .then(async project => {
                const user = await getUserById(project.user);

                res.render(`project.ejs`, {project, user: user.name})
            })
            .catch(() => {
                res.render("error.ejs", {
                    error: "Internal Server Error"
                })
            })
    }
});

router.get(`/:id/edit`, (req, res) => {
    const id = Number.parseInt(req.params["id"]);
    if (isNaN(id)) {
        res.render("error.ejs", {
            error: "Invalid Project Id"
        })
    } else {
        getProject(id)
            .then(async project => {
                const user = await getUserById(project.user);

                res.render(`edit_project.ejs`, {project, user: user.name})
            })
            .catch(() => {
                res.render("error.ejs", {
                    error: "Internal Server Error"
                })
            })
    }
});

module.exports = router