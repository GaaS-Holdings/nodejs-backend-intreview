const Post = require('../models/Post');

const postController = {
  async getById(req, res) {
    try {
      const { id } = req.params;
      const shopId = req.currentShopId;

      const post = await Post.findById(parseInt(id));

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found'
        });
      }

      // Verify the post belongs to the current shop
      if (post.shop_id !== shopId) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: Post does not belong to this shop'
        });
      }

      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch post'
      });
    }
  },

  async getByShopId(req, res) {
    try {
      const shopId = req.currentShopId;
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;

      const posts = await Post.findByShopId(shopId, limit, offset);

      res.json({
        success: true,
        data: posts,
        pagination: {
          limit,
          offset,
          count: posts.length
        }
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch posts'
      });
    }
  }
};

module.exports = postController;
