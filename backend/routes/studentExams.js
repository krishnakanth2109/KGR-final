// backend/routes/studentExams.js
const express = require('express');
const router = express.Router();
const StudentExam = require('../models/StudentExam');
const Student = require('../models/Student');

// ==========================================
// 1. BULK CREATE EXAMS (Publish Schedule)
// ==========================================
router.post('/bulk/create', async (req, res) => {
    const { program, admissionYear, examDetails } = req.body;

    // Validation
    if (!program || !admissionYear || !examDetails) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // 1. Find all active students matching the batch
        // We use $or to check both course_name and course_type to be safe
        const students = await Student.find({ 
            $or: [
                { course_name: program }, 
                { course_type: program }
            ],
            academic_year: { $regex: admissionYear }, // Matches "2024-2025" if user sends "2024"
            status: 'Active' 
        });

        if (students.length === 0) {
            return res.status(404).json({ message: `No active students found for ${program} (${admissionYear})` });
        }

        // 2. Prepare Exam Objects for every student
        const examDocs = students.map(student => ({
            student: student._id,
            subject: examDetails.subject,
            examDate: examDetails.examDate,
            startTime: examDetails.startTime,
            endTime: examDetails.endTime,
            roomNo: examDetails.roomNo,
            examType: examDetails.examType,
            maxMarks: examDetails.maxMarks,
            isPublished: true
        }));

        // 3. Bulk Insert
        await StudentExam.insertMany(examDocs);

        res.json({ 
            success: true, 
            message: `Successfully scheduled '${examDetails.subject}' for ${students.length} students.` 
        });

    } catch (err) {
        console.error("Bulk Exam Error:", err);
        res.status(500).json({ message: 'Server Error while scheduling exams.' });
    }
});

// ==========================================
// 2. FETCH EXAMS FOR A BATCH (To display in table)
// ==========================================
router.get('/batch', async (req, res) => {
    const { program, year } = req.query;

    if (!program || !year) return res.status(400).json({ message: 'Missing program or year' });

    try {
        // 1. Find students
        const students = await Student.find({ 
            $or: [{ course_name: program }, { course_type: program }],
            academic_year: { $regex: year }
        }).select('_id');
        
        const studentIds = students.map(s => s._id);

        if (studentIds.length === 0) return res.json([]);

        // 2. Aggregate exams to group duplicates
        const exams = await StudentExam.aggregate([
            { $match: { student: { $in: studentIds } } },
            {
                $group: {
                    _id: { 
                        subject: "$subject", 
                        examDate: "$examDate", 
                        examType: "$examType",
                        startTime: "$startTime",
                        endTime: "$endTime"
                    },
                    roomNo: { $first: "$roomNo" },
                    maxMarks: { $first: "$maxMarks" },
                    studentCount: { $sum: 1 } // Count how many students have this exam
                }
            },
            { $sort: { "_id.examDate": 1 } }
        ]);

        // Flatten result for frontend
        const formattedExams = exams.map(e => ({
            subject: e._id.subject,
            examDate: e._id.examDate,
            examType: e._id.examType,
            startTime: e._id.startTime,
            endTime: e._id.endTime,
            roomNo: e.roomNo,
            maxMarks: e.maxMarks,
            studentCount: e.studentCount
        }));

        res.json(formattedExams);

    } catch (err) {
        console.error("Batch Fetch Error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ==========================================
// 3. DYNAMIC ROUTES
// ==========================================

// GET exams for a specific student
router.get('/:studentId', async (req, res) => {
    try {
        const exams = await StudentExam.find({ student: req.params.studentId }).sort({ examDate: 1 });
        res.json(exams);
    } catch (err) { 
        res.status(500).json({ message: 'Server Error' }); 
    }
});

// DELETE Exam
router.delete('/:examId', async (req, res) => {
    try {
        await StudentExam.findByIdAndDelete(req.params.examId);
        res.json({ message: 'Exam deleted' });
    } catch (err) { 
        res.status(500).json({ message: 'Server Error' }); 
    }
});

module.exports = router;