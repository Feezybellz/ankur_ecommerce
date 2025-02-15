const express = require("express");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/CartController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

const router = express.Router();

router.get("/", AuthMiddleware, getCart);
router.post("/add", AuthMiddleware, addToCart);
router.post("/update", AuthMiddleware, updateCartItem);
router.delete("/remove", AuthMiddleware, removeFromCart);
router.delete("/clear", AuthMiddleware, clearCart);

module.exports = router;
