const Shop = require('../models/Shop');

const mockAuth = async (req, res, next) => {
  try {
    // Mock authentication: read shop_id from URL params
    // In a real application, this would come from JWT token, session, etc.
    const shopId = req.query.shop_id;

    if (!shopId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Shop ID is required'
      });
    }

    // Verify the shop exists
    const shop = await Shop.findById(parseInt(shopId));

    if (!shop) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Shop not found'
      });
    }

    // Attach the current shop to the request object
    req.currentShop = shop;
    req.currentShopId = shop.id;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
};

module.exports = mockAuth;
