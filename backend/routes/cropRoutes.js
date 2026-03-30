const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');
const { createCropValidation } = require('../validators/cropValidator');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');

// GET /api/crops
router.get('/', protect, cropController.getCrops);

// GET /api/crops/:id
router.get('/:id', protect, cropController.getCrop);

// POST /api/crops
router.post('/', protect, createCropValidation, validate, cropController.createCrop);

// PUT /api/crops/:id
router.put('/:id', protect, cropController.updateCrop);

// DELETE /api/crops/:id
router.delete('/:id', protect, cropController.deleteCrop);

module.exports = router;