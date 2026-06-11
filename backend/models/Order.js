const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  location: {
    type: String,
    required: true
  },

  waterQuantity: {
    type: Number,
    default: 1
  },

  date: String,
  time: String,

  status: {
    type: String,
    enum: ['pending', 'assigned', 'accepted', 'delivered', 'cancelled'],
    default: 'pending'
  }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);