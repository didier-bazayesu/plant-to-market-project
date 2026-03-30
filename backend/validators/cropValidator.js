const { body } = require('express-validator');

const createCropValidation = [
  body('farmId')           // ✅ camelCase to match model
    .isInt()
    .withMessage('farmId must be an integer'),
  body('cropType')         // ✅ camelCase to match model
    .isString()
    .notEmpty()
    .withMessage('cropType is required'),
  body('plantingDate')     // ✅ camelCase to match model
    .isISO8601()
    .withMessage('plantingDate must be a valid date (e.g., 2026-03-24)'),
  body('status')
    .optional()
    .isIn(['planted', 'growing', 'harvested'])
    .withMessage('status must be one of planted, growing, harvested'),
  body('variety')
    .optional()
    .isString(),
  body('harvestDate')
    .optional()
    .isISO8601()
    .withMessage('harvestDate must be a valid date'),
];

module.exports = { createCropValidation };