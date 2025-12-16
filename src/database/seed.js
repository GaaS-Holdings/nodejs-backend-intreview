const pool = require('../config/database');

const seedDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log('Starting database seeding...');

    await client.query('BEGIN');

    // Clear existing data
    await client.query('TRUNCATE TABLE posts, shops RESTART IDENTITY CASCADE');
    console.log('✓ Cleared existing data');

    // Insert 5 shops
    const shopNames = [
      'Fashion Boutique',
      'Tech Gadgets Store',
      'Home & Garden',
      'Sports Equipment',
      'Books & More'
    ];

    const shopIds = [];
    for (const name of shopNames) {
      const result = await client.query(
        'INSERT INTO shops (name) VALUES ($1) RETURNING id',
        [name]
      );
      shopIds.push(result.rows[0].id);
    }
    console.log(`✓ Created ${shopIds.length} shops`);

    // Insert 1000 posts for each shop (5000 total)
    const postsPerShop = 1000;
    const batchSize = 100;
    let totalPosts = 0;

    for (const shopId of shopIds) {
      for (let i = 0; i < postsPerShop; i += batchSize) {
        const values = [];
        const placeholders = [];

        for (let j = 0; j < batchSize && (i + j) < postsPerShop; j++) {
          const postIndex = i + j;
          const likesCount = Math.floor(Math.random() * 1000);
          const commentCount = Math.floor(Math.random() * 100);
          const imageUrl = `https://picsum.photos/seed/${shopId}-${postIndex}/800/600`;

          const offset = values.length / 4;
          placeholders.push(
            `($${offset * 4 + 1}, $${offset * 4 + 2}, $${offset * 4 + 3}, $${offset * 4 + 4})`
          );
          values.push(shopId, likesCount, commentCount, imageUrl);
        }

        await client.query(
          `INSERT INTO posts (shop_id, likes_count, comment_count, image_url)
           VALUES ${placeholders.join(', ')}`,
          values
        );

        totalPosts += placeholders.length;
      }
      console.log(`✓ Created ${postsPerShop} posts for shop ${shopId}`);
    }

    await client.query('COMMIT');
    console.log(`Seeding completed successfully! Created ${totalPosts} posts total.`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

seedDatabase().catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
