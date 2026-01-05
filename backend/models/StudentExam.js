const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: String, required: true },
    examDate: { type: Date, required: true },
    startTime: { type: String }, // e.g., "10:00 AM"
    endTime: { type: String },   // e.g., "01:00 PM"
    roomNo: { type: String },
    examType: { type: String, enum: ['Theory', 'Practical', 'Viva'], default: 'Theory' },
    marksObtained: { type: Number },
    maxMarks: { type: Number },
    isPublished: { type: Boolean, default: true } // If false, student can't see result yet
}, { timestamps: true });

module.exports = mongoose.model('StudentExam', examSchema);