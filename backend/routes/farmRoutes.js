const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farmController');
const { createFarmValidation } = require('../validators/farmValidator');
const validate = require('../middlewares/validate');

// POST /farms with centralized validation
router.post('/', createFarmValidation, validate, farmController.createFarm);

// GET /farms (no validation needed)
router.get('/', farmController.getFarms);

module.exports = router;
