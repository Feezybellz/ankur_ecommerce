const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");

const AuthMiddleware = require("./middleware/AuthMiddleware");
const AdminAuthMiddleware = require("./middleware/AdminAuthMiddleware");

// Import Routes
const AdminRoutes = require("./routes/AdminRoutes");
const UserAuthRoutes = require("./routes/UserAuthRoutes");
const ProductRoutes = require("./routes/ProductRoutes");
const PaymentRoutes = require("./routes/PaymentRoutes");
const CartRoutes = require("./routes/CartRoutes");
const OrderRoutes = require("./routes/OrderRoutes");

const { getTopPurchasedItems } = require("./controllers/TransactionController");

dotenv.config();
connectDB();

if (
  process.env.SUPER_ADMIN_NAME &&
  process.env.SUPER_ADMIN_EMAIL &&
  process.env.SUPER_ADMIN_PASSWORD
) {
  // create admin user
  const { createAdminUser } = require("./config/CreateAdminUser");
  createAdminUser();
}
const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/admin", AdminRoutes);
app.use("/api/auth", UserAuthRoutes);
app.use("/api/product", ProductRoutes);
app.get("/api/products/:page", ProductRoutes.getProducts);
app.get("/api/products", ProductRoutes.getProducts);
app.use("/api/payment", PaymentRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/order", OrderRoutes);
app.get("/api/orders", AuthMiddleware, OrderRoutes.getUserOrders);

app.get("/api/top-products", getTopPurchasedItems);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
