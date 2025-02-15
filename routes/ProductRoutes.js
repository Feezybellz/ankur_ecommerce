const express = require("express");

const {
  getProducts,
  getProduct,
  addProduct,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
} = require("../controllers/ProductController");

const AuthMiddleware = require("../middleware/AuthMiddleware");
const AdminAuthMiddleware = require("../middleware/AdminAuthMiddleware");

const router = express.Router();
router.getProducts = getProducts;

router.get("/:id", getProduct);
router.post(
  "/category/add",
  AuthMiddleware,
  AdminAuthMiddleware,
  createProductCategory
);
router.post(
  "/category/:id",
  AuthMiddleware,
  AdminAuthMiddleware,
  updateProductCategory
);
router.delete(
  "/category/:id",
  AuthMiddleware,
  AdminAuthMiddleware,
  deleteProductCategory
);
router.post("/add", AuthMiddleware, AdminAuthMiddleware, addProduct);

module.exports = router;
