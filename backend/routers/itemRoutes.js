const express = require('express');
const {
  getItemController,
  addItemController,
  deleteItemController,
  updateItemController,
  getItemCount
} = require('../controllers/itemController');
const router = express.Router();

router.get('/get-item', getItemController);
router.get('/item-count', getItemCount);
router.post('/add-item', addItemController);
router.put('/update-item/:id', updateItemController);
router.delete('/delete-item/:id', deleteItemController);

module.exports = router;