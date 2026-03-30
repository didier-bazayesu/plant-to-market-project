const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { createActivityValidation } = require('../validators/activityValidator');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');

// GET /api/activities
router.get('/', protect, activityController.getActivities);

// GET /api/activities/:id
router.get('/:id', protect, activityController.getActivity);

// POST /api/activities
router.post('/', protect, createActivityValidation, validate, activityController.createActivity);

// PUT /api/activities/:id
router.put('/:id', protect, activityController.updateActivity);

// DELETE /api/activities/:id
router.delete('/:id', protect, activityController.deleteActivity);

module.exports = router;