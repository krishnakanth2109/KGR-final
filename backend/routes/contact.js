// --- START OF FILE backend/routes/contact.js ---

const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const Notification = require('../models/Notification'); // Import Notification Model

// GET all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ _id: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// POST new message
router.post('/', async (req, res) => {
  const { fullName, email, message } = req.body;

  try {
    const newContact = new Contact({
      fullName,
      email,
      message
    });

    await newContact.save();

    // --- NEW: Create Notification ---
    const newNotif = new Notification({
        title: 'New Contact Message',
        message: `Message from ${fullName}: ${message.substring(0, 30)}...`,
        type: 'contact'
    });
    await newNotif.save();

    // --- NEW: Emit Socket Event ---
    const io = req.app.get('io');
    io.emit('new-notification', newNotif);

    res.json(newContact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;