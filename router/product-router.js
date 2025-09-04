const express = require("express");
const Product = require("../models/Product-model");

const router = express.Router();

// ✅ Simple in-memory cache
let cache = null;
let lastFetch = 0;

// -------------------------
// 📌 Get all products
// -------------------------
router.get("/", async (req, res) => {
  try {
    const now = Date.now();

    // ✅ Serve from cache (valid for 1 min)
    if (cache && now - lastFetch < 60000) {
      return res.json(cache);
    }

    const products = await Product.find().lean(); // lean = faster
    cache = products;
    lastFetch = now;

    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({ error: "Server error while fetching products" });
  }
});

// -------------------------
// 📌 Add new product
// -------------------------
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    cache = null; // clear cache after new product

    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Error creating product:", err.message);
    res.status(400).json({ error: "Invalid product data" });
  }
});

// -------------------------
// 📌 Delete product
// -------------------------
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    cache = null; // clear cache after delete

    res.json({ message: "Product deleted", deletedProduct });
  } catch (err) {
    console.error("❌ Error deleting product:", err.message);
    res.status(500).json({ error: "Server error while deleting product" });
  }
});

// -------------------------
// 📌 Update quantity (increment/decrement)
// -------------------------
router.patch("/:id/quantity", async (req, res) => {
  try {
    const { action } = req.body; // 'increment' or 'decrement'
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (action === "increment") product.quantity += 1;
    if (action === "decrement" && product.quantity > 0) product.quantity -= 1;

    await product.save();
    cache = null; // clear cache after update

    res.json(product);
  } catch (err) {
    console.error("❌ Error updating quantity:", err.message);
    res.status(500).json({ error: "Server error while updating quantity" });
  }
});

// -------------------------
// 📌 Edit product details
// -------------------------
router.patch("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // validators keep data clean
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    cache = null; // clear cache after update

    res.json(updatedProduct);
  } catch (err) {
    console.error("❌ Error updating product:", err.message);
    res.status(500).json({ error: "Server error while updating product" });
  }
});

module.exports = router;
