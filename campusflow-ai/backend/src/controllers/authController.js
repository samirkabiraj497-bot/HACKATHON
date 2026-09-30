const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { successResponse, errorResponse } = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET || 'campusflow_super_secret_jwt_key_2026_operations_agent_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.full_name,
      department_id: user.department_id
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

async function register(req, res, next) {
  try {
    const { email, password, fullName, role = 'student', departmentId, phone } = req.body;

    if (!email || !password || !fullName) {
      return errorResponse(res, 'Email, password, and full name are required', 400, 'VALIDATION_ERROR');
    }

    const existing = await db.users.findOne({ email: email.toLowerCase() });
    if (existing) {
      return errorResponse(res, 'An account with this email already exists', 409, 'USER_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await db.users.create({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      full_name: fullName,
      role,
      department_id: departmentId || null,
      phone: phone || null,
      status: 'active'
    });

    const token = generateToken(newUser);

    const safeUser = { ...newUser };
    delete safeUser.password_hash;

    return successResponse(res, { user: safeUser, token }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400, 'VALIDATION_ERROR');
    }

    const user = await db.users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return errorResponse(res, 'Invalid email or password credentials', 401, 'INVALID_CREDENTIALS');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return errorResponse(res, 'Invalid email or password credentials', 401, 'INVALID_CREDENTIALS');
    }

    const token = generateToken(user);
    const safeUser = { ...user };
    delete safeUser.password_hash;

    return successResponse(res, { user: safeUser, token }, 'Authentication successful');
  } catch (err) {
    next(err);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const safeUser = { ...req.user };
    delete safeUser.password_hash;
    return successResponse(res, { user: safeUser }, 'User profile retrieved');
  } catch (err) {
    next(err);
  }
}

/**
 * Demo Fast Role-Switcher for Judges & Hackathon Evaluators
 */
async function switchDemoRole(req, res, next) {
  try {
    const { role = 'admin' } = req.body;
    const users = await db.users.find();
    let targetUser = users.find(u => (u.role || '').toLowerCase() === role.toLowerCase());

    if (!targetUser) {
      targetUser = users[0];
    }

    const token = generateToken(targetUser);
    const safeUser = { ...targetUser };
    delete safeUser.password_hash;

    return successResponse(res, { user: safeUser, token }, `Switched to role: ${targetUser.role}`);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
  switchDemoRole
};
