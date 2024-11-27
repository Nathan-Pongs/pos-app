const itemModel = require('../models/ItemModel');

// Get all items
const getItemController = async (req, res) => {
  try {
    const items = await itemModel.find();
    res.status(200).send(items);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching items');
  }
};

// Add a new item
const addItemController = async (req, res) => {
  try {
    const newItem = new itemModel(req.body);
    await newItem.save();
    res.status(201).send('Item created successfully!');
  } catch (error) {
    console.log(error);
    res.status(400).send('Error creating item');
  }
};

// Update an item by ID
const updateItemController = async (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedItem = await itemModel.findByIdAndUpdate(itemId, req.body, { new: true });

    if (!updatedItem) {
      return res.status(404).send('Item not found');
    }

    res.status(200).send('Item updated successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error updating item');
  }
};

// Delete an item by ID
const deleteItemController = async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItem = await itemModel.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).send('Item not found');
    }

    res.status(200).send('Item deleted successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error deleting item');
  }
};

module.exports = { getItemController, addItemController, updateItemController, deleteItemController };
