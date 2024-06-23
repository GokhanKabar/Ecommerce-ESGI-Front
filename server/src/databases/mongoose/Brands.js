const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    sequelizeId: {
      type: Number,
      required: true,
    },
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
    products: [{
      type: Object, 
      required: true,
    }],
  },
  { timestamps: true }
);

const BrandMongo = mongoose.model("Brand", brandSchema);

module.exports = BrandMongo;
