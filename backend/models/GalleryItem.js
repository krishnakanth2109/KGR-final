const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String, // The secure URL from Cloudinary
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);
module.exports = GalleryItem;