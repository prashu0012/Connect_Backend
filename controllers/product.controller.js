import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";
import { dirname } from "path";
import mongoose from "mongoose";  
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";





// ✅ Define __dirname manually for ES Modules
const __dirname = dirname(fileURLToPath(import.meta.url));




export const searchByName = async (req, res) => {
  try {
    const deity = req.query.deity || req.query.name; // fallback if name is passed

    if (!deity || typeof deity !== "string") {
      return res.status(400).json({ success: false, message: "Missing or invalid deity query parameter" });
    }

    const trimmedDeity = deity.trim();

    // Escape special regex characters
    const escapedDeity = trimmedDeity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Generate prefixes (e.g., "R", "Ra", "Ram", "Rama" for "Rama")
    const prefixes = [];
    for (let i = 1; i <= trimmedDeity.length; i++) {
      prefixes.push(trimmedDeity.substring(0, i));
    }

    const escapedPrefixes = prefixes.map(p => 
      p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );

    const regexPattern = `(${escapedDeity})|^(${escapedPrefixes.join('|')})$`;

    const products = await Product.find({
      $or: [
        { name: { $regex: regexPattern, $options: "i" } },
        { category: { $regex: regexPattern, $options: "i" } }
      ]
    });

    res.json({ success: true, products });
  } catch (error) {
    console.error("Search error:", error); // log the actual error
    res.status(500).json({ success: false, message: "Server Error" });
  }
};





export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // find all products
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getProductsById = async (req, res) => {
  console.log("user",req.user)
  const productId=req.params.id;
  try {
    const product = await Product.findById(productId); //find product by Id
    res.status(200).json({msg:product});
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    // if not in redis, fetch from mongodb
    /*.lean() is gonna return a plain javascript object intead of mongodb document
        which is good for performance */
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.json(404).json({ message: "No featured products found" });
    }

    // store in redis for future quick access

    await redis.set("featured-products", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(501).json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let cloudinaryResponse = null;

    if (image) {
      try {
        cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
      } catch (cloudinaryError) {
        console.log("Cloudinary Upload Error:", cloudinaryError);
        return res.status(400).json({ 
          message: "Image upload failed", 
          error: cloudinaryError.message 
        });
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });
    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(401).json({ message: " Product not found " });
    }
    if (product.image) {
      const publicId = product.image.split("").pop().split(".")[0]; //this will get the id of the image

      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("delete image from cloudinary");
      } catch (error) {
        console.log("error deleting image from cloudinary", error);
      }
    }
    await product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);
    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const rawCategory = req.params.category;
    const category = rawCategory.replace(/-/g, " ");

    const products = await Product.find({
      category: `{$regex: new RegExp(^${category}$, "i")}`,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updateProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json(updateProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in update cache function");
  }
}