const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const { createProject, getProjects, getProject, deleteProject, updateProject } = require('../controllers/projectsController');


const router = express.Router();

router.post("/create", createProject);
router.get("/", getProjects);
router.get("/:id", getProject);

router.delete("/delete/:id", deleteProject);
router.put("/update/:id", updateProject);







module.exports = router;