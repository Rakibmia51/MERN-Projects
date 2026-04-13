const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const { createProject, getProjects, getProject, deleteProject, updateProject } = require('../controllers/projectsController');


const router = express.Router();

router.post("/create",authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProject);

router.delete("/delete/:id", authMiddleware, deleteProject);
router.put("/update/:id",authMiddleware, updateProject);







module.exports = router;