/**
 * Authentication middleware for JWT verification
 * @module middleware/auth
 */

// Environment configuration
require("dotenv").config();

// Third-party dependencies
const jwt = require("jsonwebtoken");

/**
 * Authenticates requests using JWT from Authorization header
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  // No authorization header present
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  // Extract token from Bearer scheme
  const token = authHeader.split(" ")[1];
  if (!token) {
    req.isAuth = false;
    return next();
  }

  // Verify JWT token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    req.isAuth = false;
    return next();
  }

  // Invalid decoded token
  if (!decoded) {
    req.isAuth = false;
    return next();
  }

  // Attach user ID and authentication status to request
  req.userId = decoded.userId;
  req.isAuth = true;
  next();
};
