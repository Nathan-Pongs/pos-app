const customerModel = require('../models/customerModel');

// Get all items
const getCustomerController = async (req, res) => {
  try {
    const customer = await customerModel.find();
    res.status(200).send(customer);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching customer');
  }
};

// Add a new item
const addCustomerController = async (req, res) => {
    try {
      const newCustomer = new customerModel(req.body);
      await newCustomer.save();
      res.status(201).send('Customer created successfully!');
    } catch (error) {
      console.log(error);
      res.status(400).send('Error creating customer');
    }
};  

const deleteCustomerController = async (req, res) => {
  try {
    const customerId = req.params.id;
    const deletedCustomer = await customerModel.findByIdAndDelete(customerId);

    if (!deletedCustomer) {
      return res.status(404).send('Customer not found');
    }

    res.status(200).send('Customer deleted successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error deleting Customer');
  }
};

module.exports = { getCustomerController, addCustomerController, deleteCustomerController };
