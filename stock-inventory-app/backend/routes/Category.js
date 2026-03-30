const express = require("express");
const { addCategory, getCategories, updateCategory, deleteCategory } = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/add",authMiddleware, addCategory);
router.get("/",authMiddleware, getCategories);
router.put("/update/:id",authMiddleware, updateCategory)
router.delete("/delete/:id",authMiddleware, deleteCategory)

module.exports = router;