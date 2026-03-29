const express = require("express");
const { addCategory, getCategories, updateCategory, deleteCategory } = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/add",authMiddleware, addCategory);
router.get("/", getCategories);
router.put("/update/:id", updateCategory)
router.delete("/delete/:id", deleteCategory)

module.exports = router;