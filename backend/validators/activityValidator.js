const { body } = require('express-validator');

const createActivityValidation = [
  body('crop_id').isInt().withMessage('crop_id must be a number'),
  body('type')
    .isIn(['irrigation', 'fertilization', 'pesticide'])
    .withMessage('Type must be irrigation, fertilization, or pesticide'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('notes').optional().isString().withMessage('Notes must be text')
];

module.exports = { createActivityValidation };