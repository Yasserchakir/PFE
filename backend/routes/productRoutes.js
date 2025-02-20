const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require("../middleware/upload"); // Middleware pour gérer les fichiers

// Créer un produit (authentification requise)
router.post('/', authMiddleware, upload.array('imageUrl', 5), productController.createProduct);

// Obtenir tous les produits
router.get('/', productController.getProducts);

// Obtenir un produit par son ID
router.get('/:id', productController.getProductById);

// Mettre à jour un produit (authentification requise)
router.put('/:id', authMiddleware, upload.array('imageUrl', 5), productController.updateProduct);

// Supprimer un produit (authentification requise)
router.delete('/:id', authMiddleware, productController.deleteProduct);

// Obtenir les produits d'un vendeur spécifique
router.get('/seller/:sellerId', productController.getProductsBySellerId);

module.exports = router;