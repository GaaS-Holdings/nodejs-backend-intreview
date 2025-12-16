const pool = require('../config/database');

class Post {
  static async findAll(limit = 100, offset = 0) {
    const result = await pool.query(
      'SELECT * FROM posts ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByShopId(shopId, limit = 100, offset = 0) {
    const result = await pool.query(
      'SELECT * FROM posts WHERE shop_id = $1 ORDER BY id LIMIT $2 OFFSET $3',
      [shopId, limit, offset]
    );
    return result.rows;
  }

  static async create(data) {
    const { shop_id, likes_count = 0, comment_count = 0, image_url } = data;
    const result = await pool.query(
      'INSERT INTO posts (shop_id, likes_count, comment_count, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [shop_id, likes_count, comment_count, image_url]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const { likes_count, comment_count, image_url } = data;
    const result = await pool.query(
      'UPDATE posts SET likes_count = $1, comment_count = $2, image_url = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [likes_count, comment_count, image_url, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Post;
