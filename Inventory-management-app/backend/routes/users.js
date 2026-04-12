const express = require('express');
const { addUser, getUsers, deleteUser, getProfile, updateUserProfile, updateUser, statusUpdate } = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

router.post("/add", addUser);
router.get("/",authMiddleware, getUsers);
router.delete("/delete/:id",authMiddleware, deleteUser);
router.put("/update/:id", updateUser);

router.patch('/status/:id', statusUpdate)

router.get("/profile",authMiddleware, getProfile);
// router.put("/profile",authMiddleware, updateUserProfile);



module.exports = router;