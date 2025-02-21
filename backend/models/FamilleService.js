const mongoose = require('mongoose');

const familleServiceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User model
});

const FamilleService = mongoose.model('FamilleService', familleServiceSchema);

module.exports = FamilleService;