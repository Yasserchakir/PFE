const mongoose = require('mongoose');
const FamilleService = require('./FamilleService'); // Assuming it's in the same folder

const serviceSchema = new mongoose.Schema({
  servicename: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  availability: {
    type: String,
    enum: ['ouvert', 'fermé'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  tva: {
    type: Number,
    required: true,
    enum: [0, 7, 13, 19], // VAT rates
  },
  priceTotal: {
    type: Number,
    required: true,
    min: 0,
  },
  promotionActive: {
    type: Boolean,
    default: false,
  },
  reduction: {
    type: Number,
    min: 0,
    max: 100,
  },
  finalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  state: {
    type: String,
    enum: ['à faire', 'en cours', 'terminé'],
    default: 'à faire',
  },
  media: [
    {
      type: String, // Store image/video URLs or file paths
    },
  ],
  addDate: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  idFamille: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilleService', // Reference to the FamilleService model
    required: true, // This ensures each service must belong to a family
  },
}, { timestamps: true });

// Pre-save hook to calculate priceTotal and finalPrice
serviceSchema.pre('validate', function(next) {
  this.priceTotal = this.price + (this.price * this.tva / 100);
  this.finalPrice = this.promotionActive && this.reduction
    ? this.priceTotal - (this.priceTotal * this.reduction / 100)
    : this.priceTotal;
  next();
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
