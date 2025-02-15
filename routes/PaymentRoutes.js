const express = require("express");
const { makePayment } = require("../controllers/PaymentController");

const router = express.Router();

router.post("/pay", makePayment);

module.exports = router;
