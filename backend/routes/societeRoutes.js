// routes/societeRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createSociete,
  getAllSocietes,
  getSocieteById,
  updateSociete,
  deleteSociete
} = require('../controllers/societeController');

// Route to create a new Societe
router.post('/', authMiddleware, createSociete);

// Route to get all Societes
router.get('/', authMiddleware, getAllSocietes);

// Route to get a specific Societe by ID
router.get('/:id', authMiddleware, getSocieteById);

// Route to update a Societe
router.put('/:id', authMiddleware, updateSociete);

// Route to delete a Societe
router.delete('/:id', authMiddleware, deleteSociete);

module.exports = router;
