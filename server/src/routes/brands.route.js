const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');
const checkAuth = require('../middlewares/checkAuthRole');

router.get('/brands', brandController.getAllBrands);
router.get('/brands/:id', brandController.getBrandById);

router.post('/brands', checkAuth({ roles: ['ADMIN'] }), brandController.createBrand);
router.put('/brands/:id', checkAuth({ roles: ['ADMIN'] }), brandController.updateBrand);
router.delete('/brands/:id', checkAuth({ roles: ['ADMIN'] }), brandController.deleteBrand);
router.get('/brandsall', checkAuth({ roles: ['ADMIN'] }), brandController.getAllBrandsAdmin);

module.exports = router;
