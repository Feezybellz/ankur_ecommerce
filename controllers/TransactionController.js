const Transaction = require("../models/Transaction");

/**
 * Get Top 3 Most-Purchased Items
 */
exports.getTopPurchasedItems = async (req, res) => {
  try {
    // Fetch transactions from the database
    const transactions = await Transaction.find({}, "status products");

    // Count purchases for each product
    const productCounts = {};

    transactions.forEach((transaction) => {
      if (["successful"].includes(transaction.status)) {
        transaction.products.forEach((item) => {
          const productId = item.product.toString();
          productCounts[productId] =
            (productCounts[productId] || 0) + item.quantity;
        });
      }
    });

    // Sort products by purchase count in descending order
    const topProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([productId, count]) => ({ productId, count }));

    res.json({
      status: "success",
      topProducts,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
