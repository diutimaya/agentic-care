const User = require('../models/User');
const Role = require('../models/Role');
const { generateToken } = require('../utils/jwt.utils');
const { logAction } = require('../middleware/logger.middleware');

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { full_name, email, password, phone_number, role_name } = req.body;

    // Check duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Default role is 'patient' if none provided
    const roleName = role_name || 'patient';
    const role = await Role.findOne({ role_name: roleName });
    if (!role) {
      return res.status(400).json({ message: `Role '${roleName}' not found` });
    }

    const user = await User.create({
      full_name,
      email,
      password_hash: password, // pre-save hook hashes it
      phone_number: phone_number || '',
      role_id: role._id,
    });

    const token = generateToken({ id: user._id, role: role.role_name });

    await logAction(user._id, 'register', 'User', 'success', { email });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: role.role_name,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('role_id', 'role_name');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.isLocked()) {
      await logAction(user._id, 'login_failed', 'User', 'failure', {
        reason: 'account locked',
      });
      const remaining = Math.ceil((user.locked_until - Date.now()) / 60000);
      return res.status(403).json({
        message: `Account locked. Try again in ${remaining} minute(s)`,
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      user.failed_login_attempts += 1;

      if (user.failed_login_attempts >= MAX_FAILED_ATTEMPTS) {
        user.account_status = 'locked';
        user.locked_until = new Date(Date.now() + LOCK_DURATION_MS);
        await user.save();
        await logAction(user._id, 'account_locked', 'User', 'failure', { email });
        return res.status(403).json({
          message: 'Account locked after too many failed attempts. Try again in 30 minutes',
        });
      }

      await user.save();
      await logAction(user._id, 'login_failed', 'User', 'failure', {
        attempts: user.failed_login_attempts,
      });
      return res.status(401).json({
        message: `Invalid credentials. ${MAX_FAILED_ATTEMPTS - user.failed_login_attempts} attempt(s) remaining`,
      });
    }

    // Successful login — reset failed attempts
    user.failed_login_attempts = 0;
    user.account_status = 'active';
    user.locked_until = null;
    await user.save();

    const token = generateToken({
      id: user._id,
      role: user.role_id.role_name,
    });

    await logAction(user._id, 'login', 'User', 'success', { email });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role_id.role_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      full_name: req.user.full_name,
      email: req.user.email,
      role: req.user.role_id.role_name,
      phone_number: req.user.phone_number,
      account_status: req.user.account_status,
    },
  });
};

// POST /api/auth/logout
const logout = async (req, res) => {
  await logAction(req.user._id, 'logout', 'User', 'success');
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { register, login, getMe, logout };