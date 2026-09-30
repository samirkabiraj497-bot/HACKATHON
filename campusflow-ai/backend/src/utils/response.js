/**
 * Standardized API response utilities for CampusFlow AI
 */
function successResponse(res, data = null, message = 'Success', statusCode = 200, meta = null) {
  const payload = {
    success: true,
    message,
    data,
  };
  if (meta) {
    payload.meta = meta;
  }
  return res.status(statusCode).json(payload);
}

function errorResponse(res, message = 'An error occurred', statusCode = 500, errorCode = 'INTERNAL_ERROR', details = null) {
  const payload = {
    success: false,
    message,
    errorCode,
  };
  if (details) {
    payload.details = details;
  }
  return res.status(statusCode).json(payload);
}

module.exports = {
  successResponse,
  errorResponse,
};
