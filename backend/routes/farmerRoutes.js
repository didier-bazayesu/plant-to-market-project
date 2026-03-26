const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const { createFarmerValidation } = require('../validators/farmerValidator');
const validate = require('../middlewares/validate');

// POST /farmers with centralized validation
router.post('/', createFarmerValidation, validate, farmerController.createFarmer);

// GET /farmers
router.get('/', farmerController.getFarmers);

module.exports = router;