const express = require("express");
const { getProducts } = require("../controllers/ProductController");

const router = express.Router();

router.get("/", getProducts);

module.exports = router;
