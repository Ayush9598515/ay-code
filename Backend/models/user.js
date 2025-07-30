const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  subscriptionPlan: {
    type: String,
    enum: ["Free", "Basic", "Premium"],
    default: "Free",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;

