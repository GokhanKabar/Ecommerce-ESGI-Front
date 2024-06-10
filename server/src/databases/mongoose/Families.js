const mongoose = require("mongoose");

const familySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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

// Pre-save hook to update the `updatedAt` field
familySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Family = mongoose.model("Family", familySchema);

module.exports = Family;
