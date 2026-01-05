// backend/routes/feeStructureRoutes.js
const express = require('express');
const router = express.Router();
const FeeStructure = require('../models/FeeStructure');
const authMiddleware = require('../middleware/authMiddleware');

// POST: Create
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, program, academicYear, breakdown } = req.body;

        // Calculate Total Amount automatically on backend for security
        const calculateYearTotal = (y) => Object.values(y || {}).reduce((a, b) => a + Number(b), 0);
        const totalAmount = calculateYearTotal(breakdown.year1) + calculateYearTotal(breakdown.year2) + calculateYearTotal(breakdown.year3);

        const newStructure = new FeeStructure({
            name, program, academicYear, breakdown, totalAmount
        });

        await newStructure.save();
        res.status(201).json(newStructure);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// GET: List
router.get('/', authMiddleware, async (req, res) => {
    try {
        const structures = await FeeStructure.find().sort({ createdAt: -1 });
        res.json(structures);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await FeeStructure.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;