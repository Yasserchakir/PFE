const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  servicename: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  availability: {
    type: String,
    enum: ['ouvert', 'fermé'],
  },
  price: {
    type: Number,
  },
  state: {
    type: String,
    enum: ['à faire', 'en cours', 'terminé'],
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
  },
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
