const mongoose = require('mongoose');

const familySchema = new mongoose.Schema(
  {
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
    products: [
      {
        id: Number,
        name: String,
        description: String,
        category: String,
        price: Number,
        stock: Number,
        concentration: String,
        promotion: Boolean,
        image: String,
      }
    ],
  },
  { timestamps: true }
);

const Family = mongoose.model('Family', familySchema);
module.exports = Family;
