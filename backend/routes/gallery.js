const express = require('express');
const router = express.Router();
const GalleryItem = require('../models/GalleryItem');

// @route   GET /api/gallery
// @desc    Get all gallery items for the public page
// @access  Public
router.get('/', async (req, res) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;