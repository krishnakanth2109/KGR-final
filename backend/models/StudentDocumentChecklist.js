const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },
    sscMarks: { type: String, enum: ['Yes', 'No', 'Later'], default: 'No' }, // 10th Mark List
    studyCertificates: { type: String, enum: ['Yes', 'No', 'Later'], default: 'No' }, // 6th-10th
    interMarks: { type: String, enum: ['Yes', 'No', 'Later'], default: 'No' },
    interStudy: { type: String, enum: ['Yes', 'No', 'Later'], default: 'No' },
    interTC: { type: String, enum: ['Yes', 'No', 'Later'], default: 'No' },
    aadharStudent: { type: String, enum: ['Yes', 'No', 'Later'], default: 'No' },
    aadharMother: { type: String, enum: ['Yes', 'No', 'Later'], default: 'No' },
    aadharFather: { type: String, enum: ['Yes', 'No', 'Later'], default: 'No' },
    bankPassbookJoint: { type: String, enum: ['Yes', 'No', 'Later'], default: 'No' },
    bankPassbookStudent: { type: String, enum: ['Yes', 'No', 'Later'], default: 'No' },
    casteCertificate: { type: String, enum: ['Yes', 'No', 'Later'], default: 'No' },
    incomeCertificate: { type: String, enum: ['Yes', 'No', 'Later'], default: 'No' },
    photos: { type: String, enum: ['Yes', 'No', 'Later'], default: 'No' },
    mobileNumber: { type: String, enum: ['Yes', 'No', 'Later'], default: 'No' }
}, { timestamps: true });

module.exports = mongoose.model('StudentDocumentChecklist', checklistSchema);