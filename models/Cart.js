const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cart_data: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, default: 1, min: 1 },
    },
  ],
});

CartSchema.virtual("cart_data.product", {
  ref: "Product",
  localField: "cart_data.productId",
  foreignField: "_id",
  justOne: true,
});

// Ensure virtuals are included in JSON responses
CartSchema.set("toJSON", { virtuals: true });
CartSchema.set("toObject", { virtuals: true });
module.exports = mongoose.model("Cart", CartSchema);
