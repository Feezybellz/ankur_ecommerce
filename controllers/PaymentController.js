const Flutterwave = require("flutterwave-node-v3");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const Order = require("../models/Order");
const Transaction = require("../models/Transaction");
const inputValidator = require("../utils/inputValidator");

dotenv.config();

const encryptionKey = process.env.FLW_ENCRYPTION_KEY;

// Initialize Flutterwave
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

/**
 * Process Payment (Initialize Payment)
 */
exports.processPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const validator = new inputValidator();

    validator
      .withMessage("Order ID is required", "orderId")
      .notEmpty(orderId, "orderId");

    if (!validator.isValid()) {
      const errors = validator.getErrors();
      return res
        .status(400)
        .json({ status: "error", message: "An error occured", errors });
    }

    const userId = req.user.id;

    // Find the order
    const order = await Order.findById(orderId).populate(
      "items.product",
      "name price"
    );
    if (!order) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }

    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ status: "error", message: "Unauthorized" });
    }

    // Generate transaction reference
    const transactionRef = `TX-${Date.now()}`;

    const flw_res = await fetch(process.env.FLW_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      },
      body: JSON.stringify({
        tx_ref: transactionRef,
        amount: order.totalAmount,
        currency: "NGN",
        redirect_url: `${process.env.APP_PROTOCOL}://${process.env.APP_DOMAIN}/api/payment/verify`,
        payment_options: "card",
        customer: {
          email: req.user.email,
          phonenumber: req.user.phoneNumber,
          name: req.user.fullName,
        },
        customizations: {
          title: "Order Payment",
          description: "Payment for items in cart",
          logo: "https://assets.piedpiper.com/logo.png",
        },
      }),
    });

    const flw_response = await flw_res.json();

    // Save transaction record
    await Transaction.create({
      userId,
      orderId,
      products: order.items,
      amount: order.totalAmount,
      status: "pending",
      transactionId: transactionRef,
      paymentMethod: "flutterwave",
    });

    res.json({
      status: "success",
      message: "Payment initialized",
      transaction_id: transactionRef,
      redirect_url: flw_response.data.link,
    });
  } catch (error) {
    const response = {
      status: "error",
      message: "An error occured",
    };
    if (process.env.APP_ENV === "development") {
      response.error_message = error.message;
    }
    res.status(500).json(response);
  }
};

/**
 * Verify Payment
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { transaction_id, tx_ref } = req.query;
    const validator = new inputValidator();

    validator
      .withMessage("Transaction ID is required", "transaction_id")
      .notEmpty(transaction_id, "transaction_id")
      .withMessage("Transaction reference is required", "tx_ref")
      .notEmpty(tx_ref, "tx_ref");

    if (!validator.isValid()) {
      const errors = validator.getErrors();
      return res
        .status(400)
        .json({ status: "error", message: "An error occured", errors });
    }

    const transaction = await Transaction.findOne({ transactionId: tx_ref });
    if (!transaction) {
      return res
        .status(404)
        .json({ status: "error", message: "Transaction not found" });
    }

    const orderId = transaction.orderId;

    // Verify Flutterwave Payment
    const response = await flw.Transaction.verify({ id: transaction_id });

    if (response.status !== "success") {
      await Transaction.findOneAndUpdate(
        { transactionId: transaction_id },
        { status: "failed" }
      );
      return res
        .status(400)
        .json({ status: "error", message: "Payment verification failed" });
    }

    // Update Order & Transaction Status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: "processing" },
      { new: true }
    );

    await Transaction.findOneAndUpdate(
      { transactionId: tx_ref },
      { status: "successful" }
    );

    res.json({
      status: "success",
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    const response = {
      status: "error",
      message: "An error occured",
    };
    if (process.env.APP_ENV === "development") {
      response.error_message = error.message;
    }
    res.status(500).json(response);
  }
};

/**
 * Flutterwave Webhook (Handle Payment Events)
 */
exports.flutterwaveWebhook = async (req, res) => {
  try {
    const event = req.body;
    if (
      event.event === "charge.completed" &&
      event.data.status === "successful"
    ) {
      const transactionId = event.data.tx_ref;
      const transaction = await Transaction.findOne({ transactionId: tx_ref });
      const orderId = transaction.orderId;

      // Update order status
      await Order.findByIdAndUpdate(orderId, { status: "processing" });

      // Update transaction status
      await Transaction.findOneAndUpdate(
        { transactionId },
        { status: "successful" }
      );
    } else if (
      event.event === "charge.failed" ||
      event.data.status === "failed"
    ) {
      const transactionId = event.data.tx_ref;
      const transaction = await Transaction.findOne({ transactionId: tx_ref });
      const orderId = transaction.orderId;

      // Update order status
      await Order.findByIdAndUpdate(orderId, { status: "failed" });

      // Update transaction status
      await Transaction.findOneAndUpdate(
        { transactionId },
        { status: "failed" }
      );
    }

    res.sendStatus(200);
  } catch (error) {
    const response = {
      status: "error",
      message: "An error occured",
    };
    if (process.env.APP_ENV === "development") {
      response.error_message = error.message;
    }
    res.status(500).json(response);
  }
};
