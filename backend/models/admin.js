const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Admin User' // Default name if none provided
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String, // This will be the hashed password
    required: true,
  },
  passwordResetOTP: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;