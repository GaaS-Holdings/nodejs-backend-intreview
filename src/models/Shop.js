const pool = require('../config/database');

class Shop {
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM shops ORDER BY id'
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM shops WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(data) {
    const { name } = data;
    const result = await pool.query(
      'INSERT INTO shops (name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const { name } = data;
    const result = await pool.query(
      'UPDATE shops SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [name, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM shops WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Shop;
