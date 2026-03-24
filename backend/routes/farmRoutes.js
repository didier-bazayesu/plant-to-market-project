const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farmController');

router.post('/', farmController.createFarm);
router.get('/', farmController.getFarms);

module.exports = router;
