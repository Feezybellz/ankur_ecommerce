const express = require("express");
const {
  getProducts,
  getProduct,
  createProductCategory,
  addProduct,
} = require("../controllers/ProductController");
const AdminAuthMiddleware = require("../controllers/AdminAuthMiddleware");

const router = express.Router();

router.post(
  "/create-product-category",
  AdminAuthMiddleware,
  createProductCategory
);

module.exports = router;
