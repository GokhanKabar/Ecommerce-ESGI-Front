const { getBrands, getBrandById } = require("../controllers/brand.controller");
const express = require("express");

const brandsRoutes = express.Router();

brandsRoutes.get("/brands", getBrands);
brandsRoutes.get("/brands/:id", getBrandById);

module.exports = brandsRoutes;
