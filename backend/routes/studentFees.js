// backend/routes/studentFees.js
const express = require('express');
const router = express.Router();
const StudentFee = require('../models/StudentFee');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware');

// ==========================================
// 1. MAPPING & ASSIGNMENT
// ==========================================

// @route   POST /api/student-fees/assign
// @desc    Assign a fee structure (totalPayable) to a student
// Body: { studentId, totalPayable, discount, feeStructureId }
router.post('/assign', authMiddleware, async (req, res) => {
    const { studentId, totalPayable, discount, feeStructureId } = req.body;

    try {
        let feeRecord = await StudentFee.findOne({ student: studentId });

        if (feeRecord) {
            // Update existing
            feeRecord.totalPayable = totalPayable;
            feeRecord.discount = discount || 0;
            feeRecord.feeStructureId = feeStructureId;
        } else {
            // Create new
            feeRecord = new StudentFee({
                student: studentId,
                totalPayable,
                discount: discount || 0,
                feeStructureId
            });
        }

        await feeRecord.save();
        res.json(feeRecord);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ==========================================
// 2. PAYMENTS
// ==========================================

// @route   POST /api/student-fees/pay
// @desc    Record a payment
// Body: { studentId, amount, mode, remarks, transactionId }
router.post('/pay', authMiddleware, async (req, res) => {
    const { studentId, amount, mode, remarks, transactionId } = req.body;

    try {
        const feeRecord = await StudentFee.findOne({ student: studentId });
        if (!feeRecord) return res.status(404).json({ message: 'Fee record not found for student' });

        const newPayment = {
            transactionId: transactionId || `TXN-${Date.now()}`,
            amount: Number(amount),
            mode,
            remarks,
            date: new Date()
        };

        feeRecord.transactions.push(newPayment);
        await feeRecord.save(); // Pre-save hook will update totalPaid & status

        res.json(feeRecord);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// ==========================================
// 3. FETCH DATA
// ==========================================

// @route   GET /api/student-fees/:studentId
// @desc    Get single student fee details
router.get('/:studentId', authMiddleware, async (req, res) => {
    try {
        const fees = await StudentFee.findOne({ student: req.params.studentId })
            .populate('feeStructureId', 'name breakdown');
        
        if (!fees) return res.status(404).json({ message: 'No fee record found' });
        res.json(fees);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/student-fees/dashboard/stats
// @desc    Get aggregated stats for Admin Dashboard
router.get('/dashboard/stats', authMiddleware, async (req, res) => {
    try {
        const stats = await StudentFee.aggregate([
            {
                $group: {
                    _id: null,
                    totalExpected: { $sum: "$totalPayable" },
                    totalCollected: { $sum: "$totalPaid" },
                    totalDiscount: { $sum: "$discount" }
                }
            }
        ]);

        const pendingCount = await StudentFee.countDocuments({ paymentStatus: { $in: ['Pending', 'Partial'] } });
        const paidCount = await StudentFee.countDocuments({ paymentStatus: 'Paid' });

        const data = stats[0] || { totalExpected: 0, totalCollected: 0, totalDiscount: 0 };
        
        res.json({
            collected: data.totalCollected,
            pending: (data.totalExpected - data.totalDiscount) - data.totalCollected,
            totalStudentsPaid: paidCount,
            totalStudentsPending: pendingCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/student-fees/reports/defaulters
// @desc    Get list of students with pending balance
router.get('/reports/defaulters', authMiddleware, async (req, res) => {
    try {
        const defaulters = await StudentFee.find({ paymentStatus: { $ne: 'Paid' } })
            .populate('student', 'first_name last_name admission_number program phone_number')
            .select('totalPayable totalPaid discount paymentStatus');

        // Filter out those with 0 balance (just in case status wasn't updated)
        const result = defaulters.map(rec => {
            const netPayable = rec.totalPayable - rec.discount;
            const due = netPayable - rec.totalPaid;
            return {
                ...rec._doc,
                dueAmount: due
            };
        }).filter(r => r.dueAmount > 0);

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;