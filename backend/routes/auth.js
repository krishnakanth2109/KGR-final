const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const Admin = require('../models/admin'); 
const transporter = require('../utils/mailer'); 
const authMiddleware = require('../middleware/authMiddleware'); // Import Middleware for protected routes

// ==========================================
//  1. AUTHENTICATION
// ==========================================

// @route   POST api/auth/register
// @desc    Register a new admin (One-time setup)
// @access  Public
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: 'Admin with this email already exists.' });
    }

    admin = new Admin({ 
        email, 
        password,
        name: name || 'Admin User' // Use provided name or default
    });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully. You can now log in.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate admin and get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    // Create and sign a JWT
    const payload = { admin: { id: admin.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(200).json({ 
        success: true, 
        token,
        admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email
        } 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ==========================================
//  2. PROFILE SETTINGS (Protected)
// ==========================================

// @route   GET api/auth/me
// @desc    Get current logged in admin details
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password -passwordResetOTP -passwordResetExpires');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/auth/update-profile
// @desc    Update Name or Email
router.put('/update-profile', authMiddleware, async (req, res) => {
  const { name, email } = req.body;
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // Check if email is being changed and if it's taken
    if (email && email !== admin.email) {
        const exists = await Admin.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already in use.' });
        admin.email = email;
    }

    if (name) admin.name = name;

    await admin.save();
    res.json({ message: 'Profile updated successfully', admin: { name: admin.name, email: admin.email } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/auth/change-password
// @desc    Change Password while logged in
router.put('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);

    await admin.save();
    res.json({ message: 'Password changed successfully.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ==========================================
//  3. PASSWORD RESET FLOW (Forgot Password)
// ==========================================

// @route   POST api/auth/forgot-password
// @desc    Generate and email an OTP
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            // Security: Don't reveal if email exists or not
            return res.status(200).json({ message: 'If an account with that email exists, an OTP has been sent.' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        admin.passwordResetOTP = otp;
        admin.passwordResetExpires = Date.now() + 600000; // 10 minutes
        await admin.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: admin.email,
            subject: 'Your Admin Password Reset OTP',
            text: `Your One-Time Password (OTP) for password reset is: ${otp}. It will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: `An OTP has been sent to ${admin.email}.` });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/verify-otp
// @desc    Verify the OTP code
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const admin = await Admin.findOne({
            email,
            passwordResetOTP: otp,
            passwordResetExpires: { $gt: Date.now() } // Check if not expired
        });

        if (!admin) {
            return res.status(400).json({ message: 'Invalid OTP or it has expired.' });
        }
        res.status(200).json({ message: 'OTP verified successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/reset-password
// @desc    Reset password using OTP (Final step)
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const admin = await Admin.findOne({
            email,
            passwordResetOTP: otp,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!admin) {
            return res.status(400).json({ message: 'Invalid session or OTP expired. Please try again.' });
        }

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);

        // Invalidate the OTP
        admin.passwordResetOTP = undefined;
        admin.passwordResetExpires = undefined;
        await admin.save();

        res.status(200).json({ message: 'Password has been successfully reset.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;