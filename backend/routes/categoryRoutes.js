const express = require('express');
const { body } = require('express-validator');
const {
  getCategories, createCategory, updateCategory, deleteCategory,
} = require('../controllers/categoryController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
];

// GET /api/categories  - Public
router.get('/', getCategories);

// POST /api/categories  - Admin only
router.post('/', authenticate, authorize('admin'), categoryValidation, createCategory);

// PUT /api/categories/:id  - Admin only
router.put('/:id', authenticate, authorize('admin'), categoryValidation, updateCategory);

// DELETE /api/categories/:id  - Admin only
router.delete('/:id', authenticate, authorize('admin'), deleteCategory);

module.exports = router;
