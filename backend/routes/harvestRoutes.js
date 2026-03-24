const express = require('express');
const router = express.Router();
const harvestController = require('../controllers/harvestController');

router.post('/', harvestController.createHarvest);
router.get('/', harvestController.getHarvests);

module.exports = router;
