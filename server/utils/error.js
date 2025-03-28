/**
 * Custom error handling class
 * @module utils/error
 */

/**
 * Custom application error class
 * @class
 * @extends Error
 */
class AppError extends Error {
  /**
   * Create custom error
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   * @param {Object} data - Additional error data
   */
  constructor(message, status = 500, data = null) {
    super(message);
    this.status = status;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { AppError };
