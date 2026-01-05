const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const GalleryItem = require('../models/GalleryItem');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/authMiddleware'); // <-- IMPORT THE NEW MIDDLEWARE

// --- Cloudinary and Multer Setup ---
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const storage = multer.memoryStorage();
const upload = multer({ storage });


// ==========================================================
// ALL ROUTES BELOW NOW USE 'authMiddleware' INSTEAD OF 'auth'
// This ensures they are protected by the new JWT system.
// ==========================================================


// =============== GALLERY CRUD ROUTES ===============

router.post('/gallery', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  if (!req.file || !title || !description) return res.status(400).json({ message: 'All fields are required.' });
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await cloudinary.uploader.upload(dataURI, { folder: "gallery" });
    const newItem = new GalleryItem({ title, description, imageUrl: result.secure_url });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) { res.status(500).json({ message: 'Server error while creating item.' }); }
});

router.put('/gallery/:id', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) return res.status(400).json({ message: 'Title and description are required.' });
  try {
    const updatedItem = await GalleryItem.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.json(updatedItem);
  } catch (error) { res.status(500).json({ message: 'Server error while updating item.' }); }
});

router.put('/gallery/image/:id', authMiddleware, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'New image file is required.' });
    }
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI, { folder: "gallery" });
        const updatedItem = await GalleryItem.findByIdAndUpdate(req.params.id, { imageUrl: result.secure_url }, { new: true });
        if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
        res.json(updatedItem);
    } catch (error) {
        console.error("Image Update Error:", error);
        res.status(500).json({ message: 'Server error while updating image.' });
    }
});

router.delete('/gallery/:id', authMiddleware, async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully.' });
  } catch (error) { res.status(500).json({ message: 'Server error while deleting item.' }); }
});


// =============== COURSES CRUD ROUTES ===============

router.post('/courses', authMiddleware, upload.single('image'), async (req, res) => {
  const { slug, title, description, duration, eligibility, careerIntro } = req.body;
  const highlights = req.body.highlights.split(',').map(item => item.trim());
  if (!req.file) return res.status(400).json({ message: 'Image is required.' });
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await cloudinary.uploader.upload(dataURI, { folder: "courses" });
    const newCourse = new Course({ slug, title, description, duration, eligibility, careerIntro, highlights, image: result.secure_url });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) { res.status(500).json({ message: 'Server error while creating course.' }); }
});

router.put('/courses/:id', authMiddleware, upload.single('image'), async (req, res) => {
  const { slug, title, description, duration, eligibility, careerIntro } = req.body;
  const highlights = req.body.highlights.split(',').map(item => item.trim());
  const updateData = { slug, title, description, duration, eligibility, careerIntro, highlights };
  try {
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, { folder: "courses" });
      updateData.image = result.secure_url;
    }
    const course = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) { res.status(500).json({ message: 'Server error while updating course.' }); }
});

router.delete('/courses/:id', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted successfully.' });
  } catch (error) { res.status(500).json({ message: 'Server error while deleting course.' }); }
});

module.exports = router;