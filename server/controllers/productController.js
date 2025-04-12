const path = require('path');
const fs = require('fs');
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // Initialize query object
  const queryObj = {};
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  
  // Build query based on query parameters
  
  // Search by name or description
  if (req.query.search) {
    queryObj.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  
  // Filter by category
  if (req.query.category) {
    queryObj.category = req.query.category;
  }
  
  // Filter by brand
  if (req.query.brand) {
    queryObj.brand = req.query.brand;
  }
  
  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    queryObj.price = {};
    if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
  }
  
  // Filter by featured
  if (req.query.featured) {
    queryObj.featured = req.query.featured === 'true';
  }
  
  // Filter by stock status
  if (req.query.inStock) {
    if (req.query.inStock === 'true') {
      queryObj.countInStock = { $gt: 0 };
    } else if (req.query.inStock === 'false') {
      queryObj.countInStock = 0;
    } else if (req.query.inStock === 'low') {
      queryObj.countInStock = { $gt: 0, $lte: 5 };
    }
  }
  
  // Execute query with pagination
  let query = Product.find(queryObj);
  
  // Sorting
  if (req.query.sortBy) {
    const sortOrder = req.query.order === 'desc' ? '-' : '';
    query = query.sort(`${sortOrder}${req.query.sortBy}`);
  } else {
    query = query.sort('-createdAt');
  }
  
  // Count total documents for pagination info
  const totalCount = await Product.countDocuments(queryObj);
  
  // Apply pagination
  query = query.skip(startIndex).limit(limit);
  
  // Execute query
  const products = await query;
  
  // Pagination result
  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
    limit,
  };
  
  res.json({ products, pagination });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // Create a product with all fields from the request
  const product = new Product({
    user: req.user._id,
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    featured: req.body.featured || false,
    images: req.body.images || [],
    discount: req.body.discount || 0,
    sku: req.body.sku,
    features: req.body.features || [],
  });
  
  const createdProduct = await product.save();
  
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    images,
    brand,
    category,
    countInStock,
    featured,
    discount,
    sku,
    features,
  } = req.body;
  
  const product = await Product.findById(req.params.id);
  
  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.images = images || product.images;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
    product.featured = featured !== undefined ? featured : product.featured;
    product.discount = discount !== undefined ? discount : product.discount;
    product.sku = sku || product.sku;
    product.features = features || product.features;
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    // Delete product images from filesystem
    if (product.images && product.images.length > 0) {
      product.images.forEach((imagePath) => {
        // Extract filename from URL/path
        const filename = imagePath.split('/').pop();
        const filepath = path.join(__dirname, '../../uploads', filename);
        
        // Check if file exists before attempting to delete
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      });
    }
    
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  
  const product = await Product.findById(req.params.id);
  
  if (product) {
    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }
    
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    
    product.reviews.push(review);
    
    product.numReviews = product.reviews.length;
    
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 5;
  
  const products = await Product.find({})
    .sort({ rating: -1 })
    .limit(Number(limit));
  
  res.json(products);
});

// @desc    Upload product image
// @route   POST /api/products/:id/upload-image
// @access  Private/Admin
const uploadProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }
  
  // Create image URL
  const imageUrl = `/uploads/${req.file.filename}`;
  
  // Add image to product's images array
  product.images.push(imageUrl);
  
  const updatedProduct = await product.save();
  
  res.json(updatedProduct);
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  uploadProductImage,
  getProductCategories,
};
