const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware'); // Import authentication middleware

// 🟢 Create a product (Only Authenticated Users)
router.post('/', authMiddleware, async (req, res) => {

  try {
    const newProduct = new Product({
      ...req.body,
      vendeur: req.user.id // Automatically set the authenticated user as the seller
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔵 Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('vendeur').populate('idFamille');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟡 Get a product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendeur').populate('idFamille');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟠 Update a product (Only the product owner can update)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Ensure the authenticated user is the product owner
    if (product.vendeur.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this product' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔴 Delete a product (Only the product owner can delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Ensure the authenticated user is the product owner
    if (product.vendeur.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
