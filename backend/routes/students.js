const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); 
// Added this import because it is used in the /batch route at the bottom
const StudentExam = require('../models/StudentExam'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware'); 
require('dotenv').config();

// ==========================================
//  AUTOMATIC FIX: DROP OLD INDEXES (RUNS ON START)
//  This deletes the "zombie" index causing the duplicate error.
// ==========================================
try {
    Student.collection.dropIndex('roll_number_1')
        .then(() => console.log("✅ SUCCESS: Old 'roll_number' index dropped! You can now create students."))
        .catch((err) => {
            // Code 27 means the index is already gone, which is fine.
            if (err.code !== 27) console.log("Index cleanup status:", err.message);
        });
} catch (e) {
    console.log("Index cleanup skipped.");
}

// Helper: Remove empty strings/nulls to prevent MongoDB Unique Index errors
const cleanStudentData = (data) => {
    const cleaned = { ...data };
    
    // 1. Force Trim Admission Number if it exists
    if (cleaned.admission_number && typeof cleaned.admission_number === 'string') {
        cleaned.admission_number = cleaned.admission_number.trim();
    }

    // 2. Handle Optional Unique Fields
    // REMOVED 'admission_number' from here because it is REQUIRED now.
    const optionalUniqueFields = ['email', 'student_aadhar'];
    
    optionalUniqueFields.forEach(field => {
        if (!cleaned[field] || (typeof cleaned[field] === 'string' && cleaned[field].trim() === '')) {
            delete cleaned[field];
        } else if (typeof cleaned[field] === 'string') {
            cleaned[field] = cleaned[field].trim(); // Trim email/aadhar too
        }
    });
    return cleaned;
};

// ==========================================
//  MANUAL FIX ROUTE (Backup option)
//  URL: http://localhost:5000/api/students/fix-indexes
// ==========================================
router.get('/fix-indexes', async (req, res) => {
    try {
        await Student.collection.dropIndexes();
        res.send("All Indexes dropped successfully. MongoDB will rebuild the correct ones on the next save.");
    } catch (err) {
        res.status(500).send("Error dropping indexes: " + err.message);
    }
});

// ==========================================
//  CREATE STUDENT (POST)
// ==========================================
router.post('/', authMiddleware, async (req, res) => {
    try {
        const processedData = cleanStudentData(req.body);

        // --- 1. VALIDATION ---
        if (!processedData.admission_number) {
            return res.status(400).json({ message: "Roll Number (Admission Number) is required." });
        }

        // --- 2. DUPLICATE CHECKS (Case Insensitive) ---
        // Check if Roll Number exists (Case Insensitive)
        const rollNoExists = await Student.findOne({ 
            admission_number: { $regex: new RegExp(`^${processedData.admission_number}$`, 'i') } 
        });
        if (rollNoExists) {
            return res.status(400).json({ message: `Roll Number '${processedData.admission_number}' already exists.` });
        }

        // Check if Email exists
        if (processedData.email) {
            const emailExists = await Student.findOne({ email: processedData.email });
            if (emailExists) return res.status(400).json({ message: 'Email already exists.' });
        }

        // --- 3. PASSWORD HANDLING ---
        const plainPassword = processedData.password && processedData.password.trim() !== "" 
            ? processedData.password 
            : 'student123'; 

        const newStudent = new Student({
            ...processedData,
            password: plainPassword 
        });

        await newStudent.save();

        res.status(201).json({
            ...newStudent.toObject(),
            generatedPassword: plainPassword 
        });

    } catch (error) {
        console.error("Create Error:", error);
        // Handle MongoDB Duplicate Key Error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ message: `Duplicate data error: The field '${field}' is already in use.` });
        }
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});

// ==========================================
//  UPDATE STUDENT (PUT)
// ==========================================
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updateData = cleanStudentData(req.body);
        
        // Prevent changing Roll Number to a duplicate
        if (updateData.admission_number) {
            const existingStudent = await Student.findOne({ 
                admission_number: { $regex: new RegExp(`^${updateData.admission_number}$`, 'i') },
                _id: { $ne: req.params.id } // Exclude current student
            });
            if (existingStudent) {
                return res.status(400).json({ message: `Roll Number '${updateData.admission_number}' is already taken.` });
            }
        }

        if (updateData.password && updateData.password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        } else {
            delete updateData.password; 
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
        res.json(updatedStudent);

    } catch (error) {
        console.error("Update Error:", error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ message: `Error: The field '${field}' must be unique.` });
        }
        res.status(500).json({ message: 'Server error' }); 
    }
});

