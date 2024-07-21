const express = require("express");
const multer = require("multer");
const path = require("path");
const productController = require("../controllers/product.controller");
const checkAuth = require("../middlewares/checkAuthRole");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers image sont autorisés'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

router.get("/search", productController.searchProducts);
router.get("/products", productController.getProducts);
router.get("/promotionalProducts", productController.getPromotionalProducts);
router.get("/products/:id", productController.getProductById);
router.get("/products/category/:category", productController.getProductsByCategory);
router.get("/products/family/:familyId", productController.getProductsByFamilyId);

router.post("/products", checkAuth({ roles: ['ADMIN'] }), upload.single("image"), productController.createProduct);
router.put("/products/:id", checkAuth({ roles: ['ADMIN'] }), upload.single("image"), productController.updateProduct);
router.get("/productsall", checkAuth({ roles: ['ADMIN'] }), productController.getProductsAdmin);
router.delete("/products/:id", checkAuth({ roles: ['ADMIN'] }), productController.deleteProduct);

module.exports = router;
