const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const FamilleService = require('../models/FamilleService'); // Import the FamilleService model
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

// Create a new service (protected route)
router.post('/', authMiddleware, async (req, res) => {
    try {
      // Extract values from the request body
      const {
        servicename,
        description,
        availability,
        price,
        tva,
        promotionActive,
        reduction,
        media,
        idFamille
      } = req.body;
  
      // Create a new service, setting the createdBy field to the authenticated user's ID
      const newService = new Service({
        servicename,
        description,
        availability,
        price,
        tva,
        promotionActive,
        reduction,
        media,
        createdBy: req.user.id, // Automatically use the user's ID from the token
        idFamille
      });
  
      // Save the service to the database
      await newService.save();
      res.json(newService); // Return the created service as a response
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// Get all services (protected route) with populated FamilleService
router.get('/', authMiddleware, async (req, res) => {
  try {
    const services = await Service.find().populate('idFamille'); // Populate the idFamille field
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single service by ID (protected route) with populated FamilleService
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('idFamille'); // Populate the idFamille field
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a service by ID (protected route)
// Update service by ID
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedService = await Service.findByIdAndUpdate(id, req.body, { new: true });
      
      if (!updatedService) {
        return res.status(404).json({ message: "Service not found!" });
      }
  
      res.json(updatedService);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
// Delete a service by ID (protected route)
router.delete('/:id',authMiddleware, async (req, res) => {
    try {
      const service = await Service.findByIdAndDelete(req.params.id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.json({ message: 'Service deleted successfully' });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: 'Server error, please try again.' });
    }
  });

module.exports = router;
