const express = require('express');
const router = express.Router();
const multer = require("multer");
const { 
    getAllServices, 
    getServiceById, 
    createService, 
    updateService, 
    deleteService 
} = require('../controllers/serviceController');

// Set up multer storage
const storage = multer.memoryStorage();  // Memory storage for files
const upload = multer({ storage });

// Routes
router.post('/services', upload.array('media', 5), createService);  // Create a service (with media)
router.get('/services', getAllServices);  // Get all services
router.get('/services/:id', getServiceById);  // Get a single service by ID
router.put('/services/:id', updateService);  // Update a service
router.delete('/services/:id', deleteService);  // Delete a service

module.exports = router;
