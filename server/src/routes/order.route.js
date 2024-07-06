const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');


router.post('/addOrder',orderController.createOrder);
router.get('/getAllOrders',orderController.getAllOrders);
router.get('/getOrder/:id', orderController.getOrderById);
router.put('/updateOrder/:id', brandController.updateBrand);
router.delete('/deleteOrder/:id', brandController.deleteBrand);
router.get('/OrderClient/:id', brandController.getAllBrandsAdmin);


module.exports = router;