const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const mockAuth = require('../middleware/auth');

// All routes require authentication (shop_id in params)
router.get('/posts', mockAuth, postController.getByShopId);
router.get('/posts/:id', mockAuth, postController.getById);

module.exports = router;
