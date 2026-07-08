const express = require('express');
const { body } = require('express-validator');
const {
  getCars, getCarById, createCar, updateCar, deleteCar, updateAvailability,
} = require('../controllers/carController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

const carValidation = [
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: 2100 }).withMessage('Valid year is required'),
  body('daily_price').isFloat({ min: 0.01 }).withMessage('Valid daily price is required'),
];

// GET /api/cars  - Public
router.get('/', getCars);

// GET /api/cars/:id  - Public
router.get('/:id', getCarById);

// POST /api/cars  - Admin only
router.post('/', authenticate, authorize('admin'), carValidation, createCar);

// PUT /api/cars/:id  - Admin only
router.put('/:id', authenticate, authorize('admin'), updateCar);

// DELETE /api/cars/:id  - Admin only
router.delete('/:id', authenticate, authorize('admin'), deleteCar);

// PATCH /api/cars/:id/availability  - Admin only
router.patch('/:id/availability', authenticate, authorize('admin'), updateAvailability);

module.exports = router;
