import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
// import paymentRoutes from "./routes/payment.route.js";
import analyticsRoute from "./routes/analytics.route.js";
import addressRoutes from "./routes/address.route.js";
import shippingrateRoutes from "./routes/shippingrate.route.js";
import trackingRoutes from "./routes/tracking.route.js";
import blogRoutes from "./routes/blog.route.js";
import staticPageRoutes from "./routes/pages.route.js";
import faqRoutes from "./routes/faq.route.js";
import categoryRoutes from "./routes/categories.route.js";
import { connectDB } from "./lib/db.js";
import productVariantRoutes from "./routes/productVariant.route.js";
import supportTickerRoutes from "./routes/supportTicket.route.js";
import subsRoutes from "./routes/subscription.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware with environment-based frontend URL
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
// app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoute);
app.use("/api/addresses", addressRoutes);
app.use("/api/rates", shippingrateRoutes);
app.use("/api/orders", trackingRoutes);
app.use("api/blogs", blogRoutes);
app.use("/api/pages", staticPageRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products/:id/variants", productVariantRoutes);
app.use("/api/tickets", supportTickerRoutes);
app.use("/api/subscription", subsRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
    connectDB();
});