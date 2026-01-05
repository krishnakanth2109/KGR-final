// --- START OF FILE backend/routes/admissions.js ---

const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Notification = require('../models/Notification'); // Import Notification Model

// POST: Submit Application
router.post('/', async (req, res) => {
  const { name, email, phone, course } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ status: 'error', message: 'Please provide Name, Email, and Phone number.' });
  }

  try {
    const newApplication = new Application({
      name,
      email,
      phone,
      course, 
      status: 'Pending'
    });

    await newApplication.save();

    // --- NEW: Create Notification ---
    const newNotif = new Notification({
        title: 'New Admission Inquiry',
        message: `${name} has applied for ${course || 'a course'}.`,
        type: 'admission'
    });
    await newNotif.save();

    // --- NEW: Emit Socket Event ---
    const io = req.app.get('io');
    io.emit('new-notification', newNotif);

    res.status(201).json({ status: 'success', message: 'Application submitted successfully!' });

  } catch (error) {
    console.error('Error processing application:', error);
    res.status(500).json({ status: 'error', message: 'Server error while processing your application.' });
  }
});

// GET: Fetch All Applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().sort({ submissionDate: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch applications' });
  }
});

// PUT: Update Application Status
router.put('/:id', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Interested', 'Not Interested'];
  
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id, 
      { status: status },
      { new: true }
    );

    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ status: 'success', data: app });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE: Remove Application
router.delete('/:id', async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    
    await Application.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server Error' });
  }
});

module.exports = router;