const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { addSupplier, getSupplier, updateSupplier, deleteSupplier } = require("../controllers/supllierController");


const router = express.Router();

router.post("/add",authMiddleware, addSupplier);
router.get("/",authMiddleware, getSupplier);
router.put("/update/:id",authMiddleware, updateSupplier)
router.delete("/delete/:id",authMiddleware, deleteSupplier)

module.exports = router;