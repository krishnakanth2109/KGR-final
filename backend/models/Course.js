const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  title: { type: String, required: true, trim: true },
  image: { type: String, required: true }, // Cloudinary URL
  description: { type: String, required: true },
  highlights: { type: [String], required: true },
  duration: { type: String, required: true },
  eligibility: { type: String, required: true },
  careerIntro: { type: String, required: true },
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;