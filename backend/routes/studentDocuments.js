const express = require('express');
const router = express.Router();
const StudentDocument = require('../models/StudentDocument');
const StudentDocumentChecklist = require('../models/StudentDocumentChecklist');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: { folder: 'student_docs', allowed_formats: ['jpg', 'png', 'pdf', 'jpeg'] }
});
const upload = multer({ storage });

// --- CHECKLIST ROUTES ---

// GET Checklist
router.get('/checklist/:studentId', authMiddleware, async (req, res) => {
    try {
        let checklist = await StudentDocumentChecklist.findOne({ student: req.params.studentId });
        if (!checklist) return res.json({}); // Return empty if not found
        res.json(checklist);
    } catch (err) { res.status(500).json({ message: 'Server Error' }); }
});

// POST Checklist (Upsert)
router.post('/checklist/:studentId', authMiddleware, async (req, res) => {
    try {
        const checklist = await StudentDocumentChecklist.findOneAndUpdate(
            { student: req.params.studentId },
            { student: req.params.studentId, ...req.body },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(checklist);
    } catch (err) { res.status(500).json({ message: 'Server Error' }); }
});

// --- FILE UPLOAD ROUTES ---

// GET Uploaded Files
router.get('/files/:studentId', authMiddleware, async (req, res) => {
    try {
        const docs = await StudentDocument.find({ student: req.params.studentId }).sort({ uploadDate: -1 });
        res.json(docs);
    } catch (err) { res.status(500).json({ message: 'Server Error' }); }
});

// POST Upload File
router.post('/upload/:studentId', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const newDoc = new StudentDocument({
            student: req.params.studentId,
            title: req.body.title,
            type: req.body.type,
            fileUrl: req.file.path,
            publicId: req.file.filename
        });
        await newDoc.save();
        res.status(201).json(newDoc);
    } catch (err) { res.status(500).json({ message: 'Upload Failed' }); }
});

// DELETE File
router.delete('/files/:docId', authMiddleware, async (req, res) => {
    try {
        const doc = await StudentDocument.findById(req.params.docId);
        if (!doc) return res.status(404).json({ message: 'Not found' });
        await cloudinary.uploader.destroy(doc.publicId);
        await StudentDocument.findByIdAndDelete(req.params.docId);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: 'Server Error' }); }
});

module.exports = router;