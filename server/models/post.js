/**
 * Post model definition and configuration
 * @module models/post
 */

// Third-party dependencies
const mongoose = require("mongoose");
// const { isURL } = require('validator');

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [50, "Title cannot exceed 50 characters"],
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      minlength: [5, "Content must be at least 5 characters"],
      maxlength: [5000, "Content cannot exceed 5000 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      // validate: {
      //   validator: value => isURL(value, {
      //     protocols: ['http', 'https'],
      //     require_protocol: true,
      //     require_valid_protocol: true
      //   }),
      //   message: 'Invalid image URL format'
      // }
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator reference is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ createdAt: -1 });

module.exports = mongoose.models.Post || mongoose.model("Post", postSchema);
