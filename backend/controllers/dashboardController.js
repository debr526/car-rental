const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');

/**
 * GET /api/dashboard/summary
 * Admin only
 */
const getSummary = async (req, res, next) => {
  try {
    const [totalUsers, totalCars, availableCars, totalBookings, pendingBookings, bookingsByStatus] =
      await Promise.all([
        User.count(),
        Car.count(),
        Car.countAvailable(),
        Booking.count(),
        Booking.countPending(),
        Booking.countByStatus(),
      ]);

    // Format bookings by status into an object
    const statusMap = { pending: 0, approved: 0, rejected: 0, cancelled: 0 };
    bookingsByStatus.forEach(({ booking_status, count }) => {
      statusMap[booking_status] = parseInt(count);
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalCars,
          availableCars,
          unavailableCars: totalCars - availableCars,
          totalBookings,
          pendingBookings,
          bookingsByStatus: statusMap,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary };
