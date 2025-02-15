const Product = require("../models/Product");
const ProductCategory = require("../models/ProductCategory");

const inputValidator = require("../utils/inputValidator");

exports.getProducts = async (req, res) => {
  // get products with pagination
  try {
    const page = req.params.page || 1;
    const limit = 2;

    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    // Calculate the number of items to skip based on the current page
    const skip = (pageNumber - 1) * pageLimit;

    // Fetch the content with pagination
    const products = await Product.find()
      .skip(skip)
      .limit(pageLimit)
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    // Get the total number of contents for pagination
    const totalProducts = await Product.countDocuments();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalProducts / pageLimit);

    const response = {
      status: "success",
      products,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalProducts,
        pageLimit: pageLimit,
      },
    };

    res.status(200).json(response);
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

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
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
      category_id: category._id,
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

exports.updateProductCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const categoryId = req.params.id;
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

    const category = await ProductCategory.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ status: "error", message: "Category not found" });
    }

    category.name = name;
    await category.save();
    res.json({
      status: "success",
      message: "Category updated successfully",
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

exports.deleteProductCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findByIdAndDelete(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ status: "error", message: "Category not found" });
    }

    res.json({ status: "success", message: "Category deleted successfully" });
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

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      stock,
      price,
      category = null,
      image,
    } = req.body;
    const validator = new inputValidator();

    validator
      .withMessage("Product name is required", "name")
      .notEmpty(name, "name")
      .withMessage("Product price is required", "price")
      .notEmpty(price, "price")
      .withMessage("Product price can only be number or float", "price")
      .isFloat(price, "price")
      .withMessage("Product stock is required", "stock")
      .notEmpty(stock, "stock")
      .withMessage("Product stock can only be number", "stock")
      .isNumber(stock, "stock");

    if (!validator.isValid()) {
      const errors = validator.getErrors();
      return res
        .status(400)
        .json({ status: "error", message: "An error occured", errors });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      stock,
    });
    await product.save();
    res.json({
      status: "success",
      message: "Product added successfully",
      product_id: product._id,
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

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, stock, price, category, image } = req.body;
    const productId = req.params.id;

    const validator = new inputValidator();

    validator
      .withMessage("Product name is required", "name")
      .notEmpty(name, "name")
      .withMessage("Product price is required", "price")
      .notEmpty(price, "price")
      .withMessage("Product price can only be number or float", "price")
      .isFloat(price, "price")
      .withMessage("Product stock is required", "stock")
      .notEmpty(stock, "stock")
      .withMessage("Product stock can only be number", "stock")
      .isNumber(stock, "stock");

    if (!validator.isValid()) {
      const errors = validator.getErrors();
      return res
        .status(400)
        .json({ status: "error", message: "An error occured", errors });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }

    product.name = name;
    product.description = description;
    product.stock = stock;
    product.price = price;
    product.category = category;
    product.image = image;

    await product.save();
    res.json({ status: "success", message: "Product updated successfully" });
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
