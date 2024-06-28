const express = require("express");
const multer = require("multer");
const path = require("path");
const productController = require("../controllers/product.controller");
const checkAuthRole = require("../middlewares/checkAuthRole");

// Set up multer storage to save files in the public/uploads directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById);
router.get("/products/category/:category", productController.getProductsByCategory);
router.get("/products/family/:familyId", productController.getProductsByFamilyId);
router.post(
  "/products",
  checkAuthRole({ roles: ['ADMIN'] }),
  upload.single("image"),
  productController.createProduct
);
router.put(
  "/products/:id",
  checkAuthRole({ roles: ['ADMIN'] }),
  upload.single("image"),
  productController.updateProduct
);
router.delete(
  "/products/:id",
  checkAuthRole({ roles: ['ADMIN'] }),
  productController.deleteProduct
);

module.exports = router;
