const express = require("express");
const router = express.Router();

// Import the FamilleProduitController
const FamilleProduitController = require("../controllers/familleProduitController");

// Routes for FamilleProduit
// Get all FamilleProduits
router.get("/", FamilleProduitController.getAllFamilleProduits);

// Get a single FamilleProduit by ID
router.get("/:id", FamilleProduitController.getFamilleProduitById);

// Create a new FamilleProduit
router.post("/", FamilleProduitController.createFamilleProduit);

// Update an existing FamilleProduit
router.put("/:id", FamilleProduitController.updateFamilleProduit);

// Delete a FamilleProduit by ID
router.delete("/:id", FamilleProduitController.deleteFamilleProduit);

module.exports = router;
