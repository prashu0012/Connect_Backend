import express from "express";
import {
    getAllProducts,
    getProductsById,
    getFeaturedProducts,
    getRecommendedProducts,
    getProductByCategory,
    createProduct,
    toggleFeaturedProduct,
    deleteProduct,
} from "../controllers/product.controller.js";

import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProducts); //admin
router.get("/:id", getProductsById);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductByCategory);
router.get("/recommendations", getRecommendedProducts); // admin
router.post("/", protectRoute, adminRoute, createProduct); //admin
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct); //admin
router.delete("/:id", protectRoute, adminRoute, deleteProduct); //admin

export default router