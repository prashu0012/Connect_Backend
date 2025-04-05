import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // ✅ Import UUID

const productSchema = new mongoose.Schema({
  productId: { type: String, unique: true, required: true, default: uuidv4 }, 
  sku: { type: String, unique: true, required: true, default: uuidv4 }, //  Ensure unique SKU
  name: { type: String, required: true },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        min: 0,
        required: true
    },
    image:{
        type: String,
        required: [true, "Image is required"]
    },
    category:{
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    isFeatured:{
        type: Boolean,
        default: false
    }
}, {timestamps: true});


const Product = mongoose.model("Product", productSchema);

export default Product

