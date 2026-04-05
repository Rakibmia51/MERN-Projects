const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { addOrder, getOrders } = require("../controllers/orderController");


const router = express.Router();

router.post("/add",authMiddleware, addOrder);
router.get("/", getOrders);
// router.put("/update/:id",authMiddleware, updateCategory)
// router.delete("/delete/:id",authMiddleware, deleteCategory)

module.exports = router;