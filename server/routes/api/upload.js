const express = require('express');
const path = require('path');
const fs = require('fs');
const asyncHandler = require('express-async-handler');
const { protect, admin } = require('../../middleware/auth');
const upload = require('../../config/multer');

const router = express.Router();

// @desc    Upload file
// @route   POST /api/upload
// @access  Private/Admin
router.post(
  '/',
  protect,
  admin,
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    res.status(200).json({
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
    });
  })
);

// @desc    Delete uploaded file
// @route   DELETE /api/upload/:filename
// @access  Private/Admin
router.delete(
  '/:filename',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../../uploads', filename);

    // Check if file exists
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.status(200).json({ message: 'File deleted' });
    } else {
      res.status(404);
      throw new Error('File not found');
    }
  })
);

module.exports = router;