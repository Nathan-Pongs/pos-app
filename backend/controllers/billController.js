const billsModel = require('../models/billsModel');

// Get all items
const getBillController = async (req, res) => {
  try {
    const bills = await billsModel.find();
    res.status(200).send(bills);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching bills');
  }
};

// Add a new item
const addBillController = async (req, res) => {
    try {
      const newBill = new billsModel(req.body);
      await newBill.save();
      res.status(201).send('Bill created successfully!');
    } catch (error) {
      console.log(error);
      res.status(400).send('Error creating Bill');
    }
};  

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

module.exports = { getBillController, addBillController, deleteBillController };
