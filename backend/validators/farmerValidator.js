const { body } = require('express-validator');

const createFarmerValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Phone must be valid'),
  body('password_hash')
    .notEmpty()
    .withMessage('Password is required')
];

module.exports = { createFarmerValidation };