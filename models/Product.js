const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "ProductCategory" },
});

module.exports = mongoose.model("Product", ProductSchema);
