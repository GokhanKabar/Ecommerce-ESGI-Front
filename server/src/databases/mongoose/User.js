const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  sequelizeId: {
    type: Number,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: false,
  },
  accountConfirmation: {
    type: Boolean,
    default: false,
  },
  emailToken: {
    type: String,
    required: false,
  },
  emailTokenExpiration: {
    type: Date,
    required: false,
  },
  resetToken: {
    type: String,
    required: false,
  },
  resetTokenExpiration: {
    type: Date,
    required: false,
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  lastPasswordChange: {
    type: Date,
    required: false,
  },
  lockedUntil: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
