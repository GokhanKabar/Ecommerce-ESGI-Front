const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const checkAuth = require("../middlewares/checkAuthRole");
const checkUserPermissionsOrder = require('../middlewares/checkUserPermissionOrder');
const checkPermissionsOrdersByUser = require('../middlewares/checkPermissionOrderByUser');

router.post("/createOrder", checkAuth({ roles: ['USER'] }), orderController.createOrder);
router.get("/getAllOrders", checkAuth({ roles: ['ADMIN'] }), orderController.getAllOrders);
router.get("/getOrder/:id", checkUserPermissionsOrder(), orderController.getOrderById);
router.put("/updateOrder/:id", checkUserPermissionsOrder(), orderController.updateOrder);
router.delete("/deleteOrder/:id", checkAuth({ roles: ['ADMIN'] }), orderController.deleteOrder);
router.get("/getOrderByUser/:id", checkPermissionsOrdersByUser(), orderController.getOrdersByUser);
router.get("/getOrderDetails/:id", checkUserPermissionsOrder(), orderController.getOrderDetails);

module.exports = router;
