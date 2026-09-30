const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { errorResponse } = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET || 'campusflow_super_secret_jwt_key_2026_operations_agent_production';

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication token missing or invalid format', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return errorResponse(res, 'Invalid or expired authentication token', 401, 'TOKEN_EXPIRED');
    }

    const user = await db.users.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 'User associated with token no longer exists', 401, 'USER_NOT_FOUND');
    }

    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, 'Authentication failure', 500, 'AUTH_ERROR');
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required before authorization', 401, 'UNAUTHORIZED');
    }

    const role = (req.user.role || '').toLowerCase();
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

    if (!normalizedAllowed.includes(role) && !normalizedAllowed.includes('*')) {
      return errorResponse(
        res,
        `Access denied. Role '${req.user.role}' lacks necessary permission for this action.`,
        403,
        'FORBIDDEN'
      );
    }

    next();
  };
}

module.exports = {
  authenticate,
  authorize,
};
