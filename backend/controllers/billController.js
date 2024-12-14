const billsModel = require('../models/billsModel');

// Get all items
const getBillController = async (req, res) => {
  try {
    const bills = await billsModel.find();
    res.status(200).send(bills);
  } catch (error) {
    res.status(500).send('Error fetching bills');
  }
};

const getBillCount = async (req, res) => {
  try {
    const count = await billsModel.countDocuments();
    res.json({count});
  } catch (error) {
    res.status(500).send('Error fetching bills!')
  }
}


// Add a new item
const addBillController = async (req, res) => {
  try {
    const date = new Date();
    const dateString = date.toISOString().split('T')[0].replace(/-/g, ''); // Format YYYYMMDD

    // Define start and end of the day for filtering
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    // Count bills created today
    const count = await billsModel.countDocuments({
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    // Generate billCode in YYYYMMDD-00001 format
    const paddedCounter = (count + 1).toString().padStart(5, '0');
    const billCode = `${dateString}-${paddedCounter}`;

    // Create the new bill with the generated billCode
    const newBill = new billsModel({ ...req.body, billCode });
    await newBill.save();

    res.status(201).send('Bill created successfully!');
  } catch (error) {
    console.error('Error creating Bill:', error);
    res.status(400).send('Error creating Bill');
  }
}; 

const billCountController = async (req, res) => {
  try {
    const dateString = req.query.date; // Expecting date in YYYYMMDD format

    const startOfDay = new Date(
      `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}T00:00:00Z`
    );
    const endOfDay = new Date(
      `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}T23:59:59Z`
    );

    const count = await billsModel.countDocuments({
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting bills:', error);
    res.status(500).send('Error counting bills');
  }
}

const deleteBillController = async (req, res) => {
  try {
    const billId = req.params.id;
    const deletedBill = await billsModel.findByIdAndDelete(billId);

    if (!deletedBill) {
      return res.status(404).send('Bill not found');
    }

    res.status(200).send('Bill deleted successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error deleting bill');
  }
};

module.exports = { getBillController, addBillController, deleteBillController, billCountController, getBillCount };