// ==========================================
//  GET ALL STUDENTS (GET)
// ==========================================
router.get('/', async (req, res) => {
    try {
        const { search, course_type } = req.query;
        let query = {};

        if (search && search.trim() !== "") {
            const regex = new RegExp(search.trim(), 'i');
            query.$or = [
                { student_name: regex },
                { admission_number: regex },
                { student_mobile: regex }
            ];
        }
        if (course_type && course_type.trim() !== "") {
            query.course_type = course_type;
        }

        const students = await Student.find(query).sort({ createdAt: -1 });
        res.json({ students });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching data' });
    }
});

// ==========================================
//  LOGIN (POST) - FIXED CASE SENSITIVITY
// ==========================================
router.post('/login', async (req, res) => {
    let { identifier, password } = req.body;
    if (!identifier || !password) return res.status(400).json({ message: 'Missing credentials' });

    try {
        identifier = identifier.trim();
        
        // UPDATED: Use Regex for Case Insensitive Match on Roll Number
        const student = await Student.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { admission_number: { $regex: new RegExp(`^${identifier}$`, 'i') } } 
            ]
        });

        if (!student) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({ student: { id: student._id } }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        res.json({ 
            success: true, 
            token, 
            student: {
                id: student._id,
                name: student.student_name,
                admission_number: student.admission_number
            } 
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// ==========================================
//  DELETE SINGLE STUDENT (DELETE)
// ==========================================
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted successfully' });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// ==========================================
//  BULK DELETE (POST)
// ==========================================
router.post('/bulk-delete', authMiddleware, async (req, res) => {
    try {
        const { ids } = req.body;
        await Student.deleteMany({ _id: { $in: ids } });
        res.json({ message: 'Students deleted successfully' });
    } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

// ==========================================
//  GET SINGLE STUDENT (GET)
// ==========================================
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if(!student) return res.status(404).json({message: "Not Found"});
        res.json(student);
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// ==========================================
//  GET PROFILE (GET)
// ==========================================
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const studentId = req.student?.id || req.user?.id;
        if (!studentId) return res.status(401).json({ message: 'Unauthorized' });
        const studentProfile = await Student.findById(studentId).select('-password');
        if (!studentProfile) return res.status(404).json({ message: 'Student record not found' });
        res.json(studentProfile);
    } catch (err) { res.status(500).json({ message: 'Server Error' }); }
});

// ==========================================
//  GET BATCH EXAMS
// ==========================================
router.get('/batch', authMiddleware, async (req, res) => {
    const { program, year } = req.query;

    if (!program || !year) return res.status(400).json({ message: 'Missing program or year' });

    try {
        // 1. Find students in this batch first
        const students = await Student.find({ program, admission_year: year }).select('_id');
        const studentIds = students.map(s => s._id);

        if (studentIds.length === 0) return res.json([]);

        // 2. Find exams linked to these students
        // Note: Ensure ../models/StudentExam exists and is imported
        const exams = await StudentExam.aggregate([
            { $match: { student: { $in: studentIds } } },
            {
                $group: {
                    _id: { 
                        subject: "$subject", 
                        examDate: "$examDate", 
                        examType: "$examType",
                        startTime: "$startTime",
                        endTime: "$endTime",
                        roomNo: "$roomNo",
                        maxMarks: "$maxMarks"
                    },
                    studentCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    subject: "$_id.subject",
                    examDate: "$_id.examDate",
                    examType: "$_id.examType",
                    startTime: "$_id.startTime",
                    endTime: "$_id.endTime",
                    roomNo: "$_id.roomNo",
                    maxMarks: "$_id.maxMarks",
                    studentCount: 1
                }
            },
            { $sort: { examDate: 1 } }
        ]);

        console.log(`Found ${exams.length} unique exams for ${program} - ${year}`);
        res.json(exams);

    } catch (err) {
        console.error("Batch Exam Fetch Error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;