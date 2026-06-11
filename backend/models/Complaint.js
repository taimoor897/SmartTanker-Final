// models/Complaint.js

const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },

  type: String,

  description: String,

  status: {
    type: String,
    default: 'Open'
  }

}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);