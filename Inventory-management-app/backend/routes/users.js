const express = require('express');
const { addUser, getUsers, deleteUser, getProfile, updateUserProfile, updateUser, statusUpdate, memberSearch } = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

router.post("/add", addUser);
router.get("/", getUsers);
router.delete("/delete/:id",authMiddleware, deleteUser);
router.put("/update/:id", updateUser);

router.patch('/status/:id', statusUpdate)

router.get("/profile",authMiddleware, getProfile);
// router.put("/profile",authMiddleware, updateUserProfile);
// নতুন রাউট
router.get("/member-search/:code", memberSearch);



module.exports = router;