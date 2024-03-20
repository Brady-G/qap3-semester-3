const express = require("express");
require('dotenv').config()
const {checkAndRun} = require("./apiutils");
const {getProject, deleteProject, createProject, updateProject, getUserProjects} = require("../../services/projects.dal");
const {getUserById} = require("../../services/users.dal");
const router = express.Router();

router.use((req, res, next) => {
    checkAndRun(req, res, user => {
        req.user = user;
        next()
    })
})

router.delete("/:id", express.json(), (req, res) => {
    const id = Number.parseInt(req.params["id"]);
    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        getProject(id)
            .then(project => {
                if (project && project.user === req.user?.id) {
                    deleteProject(id)
                        .then(success => {
                            if (success) {
                                res.sendStatus(204)
                            } else {
                                res.sendStatus(500)
                            }
                        })
                        .catch(() => res.sendStatus(500))
                } else {
                    res.sendStatus(403)
                }
            })
            .catch(() => res.sendStatus(500))
    }
});

router.get("/", (req, res) => {
    getUserProjects(req.user?.id)
        .then(projects => res.status(200).json(projects))
        .catch(() => res.sendStatus(500))
})

router.post("/", express.json(), (req, res) => {
    const name = req.body.name;
    if (!name) {
        res.status(400).send("name is required.")
    } else {
        createProject(name, req.user?.id)
            .then(project => {
                if (project) {
                    res.sendStatus(201)
                } else {
                    console.log("error here")
                    res.sendStatus(500)
                }
            })
            .catch((err) => {
                console.log(err)
                res.sendStatus(500)
            })
    }
});

router.put("/", express.json(), (req, res) => {
    const name = req.body.name;
    const id = req.body.id;
    const user = req.body.user;
    if (!name || !id || !user) {
        res.status(400).send("name, user, and id are required.")
    } else {
        getProject(id)
            .then((project) => {
                if (project) {
                    if (project.user === req.user?.id) {
                        getUserById(user)
                            .then(userObj => {
                                if (userObj) {
                                    updateProject(id, user, name)
                                        .then(proj => {
                                            if (proj) {
                                                res.sendStatus(204)
                                            } else {
                                                res.sendStatus(500)
                                            }
                                        })
                                        .catch(() => res.sendStatus(500))
                                } else {
                                    res.sendStatus(400)
                                }
                            })
                            .catch(() => res.sendStatus(500))
                    } else {
                        res.sendStatus(403)
                    }
                } else {
                    res.sendStatus(400)
                }
            })
            .catch(() => res.sendStatus(500))
    }
});


module.exports = router;