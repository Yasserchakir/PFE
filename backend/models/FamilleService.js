const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schéma pour la famille de service
const familleServiceSchema = new Schema({
  nom: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  }
}, { timestamps: true });

const FamilleService = mongoose.model('FamilleService', familleServiceSchema);

module.exports = FamilleService;
