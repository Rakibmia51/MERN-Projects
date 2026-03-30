const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { getProducts,addProducts } = require("../controllers/ProductsController");


const router = express.Router();

router.get("/",authMiddleware, getProducts);
router.post("/add",authMiddleware, addProducts);

// router.put("/update/:id",authMiddleware, updateSupplier)
// router.delete("/delete/:id",authMiddleware, deleteSupplier)

module.exports = router;