const { body } = require('express-validator');

const createFarmValidation = [
  // ✅ Remove farmer_id — comes from JWT token now
  body('name')
    .isString()
    .notEmpty()
    .withMessage('Farm name is required'),
  body('size')
    .isFloat({ min: 0 })
    .withMessage('Size must be a positive number'),
  body('location')
    .isString()
    .notEmpty()
    .withMessage('Location is required'),
  body('soilType')       // ✅ camelCase to match model
    .optional()
    .isString()
    .withMessage('Soil type must be text'),
  body('irrigation')
    .optional()
    .isString()
    .withMessage('Irrigation must be text'),
];

module.exports = { createFarmValidation };