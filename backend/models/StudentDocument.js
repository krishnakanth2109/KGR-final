const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    title: { type: String, required: true },
    type: { type: String, default: 'Official' },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('StudentDocument', documentSchema);