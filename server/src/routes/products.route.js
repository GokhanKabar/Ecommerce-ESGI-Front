const {
  getProducts,
  getMenProducts,
  getWomenProducts,
  getProductById,
  getProductsByFamilyId,
} = require("../controllers/product.controller");
const express = require("express");

const productsRoutes = express.Router();

productsRoutes.get("/products", getProducts);
productsRoutes.get("/products/men", getMenProducts);
productsRoutes.get("/products/women", getWomenProducts);
productsRoutes.get("/products/:id", getProductById);
productsRoutes.get("/products/family/:familyId", getProductsByFamilyId);

module.exports = productsRoutes;
