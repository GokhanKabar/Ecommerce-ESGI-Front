const {
  getFamilies,
  getFamilyById,
} = require("../controllers/family.controller");
const express = require("express");

const familiesRoutes = express.Router();

familiesRoutes.get("/families", getFamilies);
familiesRoutes.get("/families/:id", getFamilyById);

module.exports = familiesRoutes;
