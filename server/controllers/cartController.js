const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name price images countInStock discount',
  });

  if (!cart) {
    // Create empty cart if none exists
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  // Calculate totals
  const totals = calculateCartTotals(cart);

  res.json({
    items: cart.items,
    total: totals.total,
    itemCount: totals.itemCount,
    coupon: cart.coupon,
  });
});

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Validate quantity
  if (quantity <= 0) {
    res.status(400);
    throw new Error('Quantity must be greater than 0');
  }

  // Check if in stock
  if (product.countInStock < quantity) {
    res.status(400);
    throw new Error('Not enough items in stock');
  }

  // Find or create cart
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  // Check if product already in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    // Update quantity if product already in cart
    cart.items[itemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity,
    });
  }

  // Save cart
  await cart.save();

  // Return populated cart
  cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name price images countInStock discount',
  });

  // Calculate totals
  const totals = calculateCartTotals(cart);

  res.status(200).json({
    items: cart.items,
    total: totals.total,
    itemCount: totals.itemCount,
    coupon: cart.coupon,
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:id
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const productId = req.params.id;

  // Validate quantity
  if (quantity <= 0) {
    res.status(400);
    throw new Error('Quantity must be greater than 0');
  }

  // Get cart
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Find item in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  // Check if in stock
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.countInStock < quantity) {
    res.status(400);
    throw new Error('Not enough items in stock');
  }

  // Update quantity
  cart.items[itemIndex].quantity = quantity;

  // Save cart
  await cart.save();

  // Return populated cart
  cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name price images countInStock discount',
  });

  // Calculate totals
  const totals = calculateCartTotals(cart);

  res.status(200).json({
    items: cart.items,
    total: totals.total,
    itemCount: totals.itemCount,
    coupon: cart.coupon,
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:id
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  // Get cart
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Remove item
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  // Save cart
  await cart.save();

  // Return populated cart
  cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name price images countInStock discount',
  });

  // Calculate totals
  const totals = calculateCartTotals(cart);

  res.status(200).json({
    items: cart.items,
    total: totals.total,
    itemCount: totals.itemCount,
    coupon: cart.coupon,
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  // Get cart
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Clear items
  cart.items = [];
  cart.coupon = undefined;

  // Save cart
  await cart.save();

  res.status(200).json({
    items: [],
    total: 0,
    itemCount: 0,
    coupon: null,
  });
});

// @desc    Apply coupon to cart
// @route   POST /api/cart/apply-coupon
// @access  Private
const applyCoupon = asyncHandler(async (req, res) => {
  const { couponCode } = req.body;

  // Find coupon
  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
  });

  if (!coupon) {
    res.status(404);
    throw new Error('Invalid or expired coupon code');
  }

  // Get cart
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name price images countInStock discount category',
  });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Check if cart meets minimum purchase requirement
  const totals = calculateCartTotals(cart);
  if (coupon.minimumPurchase > 0 && totals.subtotal < coupon.minimumPurchase) {
    res.status(400);
    throw new Error(
      `Minimum purchase of $${coupon.minimumPurchase.toFixed(
        2
      )} required for this coupon`
    );
  }

  // Check if coupon has reached usage limit
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    res.status(400);
    throw new Error('This coupon has reached its usage limit');
  }

  // Apply coupon to cart
  cart.coupon = coupon._id;
  await cart.save();

  // Increment coupon usage count
  coupon.usageCount += 1;
  await coupon.save();

  // Recalculate totals with coupon
  const updatedTotals = calculateCartTotals(cart, coupon);

  res.status(200).json({
    items: cart.items,
    total: updatedTotals.total,
    itemCount: updatedTotals.itemCount,
    discount: updatedTotals.discount,
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    },
  });
});

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon
// @access  Private
const removeCoupon = asyncHandler(async (req, res) => {
  // Get cart
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name price images countInStock discount',
  });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Remove coupon
  cart.coupon = undefined;
  await cart.save();

  // Calculate totals
  const totals = calculateCartTotals(cart);

  res.status(200).json({
    items: cart.items,
    total: totals.total,
    itemCount: totals.itemCount,
    coupon: null,
  });
});

// Helper function to calculate cart totals
const calculateCartTotals = (cart, coupon = null) => {
  let subtotal = 0;
  let itemCount = 0;
  let discount = 0;

  // Calculate subtotal and item count
  cart.items.forEach((item) => {
    const price = item.product.discount
      ? item.product.price * (1 - item.product.discount / 100)
      : item.product.price;
    subtotal += price * item.quantity;
    itemCount += item.quantity;
  });

  // Apply coupon discount if provided
  if (coupon) {
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === 'fixed') {
      discount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed subtotal
    discount = Math.min(discount, subtotal);
  }

  // Calculate final total
  const total = subtotal - discount;

  return {
    subtotal,
    discount,
    total,
    itemCount,
  };
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
};