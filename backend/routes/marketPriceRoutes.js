const express = require('express');
const router = express.Router();
const marketPriceController = require('../controllers/marketPriceController');

router.post('/', marketPriceController.createPrice);
router.get('/', marketPriceController.getPrices);

module.exports = router;
