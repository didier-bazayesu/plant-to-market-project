// validators/farmValidator.js
const { body } = require('express-validator');

const createFarmValidation = [
  body('farmer_id')
    .isInt()
    .withMessage('farmer_id must be an integer'),
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
  body('soil_type')
    .optional()
    .isString()
    .withMessage('Soil type must be text')
];

module.exports = { createFarmValidation };
