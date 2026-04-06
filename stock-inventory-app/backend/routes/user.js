const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { addUser, getUsers, deleteUser, getProfile, updateUserProfile } = require("../controllers/userController");


const router = express.Router();

router.post("/add",authMiddleware, addUser);
router.get("/",authMiddleware, getUsers);
router.delete("/delete/:id",authMiddleware, deleteUser)

router.get("/profile",authMiddleware, getProfile);
router.put("/profile",authMiddleware, updateUserProfile);

module.exports = router;