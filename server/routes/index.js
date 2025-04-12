const express = require('express');
const router = express.Router();

// API Routes
const authRoutes = require('./api/auth');
const userRoutes = require('./api/users');
const productRoutes = require('./api/products');
const orderRoutes = require('./api/orders');
const cartRoutes = require('./api/cart');
const uploadRoutes = require('./api/upload');

// Mount API routes
router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/products', productRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/cart', cartRoutes);
router.use('/api/upload', uploadRoutes);

module.exports = router;