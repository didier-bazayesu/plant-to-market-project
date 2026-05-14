const express = require('express');
const router = express.Router();
const harvestController = require('../controllers/harvestController');
const { createHarvestValidation } = require('../validators/harvestValidator');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');  // ← add this

router.post('/', protect, createHarvestValidation, validate, harvestController.createHarvest);
router.get('/', protect, harvestController.getHarvests);

module.exports = router;