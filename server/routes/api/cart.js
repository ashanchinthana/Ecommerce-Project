const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
} = require('../../controllers/cartController');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getCart)
  .delete(protect, clearCart);

router.route('/items')
  .post(protect, addToCart);

router.route('/items/:id')
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart);

router.route('/apply-coupon')
  .post(protect, applyCoupon);

router.route('/coupon')
  .delete(protect, removeCoupon);

module.exports = router;