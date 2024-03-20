const express = require("express");
require('dotenv').config()
const {checkAndRun} = require("./apiutils");
const {getProject, deleteProject, createProject, updateProject, getUserProjects} = require("../../services/projects.dal");
const {getUserById} = require("../../services/users.dal");
const router = express.Router();

// Add a middleware requiring all project endpoints to be called with a valid user
router.use((req, res, next) => {
    checkAndRun(req, res, user => {
        req.user = user;
        next()
    })
})

router.delete("/:id", express.json(), (req, res) => {
    const id = Number.parseInt(req.params["id"]);
    // Convert id parameter to a number to be used in the DAL, if id is not a number return status 400
    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        // Get project for id
        getProject(id)
            .then(project => {
                // If project exists and project owner is the current user proceed, if not return 403
                if (project && project.user === req.user?.id) {
                    // Delete project if owner
                    deleteProject(id)
                        .then(success => {
                            // If successful return no content if not 500 because invalid project was deleted
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

// Gets all user projects for current authorized user
router.get("/", (req, res) => {
    getUserProjects(req.user?.id)
        .then(projects => res.status(200).json(projects))
        .catch(() => res.sendStatus(500))
})

router.post("/", express.json(), (req, res) => {
    const name = req.body.name;

    // Require name for create project
    if (!name) {
        res.status(400).send("name is required.")
    } else {
        // call createProject DAL
        createProject(name, req.user.id)
            .then(project => {
                // If project was created return 201 else 500 because that means an error with insertion and
                // precautions didnt handle them before accessing postgres
                if (project) {
                    res.sendStatus(201)
                } else {
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

    // Require name, id, user for a project change
    if (!name || !id || !user) {
        res.status(400).send("name, user, and id are required.")
    } else {
        // Get project from DAL
        getProject(id)
            .then((project) => {
                // If project exists check if the project is owned by the current user
                // else return status appropriately
                if (project) {
                    if (project.user === req.user?.id) {
                        // Get the user that it is being transferred to check if they are real
                        // else return 400 or 500 if an error occurred
                        getUserById(user)
                            .then(userObj => {
                                if (userObj) {
                                    // Update the project with the new information
                                    updateProject(id, user, name)
                                        .then(success => {
                                            // If successful return status 204 else 500 meaning our
                                            // checks failed
                                            if (success) {
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