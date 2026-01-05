// --- START OF FILE backend/middleware/authMiddleware.js ---
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // 1. Get the token from the header
  const token = req.header('x-auth-token');

  // ----------------------------------------------------
  // REMOVED PROTECTION: ALLOW REQUESTS WITHOUT TOKEN
  // ----------------------------------------------------
  if (!token) {
    // Instead of returning 401, we just move to the next function.
    // This allows public access to routes using this middleware.
    return next(); 
  }

  // 2. Verify the token (if it exists)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info if valid
    if (decoded.admin) {
        req.admin = decoded.admin;
        req.userType = 'admin';
    } 
    
    if (decoded.student) {
        req.student = decoded.student;
        req.userType = 'student';
    }

    next();
  } catch (err) {
    // If token is invalid/expired, we LOG it but DO NOT BLOCK the request.
    console.log("Auth Warning: Invalid token received, but proceeding anyway.");
    next(); 
  }
};

module.exports = authMiddleware;