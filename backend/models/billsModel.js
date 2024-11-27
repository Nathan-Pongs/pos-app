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

// Pre-save middleware to generate the unique billCode
billSchema.pre('save', async function (next) {
  const doc = this;
  if (doc.isNew) {
    const date = new Date();
    const dateString = date.toISOString().split('T')[0].replace(/-/g, ''); // Format YYYYMMDD

    try {
      // Get the count of documents with today's date
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const count = await mongoose.models.Bills.countDocuments({
        date: { $gte: startOfDay, $lt: endOfDay },
      });

      // Generate billCode in YYYYMMDD-00001 format
      const paddedCounter = (count + 1).toString().padStart(5, '0');
      doc.billCode = `${dateString}-${paddedCounter}`;
    } catch (error) {
      return next(error); // Pass error to the next middleware
    }
  }
  next();
});

module.exports = mongoose.model("Bills", billSchema);