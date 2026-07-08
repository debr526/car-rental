const express = require('express');
const { body } = require('express-validator');
const {
  createBooking, getMyBookings, getAllBookings, updateBookingStatus, deleteBooking,
} = require('../controllers/bookingController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// POST /api/bookings  - Customer only
router.post(
  '/',
  authenticate,
  authorize('customer', 'admin'),
  [
    body('car_id').isInt({ min: 1 }).withMessage('Valid car ID is required'),
    body('start_date').isDate().withMessage('Valid start date is required'),
    body('end_date').isDate().withMessage('Valid end date is required'),
  ],
  createBooking
);

// GET /api/bookings/my-bookings  - Authenticated customer
router.get('/my-bookings', authenticate, authorize('customer', 'admin'), getMyBookings);

// GET /api/bookings  - Admin only
router.get('/', authenticate, authorize('admin'), getAllBookings);

// PUT /api/bookings/:id/status  - Admin only
router.put('/:id/status', authenticate, authorize('admin'), updateBookingStatus);

// DELETE /api/bookings/:id  - Customer (own/pending) or Admin
router.delete('/:id', authenticate, deleteBooking);

module.exports = router;
