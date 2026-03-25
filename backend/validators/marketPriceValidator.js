// validators/marketPriceValidator.js
const { body } = require('express-validator');

const createMarketPriceValidation = [
  body('crop_type')
    .isString()
    .notEmpty()
    .withMessage('Crop type is required'),
    
  body('market_name') // Changed from 'location'
    .isString()
    .notEmpty()
    .withMessage('Market name is required'),
    
  body('price') // Changed from 'price_per_kg'
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
    
  body('date')
    .isISO8601()
    .withMessage('Valid date is required')
];

module.exports = { createMarketPriceValidation };