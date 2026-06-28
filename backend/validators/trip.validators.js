const { body } = require('express-validator');

const generateTripValidator = [
  body('city').trim().notEmpty().withMessage('City is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('budget').isIn(['budget','moderate','luxury']).withMessage('Budget must be budget, moderate, or luxury'),
  body('duration').isInt({ min: 1, max: 30 }).withMessage('Duration must be 1-30 days'),
  body('travelers').isInt({ min: 1, max: 20 }).withMessage('Travelers must be 1-20'),
];

module.exports = { generateTripValidator };
