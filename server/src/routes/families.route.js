const express = require('express');
const router = express.Router();
const familyController = require('../controllers/family.controller');
const checkAuthRole = require('../middlewares/checkAuthRole');

router.post('/', checkAuthRole({ roles: ['ADMIN'] }), familyController.createFamily);
router.get('/', familyController.getAllFamilies);
router.get('/:id', familyController.getFamilyById);
router.put('/:id', checkAuthRole({ roles: ['ADMIN'] }), familyController.updateFamily);
router.delete('/:id', checkAuthRole({ roles: ['ADMIN'] }), familyController.deleteFamily);
router.get('/admin', checkAuthRole({ roles: ['ADMIN'] }), familyController.getAllFamiliesAdmin);

module.exports = router;
