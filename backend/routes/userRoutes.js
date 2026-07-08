const express = require('express');
const { body } = require('express-validator');
const { getAllUsers, updateUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// GET /api/users  - Admin only
router.get('/', authenticate, authorize('admin'), getAllUsers);

// PUT /api/users/:id  - Admin or own customer
router.put(
  '/:id',
  authenticate,
  [
    body('full_name').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('role').optional().isIn(['customer', 'admin']).withMessage('Invalid role'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  updateUser
);

module.exports = router;
