// backend/models/FeeStructure.js
const mongoose = require('mongoose');

// Schema for a single year's fee breakdown
const yearFeeSchema = new mongoose.Schema({
    admissionFee: { type: Number, default: 0 },
    collegeFee: { type: Number, default: 0 },
    hostelFee: { type: Number, default: 0 },
    scholarship: { type: Number, default: 0 },
    booksFee: { type: Number, default: 0 },
    uniformFee: { type: Number, default: 0 },
    clinicalFee: { type: Number, default: 0 },
    cautionDeposit: { type: Number, default: 0 },
    busFee: { type: Number, default: 0 }
}, { _id: false });

const feeStructureSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true }, // e.g., "MPHW 2024-25"
    program: { type: String, enum: ['MPHW', 'MLT'], required: true },
    academicYear: { type: String, required: true }, // e.g., "2024-2025"
    
    // Detailed Breakdown
    breakdown: {
        year1: yearFeeSchema,
        year2: yearFeeSchema,
        year3: yearFeeSchema
    },

    // Auto-calculated totals
    totalAmount: { type: Number, required: true }, 
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);