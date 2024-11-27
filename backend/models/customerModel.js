const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Define the customer schema
const customerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerContact: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: false });

// Add the auto-increment plugin
customerSchema.plugin(AutoIncrement, { inc_field: 'customerID' });

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
