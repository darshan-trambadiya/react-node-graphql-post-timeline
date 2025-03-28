/**
 * Main application entry point
 * @module app
 */

// Environment configuration
require("dotenv").config();

// Native modules
const path = require("path");
const fs = require("fs");

// Third-party dependencies
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { createHandler } = require("graphql-http/lib/use/express");

// Application components
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const authMiddleware = require("./middleware/auth");
const { clearImage } = require("./utils/helpers");
const { APP_ERRORS, HTTP_STATUS } = require("./utils/constants");

// Constants
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING;
const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const UPLOAD_DIR_NAME = "images";
const UPLOAD_DIR = path.join(__dirname, UPLOAD_DIR_NAME);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Initialize Express application
const app = express();

/**
 * Ensures upload directory exists
 * @async
 */
const ensureUploadDir = async () => {
  try {
    await fs.promises.access(UPLOAD_DIR, fs.constants.F_OK);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });
      console.log(`=========> ✅ Created upload directory: ${UPLOAD_DIR}`);
    } else {
      throw err;
    }
  }
};

/**
 * Multer configuration for file uploads
 * @constant {Object}
 */
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR_NAME),
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname
      .replace(/[^a-z0-9.]/gi, "_")
      .toLowerCase();
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    cb(null, `${timestamp}-${sanitizedFilename}`);
  },
});

/**
 * File filter for Multer
 * @param {Object} file - Uploaded file object
 */
const fileFilter = (req, file, cb) =>
  cb(null, IMAGE_MIME_TYPES.includes(file.mimetype));

// Middleware chain
app.use(express.json()); // Built-in Express JSON parser

// File upload handling
app.use(
  multer({
    storage: fileStorage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
  }).single("image")
);

// Static files serving with cache control
app.use(
  "/images",
  express.static(UPLOAD_DIR, {
    maxAge: "1d",
    immutable: true,
  })
);

// CORS configuration
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
  });

  // Pre-flight request handling
  req.method === "OPTIONS" ? res.sendStatus(204) : next();
});

// Authentication middleware
app.use(authMiddleware);

/**
 * Image upload endpoint
 * @name PUT /post-image
 * @function
 */
app.put("/post-image", async (req, res) => {
  if (!req.isAuth) {
    throw new AppError(APP_ERRORS.UNAUTHENTICATED, HTTP_STATUS.UNAUTHORIZED);
  }

  if (!req.file) {
    throw new AppError(
      APP_ERRORS.FILE.NO_FILE,
      HTTP_STATUS.UNPROCESSABLE_ENTITY
    );
  }

  if (req.body.oldPath) {
    await clearImage(req.body.oldPath);
  }

  return res.status(HTTP_STATUS.CREATED).json({
    message: "File stored successfully",
    filePath: req.file.path.replace(/\\/g, "/"), // Normalize path for Windows
  });
});

// GraphQL endpoint configuration
app.all(
  "/graphql",
  createHandler({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: process.env.NODE_ENV === "development",
    context: (context) => ({
      isAuth: context.raw.isAuth,
      userId: context.raw.userId,
      context,
    }),
    formatError: (err) => ({
      message: err.message,
      status: err.originalError?.code || HTTP_STATUS.INTERNAL_ERROR,
      data: err.originalError?.data,
      locations: err.locations,
      path: err.path,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    }),
  })
);

/**
 * Global error handler middleware
 * @param {Error} error - Error object
 */
app.use((error, req, res, next) => {
  const status = error.statusCode || error.status || HTTP_STATUS.INTERNAL_ERROR;
  const response = {
    message: error.message,
    ...(error.data && { data: error.data }),
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  if (process.env.NODE_ENV === "development") {
    console.error(`[${new Date().toISOString()}] Error:`, error);
  }

  res.status(status).json(response);
});

// Database connection and server startup
const startServer = async () => {
  try {
    // Ensure upload directory exists first
    await ensureUploadDir();

    await mongoose.connect(MONGODB_URI);

    app.listen(PORT, () =>
      console.log(
        `=========> ✅ Server operational on port ${PORT}\nDatabase connected: ${mongoose.connection.host}`
      )
    );
  } catch (err) {
    console.error("=========> ❌ Server startup error:", err);
    process.exit(1);
  }
};

// Initialize application
startServer();
