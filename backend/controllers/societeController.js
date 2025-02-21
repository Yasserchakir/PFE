// controllers/societeController.js

const Societe = require('../models/Societe');

// Create a new Societe
const createSociete = async (req, res) => {
  try {
    const {
      typeVendeur, nomEntreprise, nomVendeur, numeroEnregistrement, secteurActivite, description,
      nomResponsable, email, numeroTelephone, adresseEntreprise, adresseCorrespondance, statutJuridique,
      ribIban, methodesPaiement
    } = req.body;

    const societe = new Societe({
      idUser: req.user._id,  // Set the idUser to the authenticated user's ID
      typeVendeur, nomEntreprise, nomVendeur, numeroEnregistrement, secteurActivite, description,
      nomResponsable, email, numeroTelephone, adresseEntreprise, adresseCorrespondance, statutJuridique,
      ribIban, methodesPaiement
    });

    await societe.save();
    return res.status(201).json(societe);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating Societe', error });
  }
};

// Get all Societes
const getAllSocietes = async (req, res) => {
  try {
    const societes = await Societe.find().populate('idUser', 'name email');
    return res.status(200).json(societes);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching Societes', error });
  }
};

// Get a specific Societe by ID
const getSocieteById = async (req, res) => {
  try {
    const societe = await Societe.findById(req.params.id).populate('idUser', 'name email');
    if (!societe) {
      return res.status(404).json({ message: 'Societe not found' });
    }
    return res.status(200).json(societe);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching Societe', error });
  }
};

// Update a Societe
const updateSociete = async (req, res) => {
  try {
    const {
      typeVendeur, nomEntreprise, nomVendeur, numeroEnregistrement, secteurActivite, description,
      nomResponsable, email, numeroTelephone, adresseEntreprise, adresseCorrespondance, statutJuridique,
      ribIban, methodesPaiement
    } = req.body;

    const updatedSociete = await Societe.findByIdAndUpdate(
      req.params.id,
      {
        typeVendeur, nomEntreprise, nomVendeur, numeroEnregistrement, secteurActivite, description,
        nomResponsable, email, numeroTelephone, adresseEntreprise, adresseCorrespondance, statutJuridique,
        ribIban, methodesPaiement
      },
      { new: true }  // Return the updated document
    );

    if (!updatedSociete) {
      return res.status(404).json({ message: 'Societe not found' });
    }
    return res.status(200).json(updatedSociete);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating Societe', error });
  }
};

// Delete a Societe
const deleteSociete = async (req, res) => {
  try {
    const societe = await Societe.findByIdAndDelete(req.params.id);
    if (!societe) {
      return res.status(404).json({ message: 'Societe not found' });
    }
    return res.status(200).json({ message: 'Societe deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting Societe', error });
  }
};

module.exports = {
  createSociete,
  getAllSocietes,
  getSocieteById,
  updateSociete,
  deleteSociete
};
