const { validationResult } = require('express-validator');
const Category = require('../models/Category');

/**
 * GET /api/categories
 * Public
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.getAll();
    res.json({ success: true, count: categories.length, data: { categories } });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/categories
 * Admin only
 */
const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name } = req.body;
    const category = await Category.create({ name });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: { category },
    });
  } catch (error) {
    if (error.code === '23505') { // unique constraint
      return res.status(409).json({ success: false, message: 'Category already exists.' });
    }
    next(error);
  }
};

/**
 * PUT /api/categories/:id
 * Admin only
 */
const updateCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const category = await Category.update(req.params.id, req.body);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.json({
      success: true,
      message: 'Category updated successfully.',
      data: { category },
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Category name already in use.' });
    }
    next(error);
  }
};

/**
 * DELETE /api/categories/:id
 * Admin only
 */
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.delete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully.',
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
