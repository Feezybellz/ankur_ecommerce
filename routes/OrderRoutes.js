const express = require("express");
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/OrderController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const AdminAuthMiddleware = require("../middleware/AdminAuthMiddleware");

const router = express.Router();

router.getUserOrders = getUserOrders;
router.post("/place", AuthMiddleware, placeOrder); // Users place an order
router.put("/update", AdminAuthMiddleware, updateOrderStatus); // Admin update order status
router.put("/cancel", AuthMiddleware, cancelOrder); // Users/admin cancel order

module.exports = router;
