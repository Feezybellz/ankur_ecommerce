const Cart = require("../models/Cart");
const Product = require("../models/Product");
const inputValidator = require("../utils/inputValidator");

/**
 * Add item to cart
 */
exports.addToCart = async (req, res) => {
  try {
    let { quantity } = req.body;
    const { productId } = req.body;

    const validator = new inputValidator();
    validator
      .withMessage("Quantity is required", "quantity")
      .notEmpty(quantity, "quantity")
      .withMessage("Quantity must be a number", "quantity")
      .isNumber(quantity, "quantity");

    if (!validator.isValid()) {
      const errors = validator.getErrors();
      return res
        .status(400)
        .json({ status: "error", message: "An error occured", errors });
    }
    quantity = parseInt(quantity);
    if (quantity < 1) {
      return res.status(400).json({
        status: "error",
        message: "Quantity must be at least 1",
      });
    }
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        status: "error",
        message: "Quantity exceeds available stock",
        available_stock: product.stock,
      });
    }
    // Find the user's cart or create a new one
    let cart = await Cart.findOne({ userId }).select("cart_data");

    if (!cart) {
      cart = new Cart({ userId, cart_data: [{ productId, quantity }] });
    } else {
      // Check if product already exists in cart
      const productIndex = cart.cart_data.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex > -1) {
        cart.cart_data[productIndex].quantity = quantity; // Increase quantity
      } else {
        cart.cart_data.push({ productId, quantity }); // Add new product
      }
    }

    await cart.save();
    res.json({
      status: "success",
      message: "Product added to cart",
      cart: {
        cart_data: cart.cart_data,
      },
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
 * View cart items
 */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId })
      .populate("cart_data.product", "name price stock image")
      .select("cart_data -_id");

    if (!cart) {
      return res.json({
        status: "success",
        message: "Cart is empty",
        cart: [],
      });
    }

    res.json({ status: "success", cart });
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
 * Update cart item quantity
 */
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }

    const productIndex = cart.cart_data.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not in cart" });
    }

    cart.cart_data[productIndex].quantity = quantity;
    await cart.save();

    res.json({ status: "success", message: "Cart updated successfully", cart });
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
 * Remove item from cart
 */
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }

    const peoductCheck = cart.cart_data.find(
      (item) => item.productId.toString() === productId
    );
    if (!peoductCheck) {
      return res
        .status(404)
        .json({ status: "error", message: "Product does not exist in cart" });
    }

    cart.cart_data = cart.cart_data.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.json({ status: "success", message: "Product removed from cart", cart });
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
 * Clear entire cart
 */
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.findOneAndDelete({ userId });

    res.json({ status: "success", message: "Cart cleared successfully" });
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
