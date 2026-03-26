// routes/marketPriceRoutes.js
const express = require('express');
const router = express.Router();
const marketPriceController = require('../controllers/marketPriceController');
const { createMarketPriceValidation } = require('../validators/marketPriceValidator');
const validate = require('../middlewares/validate');

// Change these to match your controller exports:
router.post('/', createMarketPriceValidation, validate, marketPriceController.createPrice);
router.get('/', marketPriceController.getPrices);

module.exports = router;