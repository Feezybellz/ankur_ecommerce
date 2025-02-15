const Product = require("../models/Product");
const ProductCategory = require("../models/ProductCategory");

const inputValidator = require("../utils/inputValidator");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProductCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const validator = new inputValidator();

    validator
      .withMessage("Category name is required", "name")
      .notEmpty(name, "name");

    if (!validator.isValid()) {
      const errors = validator.getErrors();
      return res
        .status(400)
        .json({ status: "error", message: "An error occured", errors });
    }

    const category_exist = await ProductCategory.findOne({ name });

    if (category_exist) {
      return res.json({
        status: "error",
        message: "Category name exist.",
      });
    }

    const category = new ProductCategory({ name });
    await category.save();
    return res.json({
      status: "success",
      message: "Category created successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ status: "error", message: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    const product = new Product({
      name,
      description,
      price,
      category,
      image,
    });
    await product.save();
    res.json({
      status: "success",
      message: "Product added successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
