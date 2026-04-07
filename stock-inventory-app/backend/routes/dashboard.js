const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { getData } = require("../controllers/dashborad");


const router = express.Router();

// router.post("/add",authMiddleware, addCategory);
router.get("/",authMiddleware, getData);
// router.put("/update/:id",authMiddleware, updateCategory)
// router.delete("/delete/:id",authMiddleware, deleteCategory)

module.exports = router;