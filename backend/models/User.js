const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

class User {
  /**
   * Find a user by email
   */
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  /**
   * Find a user by ID
   */
  static async findById(id) {
    const result = await pool.query(
      'SELECT id, full_name, email, role, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Create a new user
   */
  static async create({ full_name, email, password, role = 'customer' }) {
    const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, role, created_at`,
      [full_name, email, hashedPassword, role]
    );
    return result.rows[0];
  }

  /**
   * Get all users (admin only)
   */
  static async getAll() {
    const result = await pool.query(
      `SELECT id, full_name, email, role, created_at
       FROM users
       ORDER BY created_at DESC`
    );
    return result.rows;
  }

  /**
   * Update user role
   */
  static async updateRole(id, role) {
    const result = await pool.query(
      `UPDATE users SET role = $1 WHERE id = $2
       RETURNING id, full_name, email, role, created_at`,
      [role, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Update user profile (name/email)
   */
  static async updateProfile(id, { full_name, email }) {
    const result = await pool.query(
      `UPDATE users SET full_name = $1, email = $2 WHERE id = $3
       RETURNING id, full_name, email, role, created_at`,
      [full_name, email, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Update user password
   */
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
    const result = await pool.query(
      `UPDATE users SET password_hash = $1 WHERE id = $2
       RETURNING id, full_name, email, role`,
      [hashedPassword, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Get total user count
   */
  static async count() {
    const result = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['customer']);
    return parseInt(result.rows[0].count);
  }
}

module.exports = User;
