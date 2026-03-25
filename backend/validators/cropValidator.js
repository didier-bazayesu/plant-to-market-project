// validators/cropValidator.js
const { body } = require('express-validator');

const createCropValidation = [
  body('farm_id').isInt().withMessage('farm_id must be an integer'),
  body('crop_type').isString().notEmpty().withMessage('crop_type is required'),
  body('planting_date')
  .isISO8601() 
  .withMessage('planting_date must be a valid date (e.g., 2026-03-24)'),
  body('status')
    .optional()
    .isIn(['planted', 'growing', 'harvested'])
    .withMessage('status must be one of planted, growing, harvested')
];

module.exports = { createCropValidation };
