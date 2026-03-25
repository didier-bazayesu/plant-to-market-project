const { body } = require('express-validator');

const createHarvestValidation = [
  body('crop_id').isInt().withMessage('crop_id must be an integer'),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('quality').isString().notEmpty().withMessage('Quality is required'),
  body('revenue').isFloat({ min: 0 }).withMessage('Revenue must be a positive number'),
  body('date').isISO8601().withMessage('A valid harvest date is required')
];

module.exports = { createHarvestValidation };