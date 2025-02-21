// routes/familleServiceRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createFamilleService,
  getAllFamilleServices,
  getFamilleServiceById,
  updateFamilleService,
  deleteFamilleService
} = require('../controllers/familleServiceController');

// Route to create a FamilleService
router.post('/', authMiddleware, createFamilleService);

// Route to get all FamilleServices
router.get('/', authMiddleware, getAllFamilleServices);

// Route to get a specific FamilleService by ID
router.get('/:id', authMiddleware, getFamilleServiceById);

// Route to update a FamilleService
router.put('/:id', authMiddleware, updateFamilleService);

// Route to delete a FamilleService
router.delete('/:id', authMiddleware, deleteFamilleService);

module.exports = router;
