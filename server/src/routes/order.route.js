const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
//const checkUserPermissions = require('../middlewares/checkUserPermissionOrder');



router.post('/createOrder',orderController.createOrder);
router.get('/getAllOrders',orderController.getAllOrders);
router.get('/getOrder/:id', orderController.getOrderById);
router.put('/updateOrder/:id', orderController.updateOrder);
router.delete('/deleteOrder/:id', orderController.deleteOrder);
router.get('/getOrderByUser/:id', orderController.getOrdersByUser);
router.get('/getOrderDetails/:id', orderController.getOrderDetails);


module.exports = router;