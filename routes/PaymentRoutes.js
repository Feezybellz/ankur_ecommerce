const express = require("express");
const {
  processPayment,
  verifyPayment,
  flutterwaveWebhook,
} = require("../controllers/PaymentController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/pay/:orderId", AuthMiddleware, processPayment);
router.get("/verify", verifyPayment);
router.post("/webhook", flutterwaveWebhook);

module.exports = router;
