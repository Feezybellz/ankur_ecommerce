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

router.get("/orders", AuthMiddleware, AdminAuthMiddleware, getAllOrders);
router.get(
  "/order/update/:orderId",
  AuthMiddleware,
  AdminAuthMiddleware,
  updateOrderStatus
);

module.exports = router;
