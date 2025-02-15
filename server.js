const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");

// Import Routes
const UserAuthRoutes = require("./routes/UserAuthRoutes");
const ProductRoutes = require("./routes/ProductRoutes");
const PaymentRoutes = require("./routes/PaymentRoutes");
const AdminRoutes = require("./routes/AdminRoutes");

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
app.use("/api/products", ProductRoutes);
app.use("/api/payment", PaymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
