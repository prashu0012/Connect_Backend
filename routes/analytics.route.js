import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { getSalesReport, getUserActivity, getProductMetrics, getUserEngagement } from "../controllers/analytics.controller.js";

const router = express.Router();

// User Analytics
router.get("/user",protectRoute, getUserActivity);


// Admin Reports
router.get("/sales", protectRoute, adminRoute, getSalesReport);
router.get("/products", protectRoute, adminRoute, getProductMetrics);
router.get("/users", protectRoute, adminRoute, getUserEngagement);

export default router;