const mongoose = require('mongoose');

// Define the bill schema
const billSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerContact: {
    type: String,
    required: true,
  },
  paymentMode: {
    type: String,
    required: true,
  },
  subTotal: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  cartItems: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  billCode: {
    type: String,
    unique: true, // Ensures each billCode is unique
  },
}, { timestamps: false });

module.exports = mongoose.model("Bills", billSchema);