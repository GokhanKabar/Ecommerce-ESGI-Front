const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sequelizeId: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    concentration: {
      type: String,
      required: true,
    },
    promotion: {
      type: Number,
      required: true,
    },
    image: String,
    dateAdded: Date,
    dateUpdated: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    brand: {
      type: new mongoose.Schema(
        {
          id: Number,
          name: String,
        },
        { _id: false }
      ),
      default: null,
    },
    family: {
      type: new mongoose.Schema(
        {
          id: Number,
          name: String,
        },
        { _id: false }
      ),
      default: null,
    },
  },
  { timestamps: true }
);

const ProductMongo = mongoose.model("Product", productSchema);
module.exports = ProductMongo;
