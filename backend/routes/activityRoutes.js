const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { createActivityValidation } = require('../validators/activityValidator');
const validate = require('../middlewares/validate');

router.post('/', createActivityValidation, validate, activityController.createActivity);
router.get('/', activityController.getActivities);

module.exports = router;