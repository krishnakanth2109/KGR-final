// --- START OF FILE backend/models/Application.js ---

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  course: { type: String }, // Optional: Track which course they applied for
  status: { 
    type: String, 
    enum: ['Pending', 'Interested', 'Not Interested'], 
    default: 'Pending' 
  },
  submissionDate: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;