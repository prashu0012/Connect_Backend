import express from "express";
// import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { newOrder, shippingMethod, applyDiscount, orderById, Paymentwebhook } from "../controllers/checkout.controller.js";

const router = express.Router();

router.post("/orders", newOrder);
router.post("/shipping-methods", shippingMethod);
router.post("/apply-discount", applyDiscount);
router.get("/orders/:id", orderById);
router.post("/payment-webhook", Paymentwebhook)


export default router;