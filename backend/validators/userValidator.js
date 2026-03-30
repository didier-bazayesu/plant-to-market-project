const { body } = require('express-validator');

const registerUserValidation = [
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

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(['farmer', 'admin'])
    .withMessage('Role must be either farmer or admin')
];

const loginUserValidation = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

module.exports = { registerUserValidation, loginUserValidation };
