import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { getCategories, createCategory, updateCategory, deleteCategory, getSubcategories } from "../controllers/categories.controller.js";

const router = express.Router();

// Category Routes
router.get("/", getCategories);
router.post("/", protectRoute, adminRoute, createCategory);
router.put("/:id", protectRoute, adminRoute, updateCategory);
router.delete("/:id", protectRoute, adminRoute, deleteCategory);

// Subcategory Routes
router.get("/:id/subcategories", getSubcategories);

export default router;