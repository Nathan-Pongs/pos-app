const express = require('express');
const {
  getItemController,
  addItemController,
  deleteItemController,
  updateItemController
} = require('../controllers/itemController');
const router = express.Router();

router.get('/get-item', getItemController);
router.post('/add-item', addItemController);
router.put('/update-item/:id', updateItemController);
router.delete('/delete-item/:id', deleteItemController);

module.exports = router;