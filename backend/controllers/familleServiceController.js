// controllers/familleServiceController.js

const FamilleService = require('../models/FamilleService');
const mongoose = require('mongoose');

// Create a new FamilleService
const createFamilleService = async (req, res) => {
  try {
    const { nom, description } = req.body;
    const familleService = new FamilleService({
      nom,
      description,
      createdBy: req.user._id,  // Assign the user who is creating this
    });

    await familleService.save();
    return res.status(201).json(familleService);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating FamilleService', error });
  }
};

// Get all FamilleServices

const getAllFamilleServices = async (req, res) => {
  try {
    const familleServices = await FamilleService.find()
      .populate("createdBy", "name email"); // Populate to get user details, adjust fields as needed
    res.json(familleServices);
  } catch (error) {
    console.error("Error fetching FamilleServices:", error);
    res.status(500).json({ message: "Error fetching FamilleServices", error });
  }
};

// Get a single FamilleService by ID
const getFamilleServiceById = async (req, res) => {
  try {
    const familleService = await FamilleService.findById(req.params.id).populate('createdBy', 'name email');
    if (!familleService) {
      return res.status(404).json({ message: 'FamilleService not found' });
    }
    return res.status(200).json(familleService);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching FamilleService', error });
  }
};

// Update a FamilleService
const updateFamilleService = async (req, res) => {
  try {
    const { nom, description } = req.body;
    const updatedFamilleService = await FamilleService.findByIdAndUpdate(
      req.params.id,
      { nom, description },
      { new: true }  // Return the updated document
    );
    
    if (!updatedFamilleService) {
      return res.status(404).json({ message: 'FamilleService not found' });
    }
    return res.status(200).json(updatedFamilleService);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating FamilleService', error });
  }
};

// Delete a FamilleService
const deleteFamilleService = async (req, res) => {
  try {
    const familleService = await FamilleService.findByIdAndDelete(req.params.id);
    if (!familleService) {
      return res.status(404).json({ message: 'FamilleService not found' });
    }
    return res.status(200).json({ message: 'FamilleService deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting FamilleService', error });
  }
};

module.exports = {
  createFamilleService,
  getAllFamilleServices,
  getFamilleServiceById,
  updateFamilleService,
  deleteFamilleService,
};
