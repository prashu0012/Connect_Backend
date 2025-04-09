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

// checkout implementation
import bodyParser from "body-parser";
import { v4 as uuidv4 } from 'uuid';
import checkoutRoutes from "./routes/checkout.route.js";
import crypto from "crypto";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware with environment-based frontend URL
app.use(cors({
    origin: [process.env.FRONTEND_URL,"http://localhost:5173","https://utsavimart.netlify.app"],
  //   origin: (origin, callback) => {
  //   callback(null, origin); // cccept all origins dynamically
  // },
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
app.use("/api", checkoutRoutes)

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
    connectDB();
});

// Checkout page implementation


// Verify Razorpay webhook signature
const verifyRazorpayWebhook = (req) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
    
    return digest === signature;
  };
  
  // Razorpay webhook endpoint
  app.post('/api/razorpay-webhook', async (req, res) => {
    try {
      // Verify the webhook signature
      const isValid = verifyRazorpayWebhook(req);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
      
      // Handle different event types
      const event = req.body.event;
      
      if (event === 'payment.authorized') {
        const paymentId = req.body.payload.payment.entity.id;
        const orderId = req.body.payload.payment.entity.notes.order_id;
        
        // Update order status to 'paid'
        await Order.findByIdAndUpdate(orderId, {
          status: 'paid',
          transactionId: paymentId,
          paymentDate: new Date()
        });
        
        // You can also trigger additional actions here like:
        // - Sending order confirmation email
        // - Updating inventory
        // - Creating invoice
      }
      
      // Always respond with 200 to Razorpay
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: error.message });
    }
  });