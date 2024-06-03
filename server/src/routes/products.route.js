const { getProducts } = require("../controllers/product.controller");
const express = require("express");

const productsRoutes = express.Router();

productsRoutes.get("/products", getProducts);

module.exports = productsRoutes;
