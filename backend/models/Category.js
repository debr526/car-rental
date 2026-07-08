const pool = require('../config/database');

class Category {
  /**
   * Get all categories
   */
  static async getAll() {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY name ASC'
    );
    return result.rows;
  }

  /**
   * Get category by ID
   */
  static async getById(id) {
    const result = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Create a category
   */
  static async create({ name }) {
    const result = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0];
  }

  /**
   * Update a category
   */
  static async update(id, { name }) {
    const result = await pool.query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Delete a category
   */
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Count categories
   */
  static async count() {
    const result = await pool.query('SELECT COUNT(*) FROM categories');
    return parseInt(result.rows[0].count);
  }
}

module.exports = Category;
