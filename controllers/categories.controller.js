import { Category, Subcategory } from "../models/categories.model.js";
// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new category (Admin only)
export const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const categoryExists = await Category.findOne({ slug });

    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, slug });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update category (Admin only)
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = req.body.name || category.name;
    category.slug = req.body.slug || category.slug;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete category (Admin only)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get subcategories under a category
export const getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ category: req.params.id });

    if (!subcategories.length) {
      return res.status(404).json({ message: "No subcategories found" });
    }

    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};