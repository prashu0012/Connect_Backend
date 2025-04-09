import Order from "../models/order.model.js";
import User from "../models/UserCheckout.model.js";
import Product from "../models/ProductCheckout.model.js";


export const newOrder = async (req, res) => {
  try {
    const {
      email,
      shippingMethod,
      shippingAddress,
      billingAddress,
      sameAsBilling,
      paymentMethod,
      items,
      subtotal,
      shippingCost,
      discountCode,
      total,
    } = req.body;

    const newOrder = new Order({
      orderNumber: uuidv4().substring(0, 8).toUpperCase(),
      email,
      shippingMethod,
      shippingAddress,
      billingAddress: sameAsBilling ? shippingAddress : billingAddress,
      paymentMethod,
      items,
      subtotal,
      shippingCost: shippingCost || 0,
      discountCode,
      discountAmount: 0, // This would be calculated based on your discount logic
      total,
      status: "pending",
      createdAt: new Date(),
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      order: savedOrder,
      paymentUrl: `${process.env.PAYMENT_GATEWAY_URL}?orderId=${savedOrder._id}`,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

export const shippingMethod = async (req, res) => {
  try {
    const { country, state, pincode } = req.body;

    // In a real application, you would query your shipping rules database
    // This is a simplified example
    const shippingMethods = [
      {
        id: "standard",
        name: "Standard Shipping",
        price: 150,
        estimatedDelivery: "3-5 business days",
      },
      {
        id: "express",
        name: "Express Shipping",
        price: 350,
        estimatedDelivery: "1-2 business days",
      },
    ];

    res.status(200).json({ success: true, shippingMethods });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching shipping methods",
        error: error.message,
      });
  }
};

export const applyDiscount = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    // In a real application, you would query your discount codes database
    // This is a simplified example
    const discountCodes = {
      WELCOME10: { type: "percentage", value: 10 },
      FLAT500: { type: "fixed", value: 500 },
    };

    if (!discountCodes[code]) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid discount code" });
    }

    const discount = discountCodes[code];
    let discountAmount = 0;

    if (discount.type === "percentage") {
      discountAmount = (subtotal * discount.value) / 100;
    } else if (discount.type === "fixed") {
      discountAmount = discount.value;
    }

    res.status(200).json({
      success: true,
      discountCode: code,
      discountAmount,
      newTotal: subtotal - discountAmount,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error applying discount",
        error: error.message,
      });
  }
};

export const orderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching order",
        error: error.message,
      });
  }
};

export const Paymentwebhook = async (req, res) => {
  try {
    const { orderId, status, transactionId } = req.body;

    // Update order status based on payment result
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.status = status === "success" ? "paid" : "payment_failed";
    order.transactionId = transactionId;
    order.paymentDate = new Date();

    await order.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error processing payment webhook",
        error: error.message,
      });
  }
};
