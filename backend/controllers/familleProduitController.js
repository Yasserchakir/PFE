const FamilleProduit = require('../models/FamilleProduit');

// **Créer une nouvelle famille de produit**
exports.createFamille = async (req, res) => {
    try {
        const { nom, description, createdBy } = req.body;
        const newFamille = new FamilleProduit({ nom, description, createdBy });
        await newFamille.save();
        res.status(201).json(newFamille);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// **Récupérer toutes les familles de produits**
exports.getAllFamilles = async (req, res) => {
    try {
        const familles = await FamilleProduit.find().populate('createdBy', 'name email');
        res.status(200).json(familles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// **Récupérer une famille de produit par ID**
exports.getFamilleById = async (req, res) => {
    try {
        const famille = await FamilleProduit.findById(req.params.id).populate('createdBy', 'name email');
        if (!famille) return res.status(404).json({ message: 'Famille non trouvée' });
        res.status(200).json(famille);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// **Mettre à jour une famille de produit**
exports.updateFamille = async (req, res) => {
    try {
        const { nom, description } = req.body;
        const famille = await FamilleProduit.findByIdAndUpdate(req.params.id, { nom, description }, { new: true });
        if (!famille) return res.status(404).json({ message: 'Famille non trouvée' });
        res.status(200).json(famille);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// **Supprimer une famille de produit**
exports.deleteFamille = async (req, res) => {
    try {
        const famille = await FamilleProduit.findByIdAndDelete(req.params.id);
        if (!famille) return res.status(404).json({ message: 'Famille non trouvée' });
        res.status(200).json({ message: 'Famille supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
