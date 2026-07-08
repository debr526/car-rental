const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { calculateTotalPrice } = require('../utils/helpers');

/**
 * POST /api/bookings
 * Customer - create a new booking
 */
const createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { car_id, start_date, end_date } = req.body;
    const user_id = req.user.id;

    // Verify car exists and is available
    const car = await Car.getById(car_id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }
    if (!car.availability_status) {
      return res.status(400).json({ success: false, message: 'This car is not available for booking.' });
    }

    // Check date validity
    const start = new Date(start_date);
    const end = new Date(end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({ success: false, message: 'Start date cannot be in the past.' });
    }
    if (end <= start) {
      return res.status(400).json({ success: false, message: 'End date must be after start date.' });
    }

    // Check for overlapping bookings
    const overlap = await Booking.hasOverlap(car_id, start_date, end_date);
    if (overlap) {
      return res.status(409).json({
        success: false,
        message: 'This car is already booked for the selected dates.',
      });
    }

    // Calculate total price
    const total_price = calculateTotalPrice(car.daily_price, start_date, end_date);

    const booking = await Booking.create({ user_id, car_id, start_date, end_date, total_price });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully. Awaiting admin approval.',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bookings/my-bookings
 * Customer - view own bookings
 */
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.getByUserId(req.user.id);
    res.json({ success: true, count: bookings.length, data: { bookings } });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bookings
 * Admin - view all bookings
 */
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.getAll();
    res.json({ success: true, count: bookings.length, data: { bookings } });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/bookings/:id/status
 * Admin - update booking status
 */
const updateBookingStatus = async (req, res, next) => {
  try {
    const { booking_status } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected', 'cancelled'];

    if (!validStatuses.includes(booking_status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const booking = await Booking.updateStatus(req.params.id, booking_status);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    res.json({
      success: true,
      message: `Booking ${booking_status} successfully.`,
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/bookings/:id
 * Customer can cancel own pending booking; Admin can delete any
 */
const deleteBooking = async (req, res, next) => {
  try {
    const existing = await Booking.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Customer can only cancel their own pending bookings
    if (req.user.role === 'customer') {
      if (existing.user_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }
      if (existing.booking_status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Only pending bookings can be cancelled.',
        });
      }
      // Mark as cancelled instead of deleting
      const cancelled = await Booking.updateStatus(req.params.id, 'cancelled');
      return res.json({
        success: true,
        message: 'Booking cancelled successfully.',
        data: { booking: cancelled },
      });
    }

    // Admin can delete any booking
    const booking = await Booking.delete(req.params.id);
    res.json({
      success: true,
      message: 'Booking deleted successfully.',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus, deleteBooking };
