const express = require('express');
const router = express.Router();
const familleProduitController = require('../controllers/familleProduitController');

// Définition des routes CRUD
router.post('/', familleProduitController.createFamille);  // Créer une famille de produit
router.get('/', familleProduitController.getAllFamilles); // Récupérer toutes les familles
router.get('/:id', familleProduitController.getFamilleById); // Récupérer une famille par ID
router.put('/:id', familleProduitController.updateFamille); // Mettre à jour une famille
router.delete('/:id', familleProduitController.deleteFamille); // Supprimer une famille

module.exports = router;
