const express = require('express');
const router = express.Router();
const Faculty = require('../models/faculty');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/faculty
// @desc    Add a new faculty member
// @access  Private (Admin only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { faculty_id, email } = req.body;
        const existingFaculty = await Faculty.findOne({ $or: [{ faculty_id }, { email }] });
        if (existingFaculty) {
            return res.status(400).json({ message: 'A faculty member with the same Faculty ID or Email already exists.' });
        }

        const newFaculty = new Faculty(req.body);
        const savedFaculty = await newFaculty.save();
        res.status(201).json(savedFaculty);
    } catch (error) {
        console.error("Error creating faculty:", error);
        res.status(500).json({ message: 'Server error while creating faculty member.' });
    }
});

// @route   GET /api/faculty
// @desc    Get all faculty with filtering
// @access  Public (so the main website can display faculty if needed)
router.get('/', async (req, res) => {
    try {
        const { department, status, searchQuery } = req.query;
        const query = {};

        if (department) query.department = department;
        if (status) query.status = status;
        if (searchQuery) {
            query.$or = [
                { first_name: { $regex: searchQuery, $options: 'i' } },
                { last_name: { $regex: searchQuery, $options: 'i' } },
                { faculty_id: { $regex: searchQuery, $options: 'i' } }
            ];
        }
        
        const faculty = await Faculty.find(query).sort({ createdAt: -1 });
        const total = await Faculty.countDocuments(query);

        res.json({ faculty, total });
    } catch (error) {
        console.error("Error fetching faculty:", error);
        res.status(500).json({ message: 'Server error while fetching faculty.' });
    }
});

// @route   GET /api/faculty/:id
// @desc    Get a single faculty member by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const facultyMember = await Faculty.findById(req.params.id);
        if (!facultyMember) {
            return res.status(404).json({ message: 'Faculty member not found.' });
        }
        res.json(facultyMember);
    } catch (error) {
        console.error("Error fetching faculty by ID:", error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// @route   PUT /api/faculty/:id
// @desc    Update a faculty member's information
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updatedFaculty = await Faculty.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedFaculty) {
            return res.status(404).json({ message: 'Faculty member not found.' });
        }
        res.json(updatedFaculty);
    } catch (error) {
        console.error("Error updating faculty:", error);
        res.status(500).json({ message: 'Server error while updating faculty member.' });
    }
});

// @route   PATCH /api/faculty/status
// @desc    Update a faculty member's status
// @access  Private
router.patch('/status', authMiddleware, async (req, res) => {
    const { id, status } = req.body;
    try {
        const facultyMember = await Faculty.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );
        if (!facultyMember) {
            return res.status(404).json({ message: 'Faculty member not found' });
        }
        res.json(facultyMember);
    } catch (error) {
        console.error("Error updating faculty status:", error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// @route   DELETE /api/faculty/:id
// @desc    Delete a faculty member
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const facultyMember = await Faculty.findByIdAndDelete(req.params.id);
        if (!facultyMember) {
            return res.status(404).json({ message: 'Faculty member not found.' });
        }
        res.json({ message: 'Faculty member deleted successfully.' });
    } catch (error) {
        console.error("Error deleting faculty:", error);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;