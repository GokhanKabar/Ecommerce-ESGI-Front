const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');
const checkAuthRole = require('../middlewares/checkAuthRole');

router.post('/', checkAuthRole({ roles: ['ADMIN'] }), brandController.createBrand);
router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrandById);
router.put('/:id', checkAuthRole({ roles: ['ADMIN'] }), brandController.updateBrand);
router.delete('/:id', checkAuthRole({ roles: ['ADMIN'] }), brandController.deleteBrand);
router.get('/admin', checkAuthRole({ roles: ['ADMIN'] }), brandController.getAllBrandsAdmin);

module.exports = router;
