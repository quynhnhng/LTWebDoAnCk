import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// Routes
import authRoutes from "./routes/auth.js";
import shopRoutes from "./routes/shop.js";
import notificationRoutes from "./routes/notifications.js";
import forgotPasswordRoutes from "./routes/forgotPassword.js";
import adminProductRoutes from "./routes/adminProducts.js";
import adminCategoryRoutes from "./routes/adminCategories.js";
import adminOrderRoutes from "./routes/adminOrders.js";
import adminUserRoutes from "./routes/adminUsers.js";
import adminAccountRoutes from "./routes/adminAccounts.js";
import adminAdminRoutes from "./routes/adminAdmins.js";
import adminDashboardRoutes from "./routes/adminDashboard.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

await connectDB();

// Routes công khai
app.use("/api", authRoutes);
app.use("/api", shopRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", forgotPasswordRoutes); // forgot-password, reset-password, verify-reset-token

// Routes admin
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/accounts", adminAccountRoutes);
app.use("/api/admin/admins", adminAdminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Backend dang chay tai http://localhost:${PORT}`);
});
