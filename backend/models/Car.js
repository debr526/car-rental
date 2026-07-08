const pool = require('../config/database');

class Car {
  /**
   * Get all cars with optional filters
   * @param {Object} filters - { search, category_id, min_price, max_price, available }
   */
  static async getAll(filters = {}) {
    let query = `
      SELECT c.*, cat.name AS category_name
      FROM cars c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (filters.search) {
      query += ` AND (LOWER(c.brand) LIKE $${paramIndex} OR LOWER(c.model) LIKE $${paramIndex})`;
      params.push(`%${filters.search.toLowerCase()}%`);
      paramIndex++;
    }

    if (filters.category_id) {
      query += ` AND c.category_id = $${paramIndex}`;
      params.push(filters.category_id);
      paramIndex++;
    }

    if (filters.min_price) {
      query += ` AND c.daily_price >= $${paramIndex}`;
      params.push(filters.min_price);
      paramIndex++;
    }

    if (filters.max_price) {
      query += ` AND c.daily_price <= $${paramIndex}`;
      params.push(filters.max_price);
      paramIndex++;
    }

    if (filters.available !== undefined && filters.available !== '') {
      query += ` AND c.availability_status = $${paramIndex}`;
      params.push(filters.available === 'true' || filters.available === true);
      paramIndex++;
    }

    query += ' ORDER BY c.created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Get a single car by ID
   */
  static async getById(id) {
    const result = await pool.query(
      `SELECT c.*, cat.name AS category_name
       FROM cars c
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE c.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Create a car
   */
  static async create({ brand, model, year, category_id, daily_price, availability_status = true, image_url, description }) {
    const result = await pool.query(
      `INSERT INTO cars (brand, model, year, category_id, daily_price, availability_status, image_url, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [brand, model, year, category_id, daily_price, availability_status, image_url, description]
    );
    return result.rows[0];
  }

  /**
   * Update a car
   */
  static async update(id, { brand, model, year, category_id, daily_price, availability_status, image_url, description }) {
    const result = await pool.query(
      `UPDATE cars SET
        brand = COALESCE($1, brand),
        model = COALESCE($2, model),
        year = COALESCE($3, year),
        category_id = COALESCE($4, category_id),
        daily_price = COALESCE($5, daily_price),
        availability_status = COALESCE($6, availability_status),
        image_url = COALESCE($7, image_url),
        description = COALESCE($8, description)
       WHERE id = $9
       RETURNING *`,
      [brand, model, year, category_id, daily_price, availability_status, image_url, description, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Delete a car
   */
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM cars WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Update availability status
   */
  static async updateAvailability(id, status) {
    const result = await pool.query(
      'UPDATE cars SET availability_status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Count total cars
   */
  static async count() {
    const result = await pool.query('SELECT COUNT(*) FROM cars');
    return parseInt(result.rows[0].count);
  }

  /**
   * Count available cars
   */
  static async countAvailable() {
    const result = await pool.query(
      'SELECT COUNT(*) FROM cars WHERE availability_status = true'
    );
    return parseInt(result.rows[0].count);
  }
}

module.exports = Car;
