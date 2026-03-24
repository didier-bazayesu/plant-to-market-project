const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');

router.post('/', farmerController.createFarmer);
router.get('/', farmerController.getFarmers);

module.exports = router;
