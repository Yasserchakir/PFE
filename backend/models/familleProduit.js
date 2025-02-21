const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Require the User model to ensure it's registered
require('./User'); // Adjust the path based on where user.js is located

const familleProduitSchema = new Schema({
  nom: { type: String, required: true, unique: true }, // Nom de la famille
  description: { type: String, required: true }, // Description de la famille
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Référence à l'utilisateur (Admin or Vendeur)
}, { timestamps: true });

const FamilleProduit = mongoose.model('FamilleProduit', familleProduitSchema);
module.exports = FamilleProduit;
