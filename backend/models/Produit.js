const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const produitSchema = new Schema({
  nomProduit: { type: String, required: true },
  descriptionProduit: { type: String, required: true },
  prixUnitaire: { type: Number, required: true, min: 0 },

  // TVA avec valeurs autorisées
  tva: { type: Number, required: true, enum: [0, 7, 13, 19] },

  prixTotal: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, required: true },
  quantiteDisponible: { type: Number, required: true, min: 0 },
  
  // Référence au vendeur
  vendeur: { type: Schema.Types.ObjectId, ref: 'Vendeur', required: true },

  statutProduit: { type: String, enum: ['Disponible', 'Epuisé', 'Retiré'], default: 'Disponible' },
  promotionActive: { type: Boolean, default: false },
  reduction: { type: Number, min: 0, max: 100 },
  prixFinal: { type: Number, required: true, min: 0 },

  // Date d'ajout automatique avec timestamps
  dateAjout: { type: Date, default: Date.now },

  // Association avec une famille de produits
  idFamille: { type: Schema.Types.ObjectId, ref: 'FamilleProduit', required: true }
}, { timestamps: true });

// Calcul automatique du prixTotal et prixFinal avant sauvegarde
produitSchema.pre('save', function (next) {
  // Prix total avec TVA
  this.prixTotal = this.prixUnitaire + (this.prixUnitaire * this.tva / 100);

  // Appliquer la réduction si la promotion est active
  if (this.promotionActive && this.reduction) {
    this.prixFinal = this.prixTotal - (this.prixTotal * this.reduction / 100);
  } else {
    this.prixFinal = this.prixTotal;
  }
  
  next();
});

const Produit = mongoose.model('Produit', produitSchema);
module.exports = Produit;
