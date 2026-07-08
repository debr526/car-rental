const { validationResult } = require('express-validator');
const User = require('../models/User');

/**
 * GET /api/users
 * Admin only
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.getAll();
    res.json({ success: true, count: users.length, data: { users } });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id
 * Admin: update role
 * Customer: update own profile
 */
const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const targetId = parseInt(req.params.id);
    const { role, full_name, email, password } = req.body;

    // Customers can only update their own profile
    if (req.user.role === 'customer' && req.user.id !== targetId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    let user;

    // Admin updating role
    if (req.user.role === 'admin' && role) {
      const validRoles = ['customer', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role.' });
      }
      user = await User.updateRole(targetId, role);
    } else {
      // Profile update (name/email)
      if (full_name || email) {
        const existing = await User.findById(targetId);
        if (!existing) {
          return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Check email uniqueness if changing
        if (email && email !== existing.email) {
          const emailTaken = await User.findByEmail(email);
          if (emailTaken) {
            return res.status(409).json({ success: false, message: 'Email is already in use.' });
          }
        }

        user = await User.updateProfile(targetId, {
          full_name: full_name || existing.full_name,
          email: email || existing.email,
        });
      }

      // Password update
      if (password) {
        user = await User.updatePassword(targetId, password);
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      message: 'User updated successfully.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, updateUser };
