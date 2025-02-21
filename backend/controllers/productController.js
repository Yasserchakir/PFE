const Produit = require('../models/Product');
const mongoose = require('mongoose');

// Create a product
exports.createProduct = async (req, res) => {
  try {
    const { nomProduit, descriptionProduit, prixUnitaire, tva, quantiteDisponible, statutProduit, promotionActive, reduction, idFamille } = req.body;
    const imageUrl = req.files ? req.files.map(file => file.path) : [];

    const produit = new Produit({
      nomProduit,
      descriptionProduit,
      prixUnitaire,
      tva,
      quantiteDisponible,
      statutProduit,
      promotionActive,
      reduction,
      idFamille,
      imageUrl,
      vendeur: req.user.id, // Assuming seller is authenticated
    });

    await produit.save();
    res.status(201).json(produit);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const produits = await Produit.find().populate('vendeur', 'name');
    res.json(produits);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id).populate('vendeur', 'name');
    if (!produit) return res.status(404).json({ message: 'Product not found' });
    res.json(produit);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { nomProduit, descriptionProduit, prixUnitaire, tva, quantiteDisponible, statutProduit, promotionActive, reduction, idFamille } = req.body;
    const imageUrl = req.files ? req.files.map(file => file.path) : [];

    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ message: 'Product not found' });

    // Ensure the user is the owner
    if (produit.vendeur.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    // Update fields
    produit.nomProduit = nomProduit || produit.nomProduit;
    produit.descriptionProduit = descriptionProduit || produit.descriptionProduit;
    produit.prixUnitaire = prixUnitaire || produit.prixUnitaire;
    produit.tva = tva !== undefined ? tva : produit.tva;
    produit.quantiteDisponible = quantiteDisponible || produit.quantiteDisponible;
    produit.statutProduit = statutProduit || produit.statutProduit;
    produit.promotionActive = promotionActive !== undefined ? promotionActive : produit.promotionActive;
    produit.reduction = reduction !== undefined ? reduction : produit.reduction;
    produit.idFamille = idFamille || produit.idFamille;
    produit.imageUrl = imageUrl.length > 0 ? imageUrl : produit.imageUrl;

    await produit.save();
    res.json(produit);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ message: 'Product not found' });

    if (produit.vendeur.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await produit.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

// Get products by seller ID
exports.getProductsBySellerId = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: 'Invalid seller ID' });
    }

    const produits = await Produit.find({ vendeur: sellerId });

    if (produits.length === 0) {
      return res.status(404).json({ message: 'No products found for this seller' });
    }

    res.json(produits);
  } catch (error) {
    console.error('Error fetching products by seller ID:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
};
