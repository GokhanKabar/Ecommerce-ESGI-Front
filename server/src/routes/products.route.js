const express = require('express');
const multer = require('multer');
const productController = require('../controllers/product.controller');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/products', productController.getProducts);
router.get('/products/men', productController.getMenProducts);
router.get('/products/women', productController.getWomenProducts);
router.get('/products/:id', productController.getProductById);
router.get('/products/family/:familyId', productController.getProductsByFamilyId);
router.post('/products', upload.single('image'), productController.createProduct);
router.put('/products/:id', upload.single('image'), productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/productsall', productController.getProductsAdmin);

module.exports = router;
