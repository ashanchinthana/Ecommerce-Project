
const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  uploadProductImage,
  getProductCategories,
} = require('../../controllers/productController');
const { protect, admin } = require('../../middleware/auth');
const upload = require('../../config/multer');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get('/top', getTopProducts);
router.get('/categories', getProductCategories);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.post('/:id/reviews', protect, createProductReview);

router.post(
  '/:id/upload-image',
  protect,
  admin,
  upload.single('image'),
  uploadProductImage
);

module.exports = router;