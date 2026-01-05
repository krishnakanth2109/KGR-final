// backend/models/StudentFee.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true }, // Auto-generated or manual receipt no
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    mode: { type: String, enum: ['Cash', 'Online', 'Cheque', 'UPI'], required: true },
    remarks: { type: String },
    collectedBy: { type: String } // Admin name/ID
});

const studentFeeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },
    
    // Link to the structure assigned (Optional, if you want to keep reference)
    feeStructureId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeStructure' },

    // Financials
    totalPayable: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // Concession
    totalPaid: { type: Number, default: 0 },
    
    // Status
    paymentStatus: { 
        type: String, 
        enum: ['Paid', 'Partial', 'Pending', 'Overdue'], 
        default: 'Pending' 
    },
    
    // History
    transactions: [paymentSchema],

    // Next Due Info (for quick querying)
    nextDueDate: { type: Date },
    nextDueAmount: { type: Number }

}, { timestamps: true });

// Middleware to update status and totals before saving
studentFeeSchema.pre('save', function(next) {
    // Recalculate totalPaid
    if (this.transactions && this.transactions.length > 0) {
        this.totalPaid = this.transactions.reduce((acc, curr) => acc + curr.amount, 0);
    }
    
    const netPayable = this.totalPayable - this.discount;
    
    if (this.totalPaid >= netPayable) {
        this.paymentStatus = 'Paid';
    } else if (this.totalPaid > 0) {
        this.paymentStatus = 'Partial';
    } else {
        this.paymentStatus = 'Pending';
    }
    
    next();
});

module.exports = mongoose.model('StudentFee', studentFeeSchema);