const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Import User model
const User = require('./User');  // Adjust the path if necessary

const productSchema = new Schema({
  nomProduit: { type: String, required: true },
  descriptionProduit: { type: String, required: true },
  prixUnitaire: { type: Number, required: true, min: 0 },
  tva: { type: Number, required: true, enum: [0, 7, 13, 19] },
  prixTotal: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, required: true },
  quantiteDisponible: { type: Number, required: true, min: 0 },
  // Change this to reference User instead of Vendeur
  vendeur: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  statutProduit: { type: String, enum: ['Disponible', 'Epuisé', 'Retiré'], default: 'Disponible' },
  promotionActive: { type: Boolean, default: false },
  reduction: { type: Number, min: 0, max: 100 },
  prixFinal: { type: Number, required: true, min: 0 },
  dateAjout: { type: Date, default: Date.now },
  idFamille: { type: Schema.Types.ObjectId, ref: 'FamilleProduit', required: true }
}, { timestamps: true });

productSchema.pre('validate', function (next) {
  this.prixTotal = this.prixUnitaire + (this.prixUnitaire * this.tva / 100);
  this.prixFinal = this.promotionActive && this.reduction
    ? this.prixTotal - (this.prixTotal * this.reduction / 100)
    : this.prixTotal;
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
