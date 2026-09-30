const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400, 'VALIDATION_ERROR', errors.array());
  }
  next();
}

const registerValidationRules = [
  body('email').isEmail().withMessage('Please provide a valid institutional email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  validate,
];

const loginValidationRules = [
  body('email').isEmail().withMessage('Please provide a valid institutional email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

module.exports = {
  registerValidationRules,
  loginValidationRules,
};
