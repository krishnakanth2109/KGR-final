const mongoose = require('mongoose');

// Sub-schema for qualifications
const qualificationSchema = new mongoose.Schema({
    degree: { type: String, trim: true },
    institution: { type: String, trim: true },
    year: { type: String, trim: true }, // Using String to accommodate different formats
}, { _id: false });

// Sub-schema for address
const addressSchema = new mongoose.Schema({
    address_line1: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postal_code: { type: String, trim: true },
}, { _id: false });
      
// Main Faculty Schema
const facultySchema = new mongoose.Schema({
    // --- Basic Information ---
    faculty_id: { type: String, required: true, unique: true, trim: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dob: { type: Date },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone_number: { type: String, required: true, trim: true },

    // --- Professional Information ---
    department: { type: String, enum: ['MPHW', 'MLT'], required: true },
    designation: { type: String, required: true, trim: true },
    date_of_joining: { type: Date },
    status: { type: String, enum: ['Active', 'On Leave', 'Resigned'], default: 'Active' },
    
    // --- Embedded Documents ---
    qualifications: [qualificationSchema],
    address: addressSchema,

    // --- Miscellaneous ---
    extras: {
        profile_photo_url: { type: String, default: '' },
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Faculty = mongoose.model('Faculty', facultySchema);
module.exports = Faculty;