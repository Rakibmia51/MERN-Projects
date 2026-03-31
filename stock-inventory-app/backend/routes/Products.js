const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { getProducts,addProducts, updateProducts, deleteProducts } = require("../controllers/ProductsController");


const router = express.Router();

router.get("/", getProducts);
router.post("/add",authMiddleware, addProducts);
router.put("/update/:id",authMiddleware, updateProducts)
router.delete("/delete/:id",authMiddleware, deleteProducts)

module.exports = router;