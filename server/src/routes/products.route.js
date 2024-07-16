const express = require("express");
const multer = require("multer");
const productController = require("../controllers/product.controller");
const checkAuth = require("../middlewares/checkAuthRole");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/search", productController.searchProducts);
router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById);
router.get("/products/category/:category", productController.getProductsByCategory);
router.get("/products/family/:familyId", productController.getProductsByFamilyId);

router.post("/products", checkAuth({ roles: ['ADMIN'] }), upload.single("image"), productController.createProduct);
router.put("/products/:id", checkAuth({ roles: ['ADMIN'] }), upload.single("image"), productController.updateProduct);
router.get("/productsall", checkAuth({ roles: ['ADMIN'] }), productController.getProductsAdmin);
router.delete("/products/:id", checkAuth({ roles: ['ADMIN'] }), productController.deleteProduct);

module.exports = router;
