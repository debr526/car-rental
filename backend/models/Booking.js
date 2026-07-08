const pool = require('../config/database');

class Booking {
  /**
   * Create a booking
   */
  static async create({ user_id, car_id, start_date, end_date, total_price }) {
    const result = await pool.query(
      `INSERT INTO bookings (user_id, car_id, start_date, end_date, total_price, booking_status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [user_id, car_id, start_date, end_date, total_price]
    );
    return result.rows[0];
  }

  /**
   * Get bookings by user ID (with car + category info)
   */
  static async getByUserId(userId) {
    const result = await pool.query(
      `SELECT b.*,
              c.brand, c.model, c.year, c.image_url, c.daily_price,
              cat.name AS category_name,
              u.full_name AS customer_name, u.email AS customer_email
       FROM bookings b
       JOIN cars c ON b.car_id = c.id
       LEFT JOIN categories cat ON c.category_id = cat.id
       JOIN users u ON b.user_id = u.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  /**
   * Get all bookings (admin)
   */
  static async getAll() {
    const result = await pool.query(
      `SELECT b.*,
              c.brand, c.model, c.year, c.image_url, c.daily_price,
              cat.name AS category_name,
              u.full_name AS customer_name, u.email AS customer_email
       FROM bookings b
       JOIN cars c ON b.car_id = c.id
       LEFT JOIN categories cat ON c.category_id = cat.id
       JOIN users u ON b.user_id = u.id
       ORDER BY b.created_at DESC`
    );
    return result.rows;
  }

  /**
   * Get booking by ID
   */
  static async getById(id) {
    const result = await pool.query(
      `SELECT b.*,
              c.brand, c.model, c.year, c.image_url, c.daily_price,
              u.full_name AS customer_name, u.email AS customer_email
       FROM bookings b
       JOIN cars c ON b.car_id = c.id
       JOIN users u ON b.user_id = u.id
       WHERE b.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Update booking status
   */
  static async updateStatus(id, booking_status) {
    const result = await pool.query(
      `UPDATE bookings SET booking_status = $1 WHERE id = $2 RETURNING *`,
      [booking_status, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Delete booking
   */
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM bookings WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Count total bookings
   */
  static async count() {
    const result = await pool.query('SELECT COUNT(*) FROM bookings');
    return parseInt(result.rows[0].count);
  }

  /**
   * Count pending bookings
   */
  static async countPending() {
    const result = await pool.query(
      "SELECT COUNT(*) FROM bookings WHERE booking_status = 'pending'"
    );
    return parseInt(result.rows[0].count);
  }

  /**
   * Count bookings by status
   */
  static async countByStatus() {
    const result = await pool.query(
      `SELECT booking_status, COUNT(*) as count
       FROM bookings
       GROUP BY booking_status`
    );
    return result.rows;
  }

  /**
   * Check for overlapping bookings (car availability check)
   */
  static async hasOverlap(car_id, start_date, end_date, exclude_booking_id = null) {
    let query = `
      SELECT COUNT(*) FROM bookings
      WHERE car_id = $1
        AND booking_status IN ('pending', 'approved')
        AND NOT (end_date <= $2 OR start_date >= $3)
    `;
    const params = [car_id, start_date, end_date];

    if (exclude_booking_id) {
      query += ` AND id != $4`;
      params.push(exclude_booking_id);
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count) > 0;
  }
}

module.exports = Booking;
