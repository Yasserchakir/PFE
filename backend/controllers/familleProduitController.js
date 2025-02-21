const FamilleProduit = require("../models/FamilleProduit") // Ensure correct model path

// Get all FamilleProduits
exports.getAllFamilleProduits = async (req, res) => {
  try {
    const familleProduits = await FamilleProduit.find();
    res.status(200).json(familleProduits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again." });
  }
};

// Get a single FamilleProduit by ID
exports.getFamilleProduitById = async (req, res) => {
  try {
    const familleProduit = await FamilleProduit.findById(req.params.id);
    if (!familleProduit) {
      return res.status(404).json({ message: "FamilleProduit not found" });
    }
    res.status(200).json(familleProduit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again." });
  }
};

// Create a new FamilleProduit
exports.createFamilleProduit = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log the incoming request body
    const { nom, description, createdBy } = req.body;

    if (!nom || !description || !createdBy) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newFamilleProduit = new FamilleProduit({
      nom,
      description,
      createdBy
    });

    await newFamilleProduit.save();
    res.status(201).json(newFamilleProduit);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: "Server error, please try again." });
  }
};



// Update an existing FamilleProduit by ID
exports.updateFamilleProduit = async (req, res) => {
  try {
    const { name, description } = req.body; // Assuming these are the fields
    const familleProduit = await FamilleProduit.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (!familleProduit) {
      return res.status(404).json({ message: "FamilleProduit not found" });
    }
    res.status(200).json(familleProduit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again." });
  }
};

// Delete a FamilleProduit by ID
exports.deleteFamilleProduit = async (req, res) => {
  try {
    const familleProduit = await FamilleProduit.findByIdAndDelete(req.params.id);
    if (!familleProduit) {
      return res.status(404).json({ message: "FamilleProduit not found" });
    }
    res.status(200).json({ message: "FamilleProduit deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again." });
  }
};
