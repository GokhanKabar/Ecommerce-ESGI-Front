const express = require('express');
const router = express.Router();
const familyController = require('../controllers/family.controller');

router.post('/families', familyController.createFamily);
router.get('/families', familyController.getAllFamilies);
router.get('/families/:id', familyController.getFamilyById);
router.put('/families/:id', familyController.updateFamily);
router.delete('/families/:id', familyController.deleteFamily);

module.exports = router;
