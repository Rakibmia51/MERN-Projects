const express = require('express');
const { addUser, getUsers, deleteUser, getProfile, updateUserProfile, updateUser } = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

router.post("/add",authMiddleware, addUser);
router.get("/",authMiddleware, getUsers);
router.delete("/delete/:id",authMiddleware, deleteUser);
router.put("/update/:id", updateUser);


router.get("/profile",authMiddleware, getProfile);
// router.put("/profile",authMiddleware, updateUserProfile);



module.exports = router;