const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const { createFarmerValidation } = require('../validators/farmerValidator');
const validate = require('../middlewares/validate');
const { protect, adminOnly } = require('../middlewares/auth');

// GET /api/farmers — admin only
router.get('/', protect, adminOnly, farmerController.getFarmers);

// GET /api/farmers/:id
router.get('/:id', protect, farmerController.getFarmer);

// POST /api/farmers
router.post('/', protect, createFarmerValidation, validate, farmerController.createFarmer);

// PUT /api/farmers/:id
router.put('/:id', protect, farmerController.updateFarmer);

// DELETE /api/farmers/:id — admin only
router.delete('/:id', protect, adminOnly, farmerController.deleteFarmer);

module.exports = router;