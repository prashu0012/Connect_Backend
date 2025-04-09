// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   products: [
//     {
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         min: 1,
//       },
//       price: {
//         type: Number,
//         required: true,
//         min: 0,
//       },
//     },
//   ],
//   totalAmount: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   // stripeSessionId: {
//   //   type: String,
//   //   unique: true,
//   // },
// },{ timestamps: true }
// );

// // const Order = mongoose.model("Order", orderSchema);
// // export default Order;

// export const Order = mongoose.model("Order", orderSchema);


import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({

  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  shippingMethod: {
    type: String,
    required: true,
    enum: ['ship', 'pickup']
  },
  shippingAddress: {
    firstName: String,
    lastName: String,
    company: String,
    address: String,
    apartment: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
    phone: String
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    company: String,
    address: String,
    apartment: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
    phone: String
  },
  sameAsBilling: {
    type: Boolean,
    default: true
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'razorpay'
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  discountCode: String,
  discountAmount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'payment_failed'],
    default: 'pending'
  },
  transactionId: String,
  paymentDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);