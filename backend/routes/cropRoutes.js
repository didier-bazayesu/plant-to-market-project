const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');
const { createCropValidation } = require('../validators/cropValidator');
const validate = require('../middlewares/validate');

// POST /crops
router.post('/', createCropValidation, validate, cropController.createCrop);

// GET /crops
router.get('/', cropController.getCrops);

module.exports = router;
