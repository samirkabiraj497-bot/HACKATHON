const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400, 'VALIDATION_ERROR', errors.array());
  }
  next();
}

const createRequestValidationRules = [
  body('title').trim().notEmpty().withMessage('Request title or summary is required'),
  body('description').trim().notEmpty().withMessage('Description text is required for AI triage'),
  validate,
];

const commentValidationRules = [
  body('comment').trim().notEmpty().withMessage('Comment message cannot be empty'),
  validate,
];

module.exports = {
  createRequestValidationRules,
  commentValidationRules,
};
