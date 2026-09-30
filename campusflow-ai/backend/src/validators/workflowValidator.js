const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400, 'VALIDATION_ERROR', errors.array());
  }
  next();
}

const generateWorkflowValidationRules = [
  body('prompt').trim().notEmpty().withMessage('Prompt describing your automation is required'),
  validate,
];

module.exports = {
  generateWorkflowValidationRules,
};
