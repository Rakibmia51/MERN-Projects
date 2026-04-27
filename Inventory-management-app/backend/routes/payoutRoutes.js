const express = require('express');
const { distributeMemberProfits } = require('../controllers/payoutController')

const router = express.Router();

router.post('/distribute', distributeMemberProfits);

module.exports = router;
