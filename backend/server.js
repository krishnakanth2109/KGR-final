// --- START OF FILE server.js ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Import HTTP
const { Server } = require('socket.io'); // Import Socket.io
require('dotenv').config();

const app = express();
const server = http.createServer(app); // Create HTTP server
const uploadRoutes = require('./routes/upload');
// --- 1. CORS Configuration ---
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://kgr-college.netlify.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store io instance in app to use in routes
app.set('io', io);

// Socket Connection Logic
io.on('connection', (socket) => {
  console.log('⚡ New client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// --- 2. Middleware ---
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- 3. MongoDB Connection ---
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('✅ MongoDB connection established successfully!'))
.catch((err) => { 
    console.error('❌ MongoDB connection error:', err); 
    process.exit(1);
});

// --- 4. API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/admissions', require('./routes/admissions'));
app.use('/api/students', require('./routes/students'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/fee-structures', require('./routes/feeStructureRoutes')); 
app.use('/api/student-fees', require('./routes/studentFees')); 
app.use('/api/documents', require('./routes/studentDocuments'));
app.use('/api/exams', require('./routes/studentExams')); 
// NEW: Notifications Route
app.use('/api/notifications', require('./routes/notifications')); 
app.use('/api/upload', uploadRoutes);
// --- 5. Start Server (Use server.listen instead of app.listen) ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server with WebSockets is running on port ${PORT}`);
});