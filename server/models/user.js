/**
 * User model definition
 * @module models/user
 */

// Environment configuration
require("dotenv").config();

// Third-party dependencies
const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => isEmail(value),
        message: "Invalid email address format",
      },
      // validate: {
      //   validator: (v) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
      //   message: props => `${props.value} is not a valid email address!`
      // },
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [5, "Password must be at least 5 characters"],
      // select: false,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [30, "Name cannot exceed 30 characters"],
    },
    status: {
      type: String,
      default: "I am new!",
      trim: true,
      maxlength: [150, "Status cannot exceed 150 characters"],
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Pre-save hook for password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
