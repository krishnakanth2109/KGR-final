const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['info', 'warning', 'alert', 'success'], 
        default: 'info' 
    },
    audience: { 
        type: String, 
        enum: ['all', 'students', 'faculty'], 
        default: 'all' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// --- THE FIX IS HERE ---
// Check mongoose.models.Notification first. If it exists, use it. If not, create it.
module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);