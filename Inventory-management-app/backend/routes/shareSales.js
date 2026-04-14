const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const { createShareSale, getAllShareSales} = require('../controllers/shareSaleController');


const router = express.Router();

router.post("/create", createShareSale);
router.get("/", getAllShareSales);


// router.get('/latest-price/:projectId', getLatestPriceByProject)

// router.delete("/delete/:id", deleteShareSales);
// router.put("/update/:id", updateShareSales);







module.exports = router;