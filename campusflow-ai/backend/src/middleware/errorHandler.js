const { errorResponse } = require('../utils/response');

function errorHandler(err, req, res, next) {
  console.error('Unhandled Application Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Unable to process request';
  const errorCode = err.errorCode || 'REQUEST_PROCESSING_ERROR';

  return errorResponse(res, message, statusCode, errorCode);
}

module.exports = errorHandler;
