const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Create order
  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // Update product stock and sales count
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.countInStock -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }
  }

  // Save order
  const createdOrder = await order.save();

  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    // Check if order belongs to user or user is admin
    if (
      order.user._id.toString() === req.user._id.toString() ||
      req.user.isAdmin
    ) {
      res.json(order);
    } else {
      res.status(403);
      throw new Error('Not authorized to access this order');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    // Update status
    order.status = status;

    // If status is 'delivered', update isDelivered and deliveredAt
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  // Initialize query object
  const queryObj = {};
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  
  // Filter by status
  if (req.query.status) {
    queryObj.status = req.query.status;
  }
  
  // Filter by payment status
  if (req.query.isPaid) {
    queryObj.isPaid = req.query.isPaid === 'true';
  }
  
  // Filter by delivery status
  if (req.query.isDelivered) {
    queryObj.isDelivered = req.query.isDelivered === 'true';
  }
  
  // Date range filters
  if (req.query.startDate || req.query.endDate) {
    queryObj.createdAt = {};
    if (req.query.startDate) {
      queryObj.createdAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      // Add one day to include the end date fully
      const endDate = new Date(req.query.endDate);
      endDate.setDate(endDate.getDate() + 1);
      queryObj.createdAt.$lt = endDate;
    }
  }
  
  // Count total documents for pagination info
  const totalCount = await Order.countDocuments(queryObj);
  
  // Execute query with pagination
  let query = Order.find(queryObj)
    .populate('user', 'id name email')
    .skip(startIndex)
    .limit(limit);
  
  // Sorting
  if (req.query.sortBy) {
    const sortOrder = req.query.order === 'desc' ? '-' : '';
    query = query.sort(`${sortOrder}${req.query.sortBy}`);
  } else {
    query = query.sort('-createdAt');
  }
  
  const orders = await query;
  
  // Pagination result
  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
    limit,
  };
  
  res.json({ orders, pagination });
});

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getMyOrders,
  getOrders,
};