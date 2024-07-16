const express = require("express");
const router = express.Router();
const familyController = require("../controllers/family.controller");
const checkAuth = require("../middlewares/checkAuthRole");

router.get("/families", familyController.getAllFamilies);
router.get("/families/:id", familyController.getFamilyById);

router.post("/families", checkAuth({ roles: ['ADMIN'] }), familyController.createFamily);
router.put("/families/:id", checkAuth({ roles: ['ADMIN'] }), familyController.updateFamily);
router.delete("/families/:id", checkAuth({ roles: ['ADMIN'] }), familyController.deleteFamily);
router.get("/familiesall", checkAuth({ roles: ['ADMIN'] }), familyController.getAllFamiliesAdmin);

module.exports = router;
