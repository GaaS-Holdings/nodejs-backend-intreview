const pool = require('../config/database');

const runMigrations = async () => {
  const client = await pool.connect();

  try {
    console.log('Starting database migrations...');

    await client.query('BEGIN');

    // Create shops table
    await client.query(`
      CREATE TABLE IF NOT EXISTS shops (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Shops table created');

    // Create posts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        shop_id INTEGER NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
        likes_count INTEGER DEFAULT 0,
        comment_count INTEGER DEFAULT 0,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Posts table created');

    // Create index for shop_id for faster queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_posts_shop_id ON posts(shop_id);
    `);
    console.log('✓ Index created on posts.shop_id');

    await client.query('COMMIT');
    console.log('Migrations completed successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

runMigrations().catch(err => {
  console.error('Error running migrations:', err);
  process.exit(1);
});
