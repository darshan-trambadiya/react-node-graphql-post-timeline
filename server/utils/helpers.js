/**
 * Centralized application helper functions
 * @module utils/helpers
 */

// Native modules
const path = require("path");
const { unlink, access, constants } = require("fs/promises");

// Third-party dependencies
const validator = require("validator");

// Utils
const { AppError } = require("./error");
const { HTTP_STATUS, APP_ERRORS } = require("./constants");

// Constants
const UPLOAD_DIR = path.join(__dirname, "..", "images");

/**
 * Safely deletes a file from the filesystem
 * @async
 * @param {string} filePath - Relative path to the file from upload directory
 * @returns {Promise<boolean>} True if deletion succeeded, false otherwise
 * @throws {Error} If invalid path or deletion error occurs
 */
const clearImage = async (filePath) => {
  try {
    // Validate and sanitize input path
    const sanitizedPath = path
      .normalize(filePath)
      .replace(/^(\.\.(\/|\\|$))+/, "");
    const absolutePath = path.join(__dirname, "..", sanitizedPath);

    // Security check to prevent directory traversal
    if (!absolutePath.startsWith(UPLOAD_DIR)) {
      throw new AppError(APP_ERRORS.FILE.INVALID_PATH, HTTP_STATUS.FORBIDDEN);
    }

    // Check file existence before deletion
    await access(absolutePath, constants.F_OK);

    // Perform deletion
    await unlink(absolutePath);

    if (process.env.NODE_ENV === "development") {
      console.log(
        `[${new Date().toISOString()}] Deleted file: ${absolutePath}`
      );
    }
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(APP_ERRORS.FILE.NOT_FOUND);
    }

    const errorMessage = `${APP_ERRORS.FILE.DELETION_FAILED}: ${error.message}`;
    console.error(`[${new Date().toISOString()}] ${errorMessage}`);
    throw new Error(errorMessage);
  }
};

/**
 * Validate Email
 */
const validateEmail = (email) => {
  if (validator.isEmpty(email.trim())) {
    throw new AppError(
      APP_ERRORS.EMAIL.REQUIRED,
      HTTP_STATUS.UNPROCESSABLE_ENTITY
    );
  }
  if (!validator.isEmail(email)) {
    throw new AppError(
      APP_ERRORS.EMAIL.INVALID_EMAIL,
      HTTP_STATUS.UNPROCESSABLE_ENTITY
    );
  }
};

/**
 * Validate Password
 */
const validatePassword = (password) => {
  if (validator.isEmpty(password.trim())) {
    throw new AppError(
      APP_ERRORS.PASSWORD.REQUIRED,
      HTTP_STATUS.UNPROCESSABLE_ENTITY
    );
  }
  if (!validator.isLength(password, { min: 5 })) {
    throw new AppError(
      APP_ERRORS.PASSWORD.INVALID_PASSWORD_MIN_LENGTH,
      HTTP_STATUS.UNPROCESSABLE_ENTITY
    );
  }
};

/**
 * Validate Post Input Data
 */
const validatePostInput = (input) => {
  const errors = [];
  if (validator.isEmpty(input.title.trim())) {
    errors.push(APP_ERRORS.POST.TITLE_REQUIRED);
  }
  if (!validator.isLength(input.title.trim(), { min: 5 })) {
    errors.push(APP_ERRORS.POST.INVALID_TITLE_MIN_LENGTH);
  }
  if (!validator.isLength(input.title.trim(), { max: 50 })) {
    errors.push(APP_ERRORS.POST.INVALID_TITLE_MAX_LENGTH);
  }
  if (validator.isEmpty(input.content.trim())) {
    errors.push(APP_ERRORS.POST.CONTENT_REQUIRED);
  }
  if (!validator.isLength(input.content.trim(), { min: 5 })) {
    errors.push(APP_ERRORS.POST.INVALID_CONTENT_MIN_LENGTH);
  }
  if (!validator.isLength(input.content.trim(), { max: 5000 })) {
    errors.push(APP_ERRORS.POST.INVALID_CONTENT_MAX_LENGTH);
  }

  if (errors.length > 0) {
    throw new AppError("Invalid post input", HTTP_STATUS.UNPROCESSABLE_ENTITY, {
      errors,
    });
  }
};

module.exports = {
  clearImage,
  validateEmail,
  validatePassword,
  validatePostInput,
};
