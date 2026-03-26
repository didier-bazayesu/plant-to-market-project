const express = require('express');
const router = express.Router();
const harvestController = require('../controllers/harvestController');
const { createHarvestValidation } = require('../validators/harvestValidator');
const validate = require('../middlewares/validate');

router.post('/', createHarvestValidation, validate, harvestController.createHarvest);
router.get('/', harvestController.getHarvests);

module.exports = router;