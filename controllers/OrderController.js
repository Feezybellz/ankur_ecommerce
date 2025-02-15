const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const inputValidator = require("../utils/inputValidator");

/**
 * Place an Order (Checkout)
 */
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user cart
    const cart = await Cart.findOne({ userId }).populate(
      "cart_data.product",
      "name price stock"
    );

    if (!cart || cart.cart_data.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Your cart is empty" });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = cart.cart_data.map((item) => {
      totalAmount += item.product.price * item.quantity;
      return { product: item.product._id, quantity: item.quantity };
    });

    // Create new order
    const order = await Order.create({
      userId,
      items: orderItems,

      totalAmount,
      status: "pending",
    });

    // Clear user's cart after placing order
    // await Cart.findOneAndDelete({ userId });

    res.status(201).json({
      status: "success",
      message: "Order placed successfully",
      order_id: order._id,
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
 * Get User's Orders
 */
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId }).populate(
      "items.product",
      "name price"
    );

    res.json({ status: "success", orders });
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
 * Get All Orders
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.product", "name price");

    res.json({ status: "success", orders });
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
 * Update Order Status
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.paeams;
    const { status } = req.body;
    const validator = new inputValidator();
    validator
      .withMessage("Order ID is required", "orderId")
      .notEmpty(orderId, "orderId")
      .withMessage("Status is required", "status")
      .notEmpty(status, "status");

    if (!validator.isValid()) {
      const errors = validator.getErrors();
      return res
        .status(400)
        .json({ status: "error", message: "An error occured", errors });
    }

    if (
      !["pending", "processing", "shipped", "delivered", "cancelled"].includes(
        status
      )
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ status: "success", message: "Order status updated", order });
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
 * Cancel an Order (User or Admin)
 */
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }

    // Users can only cancel orders they placed, Admins can cancel any order
    if (order.userId.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ status: "error", message: "Unauthorized" });
    }

    order.status = "cancelled";
    await order.save();

    res.json({ status: "success", message: "Order cancelled", order });
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
