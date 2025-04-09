import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  images: [String],
  category: String,
  inventory: {
    type: Number,
    default: 0
  },
  sku: String,
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);