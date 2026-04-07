const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farmController');
const { createFarmValidation } = require('../validators/farmValidator');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');

// GET /api/farms
router.get('/', protect, farmController.getFarms);

// GET /api/farms/:id
router.get('/:id', protect, farmController.getFarm);

// POST /api/farms
router.post('/', protect, createFarmValidation, validate, farmController.createFarm);

// PUT /api/farms/:id
router.put('/:id', protect, farmController.updateFarm);

// DELETE /api/farms/:id
router.delete('/:id', protect, farmController.deleteFarm);

//get user by id 
router.get('/user/:userId', protect, farmController.getFarmsByUser);


module.exports = router;