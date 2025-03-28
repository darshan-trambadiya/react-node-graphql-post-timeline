/**
 * Centralized application constants and configurations
 * @module utils/constants
 */

module.exports = {
  // HTTP status codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_ERROR: 500,
  },

  // Application-specific error messages
  APP_ERRORS: {
    UNAUTHENTICATED: "Unauthenticated request",
    FILE: {
      NO_FILE: "No file provided",
      NOT_FOUND: "File does not exist",
      INVALID_PATH: "Invalid file path",
      DELETION_FAILED: "File deletion failed",
    },
    EMAIL: {
      REQUIRED: "Email is required",
      INVALID_EMAIL: "Invalid Email",
    },
    PASSWORD: {
      REQUIRED: "Password is required",
      INVALID_PASSWORD_MIN_LENGTH: "Password too short!",
    },
    USER: {
      EXISTS: "User already exists",
      NOT_FOUND: "User not found",
      INCORRECT_PASSWORD: "Incorrect Password",
      NOT_AUTHORIZED: "Not authorized",
    },
    POST: {
      NOT_FOUND: "Post not found",
      TITLE_REQUIRED: "Title is required",
      INVALID_TITLE_MIN_LENGTH: "Title must be at least 5 characters",
      INVALID_TITLE_MAX_LENGTH: "Title cannot exceed 50 characters",
      CONTENT_REQUIRED: "Content is required",
      INVALID_CONTENT_MIN_LENGTH: "Content must be at least 5 characters",
      INVALID_CONTENT_MAX_LENGTH: "Content cannot exceed 5000 characters",
    },
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    ITEMS_PER_PAGE: 2,
  },
};
